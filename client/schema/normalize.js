import fs from "fs";
import YAML from "yaml";

// -------------------------------------------------
// Load Spec
// -------------------------------------------------
const inputPath = "./client/schema/source/openapi.yaml";
const outputPath = "./client/schema/normalized/openapi.normalized.yaml";

const raw = fs.readFileSync(inputPath, "utf8");
const spec = YAML.parse(raw);

spec.components ??= {};
spec.components.schemas ??= {};

const components = spec.components.schemas;

// -------------------------------------------------
// Helpers
// -------------------------------------------------
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const singular = (name) => (name.endsWith("s") ? name.slice(0, -1) : name);

const isResponseModel = (name) =>
  name.endsWith("Response") && !name.endsWith("PaginatedResponse");
const isPaginated = (name) =>
  name.endsWith("Paginated") || name.endsWith("PaginatedData");

// Deep equality check for schemas
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;
  if (obj1 === null || obj2 === null) return false;

  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();

  if (keys1.length !== keys2.length) return false;
  if (keys1.join(",") !== keys2.join(",")) return false;

  for (const key of keys1) {
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

// Normalize a schema by converting nested inline objects to $refs
function normalizeSchemaToRefs(schema, parentName) {
  if (!schema || typeof schema !== "object") return schema;
  if (schema.$ref) return schema;

  const normalized = { ...schema };

  if (normalized.properties) {
    normalized.properties = { ...normalized.properties };

    for (const [propName, propSchema] of Object.entries(
      normalized.properties,
    )) {
      if (!propSchema || typeof propSchema !== "object") continue;
      if (propSchema.$ref) continue;

      if (propSchema.type === "object" && !propSchema.additionalProperties) {
        // This would become a nested ref
        const nestedName = `${parentName}${cap(propName)}`;
        normalized.properties[propName] = {
          $ref: `#/components/schemas/${nestedName}`,
        };
      } else if (propSchema.type === "array" && propSchema.items) {
        // Recursively normalize array items
        normalized.properties[propName] = {
          ...propSchema,
          items: normalizeSchemaToRefs(
            propSchema.items,
            `${parentName}${cap(propName)}`,
          ),
        };
      }
    }
  }

  return normalized;
}

// Generate unique schema name with numeric suffix if needed
function getUniqueSchemaName(baseName, schemaName) {
  const suffix = "PaginatedData";

  let candidateName = baseName + suffix;
  let counter = 1;

  while (components[candidateName]) {
    candidateName = `${baseName}${suffix}${counter}`;
    counter++;
  }

  return candidateName;
}

function toCamelCase(str) {
  // Convert snake_case or kebab-case to CamelCase
  return str
    .split(/[_-]/)
    .map((word) => cap(word))
    .join("");
}

// -------------------------------------------------
// Auto-detect and extract PaginatedMeta/Links from existing schemas
// -------------------------------------------------
console.log("\n[AUTO-DETECT] Scanning for paginated schemas...");

// Snapshot keys before mutation
const schemaNames = Object.keys(components);

// Find first paginated schema to extract meta/links structure
let paginatedMetaTemplate = null;
let paginatedLinksTemplate = null;

for (const schemaName of schemaNames) {
  const schema = components[schemaName];
  if (!schema?.properties) continue;

  // Check for *PaginatedResponse pattern
  const isPaginatedResponse = schemaName.endsWith("PaginatedResponse");

  // For *PaginatedResponse, meta/links are nested in data.properties
  // For *Paginated, meta/links are at root level
  let propsToCheck;
  if (isPaginatedResponse && schema.properties.data?.properties) {
    propsToCheck = schema.properties.data.properties;
  } else if (!isPaginatedResponse) {
    propsToCheck = schema.properties;
  }

  if (!propsToCheck) continue;

  // Extract meta structure
  if (propsToCheck.meta && !paginatedMetaTemplate) {
    if (propsToCheck.meta.$ref) {
      console.log(`  [INFO] Found existing meta ref in ${schemaName}`);
    } else if (propsToCheck.meta.type === "object") {
      paginatedMetaTemplate = {
        type: "object",
        properties: { ...propsToCheck.meta.properties },
        required: [...(propsToCheck.meta.required || [])],
      };
      console.log(`  [EXTRACT] Meta structure from ${schemaName}`);
    }
  }

  // Extract links structure
  if (propsToCheck.links && !paginatedLinksTemplate) {
    if (propsToCheck.links.$ref) {
      console.log(`  [INFO] Found existing links ref in ${schemaName}`);
    } else if (propsToCheck.links.type === "object") {
      paginatedLinksTemplate = {
        type: "object",
        properties: { ...propsToCheck.links.properties },
        required: [...(propsToCheck.links.required || [])],
      };
      console.log(`  [EXTRACT] Links structure from ${schemaName}`);
    }
  }

  // Stop once we have both templates
  if (paginatedMetaTemplate && paginatedLinksTemplate) break;
}

// Create global schemas if templates were found
if (paginatedMetaTemplate) {
  components.PaginatedMeta ??= paginatedMetaTemplate;
  console.log("  [CREATE] PaginatedMeta");
} else {
  console.log(
    "  [WARN] No paginated meta found, skipping PaginatedMeta creation",
  );
}

if (paginatedLinksTemplate) {
  components.PaginatedLinks ??= paginatedLinksTemplate;
  console.log("  [CREATE] PaginatedLinks");
} else {
  console.log(
    "  [WARN] No paginated links found, skipping PaginatedLinks creation",
  );
}

// -------------------------------------------------
// Extract nested inline objects into new schemas
// -------------------------------------------------
function extractNestedObjects(modelName, modelSchema) {
  const props = modelSchema.properties || {};
  modelSchema.properties = props;

  for (const [propName, propSchema] of Object.entries(props)) {
    if (!propSchema || typeof propSchema !== "object") continue;
    if (propSchema.$ref) continue;
    if (propSchema.type !== "object") continue;
    if (propSchema.additionalProperties) continue; // skip map types

    const nestedName = `${modelName}${cap(propName)}`;

    if (!components[nestedName]) {
      components[nestedName] = { ...propSchema };
      console.log(`      [NESTED] ${nestedName}`);
    }

    props[propName] = {
      $ref: `#/components/schemas/${nestedName}`,
    };
  }
}

// -------------------------------------------------
// PAGINATED NORMALIZATION
// -------------------------------------------------
function normalizePaginated(schemaName, schema) {
  schema.properties ??= {};

  // Handle both *Paginated and *PaginatedData
  const baseName = schemaName
    .replace(/PaginatedData$/, "")
    .replace(/Paginated$/, "");

  // Data is always at root level for *Paginated and *PaginatedData
  const dataProperty = schema.properties.data;

  if (dataProperty?.type === "array") {
    const items = dataProperty.items;

    if (items && !items.$ref) {
      // create base model if missing
      if (!components[baseName]) {
        components[baseName] = {
          type: items.type || "object",
          properties: { ...(items.properties || {}) },
          required: [...(items.required || [])],
        };
        console.log(`    [CREATE] Base model: ${baseName}`);
      }

      // replace inline -> $ref
      dataProperty.items = {
        $ref: `#/components/schemas/${baseName}`,
      };

      // extract nested inline object props
      extractNestedObjects(baseName, components[baseName]);
    }
  }

  // enforce standardized meta / links (only if they exist)
  if (paginatedMetaTemplate) {
    schema.properties.meta = { $ref: "#/components/schemas/PaginatedMeta" };
  }

  if (paginatedLinksTemplate) {
    schema.properties.links = { $ref: "#/components/schemas/PaginatedLinks" };
  }
}

// -------------------------------------------------
// RESPONSE NORMALIZATION
// -------------------------------------------------
function normalizeResponseSchema(schemaName, schema) {
  const isPaginatedResponse = schemaName.endsWith("PaginatedResponse");

  // For *PaginatedResponse, extract the nested data object as *PaginatedData
  if (isPaginatedResponse) {
    const nestedData = schema.properties?.data;
    if (!nestedData || nestedData.$ref) return;

    // Only process if data is an inline object
    if (nestedData.type !== "object" || !nestedData.properties) return;

    // Create the *PaginatedData schema name
    const baseName = schemaName.replace(/Response$/, "");
    const paginatedDataName = `${baseName}Data`;

    if (!components[paginatedDataName]) {
      components[paginatedDataName] = {
        type: "object",
        properties: { ...nestedData.properties },
        required: [...(nestedData.required || [])],
      };
      console.log(`    [CREATE] Paginated data wrapper: ${paginatedDataName}`);

      // Now normalize the paginated structure within the data wrapper
      normalizePaginated(paginatedDataName, components[paginatedDataName]);
    }

    // Replace inline data with $ref
    schema.properties.data = {
      $ref: `#/components/schemas/${paginatedDataName}`,
    };

    return;
  }

  // Original response normalization logic
  const baseName = schemaName.replace(/Response$/, "");
  const data = schema.properties?.data;
  if (!data) return;

  // -------------------------------------------------
  // ARRAY RESPONSE
  // -------------------------------------------------
  if (data.type === "array") {
    const items = data.items;
    const base = singular(baseName.replace(/^All/, ""));

    if (items && !items.$ref) {
      if (!components[base]) {
        components[base] = {
          type: items.type || "object",
          properties: { ...(items.properties || {}) },
          required: [...(items.required || [])],
        };
        console.log(`    [CREATE] Array item model: ${base}`);
      }

      schema.properties.data.items = {
        $ref: `#/components/schemas/${base}`,
      };

      extractNestedObjects(base, components[base]);
    }
    return;
  }

  // -------------------------------------------------
  // OBJECT RESPONSE
  // -------------------------------------------------
  if (!data.$ref) {
    if (!components[baseName]) {
      components[baseName] = {
        type: data.type || "object",
        properties: { ...(data.properties || {}) },
        required: [...(data.required || [])],
      };
      console.log(`    [CREATE] Object model: ${baseName}`);
    }

    schema.properties.data = {
      $ref: `#/components/schemas/${baseName}`,
    };

    extractNestedObjects(baseName, components[baseName]);
  }
}

// -------------------------------------------------
// FIRST PASS - Response & Paginated Models
// -------------------------------------------------
console.log("\n[PASS 1] Normalizing Response and Paginated schemas...");
let pass1Count = 0;

for (const schemaName of schemaNames) {
  const schema = components[schemaName];
  if (!schema || typeof schema !== "object") continue;

  // Handle *PaginatedResponse first
  if (schemaName.endsWith("PaginatedResponse")) {
    console.log(`  [PAGINATED-RESPONSE] ${schemaName}`);
    normalizeResponseSchema(schemaName, schema);
    pass1Count++;
    continue;
  }

  // Handle *Paginated (non-Response)
  if (isPaginated(schemaName)) {
    console.log(`  [PAGINATED] ${schemaName}`);
    normalizePaginated(schemaName, schema);
    pass1Count++;
    continue;
  }

  // Handle regular *Response
  if (isResponseModel(schemaName)) {
    console.log(`  [RESPONSE] ${schemaName}`);
    normalizeResponseSchema(schemaName, schema);
    pass1Count++;
    continue;
  }
}

console.log(`  [DONE] Pass 1 complete: ${pass1Count} schemas normalized`);

// -------------------------------------------------
// SECOND PASS - SMART PAGINATED NORMALIZATION
// -------------------------------------------------
console.log("\n[PASS 2] Smart paginated normalization (conflict detection)...");
let pass2Reused = 0;
let pass2Created = 0;
let pass2Conflicts = 0;

for (const schemaName of Object.keys(components)) {
  if (!isPaginated(schemaName)) continue;

  const schema = components[schemaName];

  // Data is always at root level for *Paginated and *PaginatedData
  const dataProperty = schema.properties?.data;

  if (!dataProperty || dataProperty.type !== "array") continue;

  const items = dataProperty.items;

  // Skip if already a $ref
  if (!items || items.$ref) continue;

  console.log(`  [CHECK] ${schemaName}`);

  // Handle both *Paginated and *PaginatedData
  const baseName = schemaName
    .replace(/PaginatedData$/, "")
    .replace(/Paginated$/, "");

  // Create normalized items schema
  const normalizedItems = {
    type: items.type || "object",
    properties: { ...(items.properties || {}) },
    required: [...(items.required || [])],
  };

  let targetSchemaName;

  // Check if baseName exists
  if (components[baseName]) {
    // Normalize both schemas to $ref versions for comparison
    const normalizedInline = normalizeSchemaToRefs(normalizedItems, baseName);
    const normalizedExisting = normalizeSchemaToRefs(
      components[baseName],
      baseName,
    );

    // Deep compare normalized versions
    if (deepEqual(normalizedInline, normalizedExisting)) {
      // Reuse existing baseName
      targetSchemaName = baseName;
      console.log(`    [REUSE] ${baseName}`);
      pass2Reused++;
    } else {
      // Create unique name
      targetSchemaName = getUniqueSchemaName(baseName, schemaName);
      components[targetSchemaName] = normalizedItems;
      console.log(`    [CONFLICT] ${baseName} differs`);
      console.log(`    [CREATE] ${targetSchemaName}`);
      pass2Conflicts++;
      pass2Created++;
    }
  } else {
    // Create new baseName
    targetSchemaName = baseName;
    components[targetSchemaName] = normalizedItems;
    console.log(`    [CREATE] ${baseName}`);
    pass2Created++;
  }

  // Replace inline items with $ref
  dataProperty.items = {
    $ref: `#/components/schemas/${targetSchemaName}`,
  };

  // Extract nested objects from the target schema
  extractNestedObjects(targetSchemaName, components[targetSchemaName]);
}

console.log(
  `  [DONE] Pass 2 complete: ${pass2Reused} reused, ${pass2Created} created (${pass2Conflicts} conflicts resolved)`,
);

// -------------------------------------------------
// THIRD PASS - NORMALIZE ROOT LEVEL ARRAYS/OBJECTS
// -------------------------------------------------
console.log("\n[PASS 3] Normalizing root-level arrays and objects...");
let pass3Arrays = 0;
let pass3Objects = 0;

function normalizeRootLevelProperties(schemaName, schema) {
  if (!schema.properties || typeof schema.properties !== "object") return;

  let hasChanges = false;

  for (const [propName, propSchema] of Object.entries(schema.properties)) {
    if (!propSchema || typeof propSchema !== "object") continue;
    if (propSchema.$ref) continue;

    // Handle arrays with inline items
    if (
      propSchema.type === "array" &&
      propSchema.items &&
      !propSchema.items.$ref
    ) {
      if (!hasChanges) {
        console.log(`  [NORMALIZE] ${schemaName}`);
        hasChanges = true;
      }

      const items = propSchema.items;

      // Generate schema names
      const camelProp = toCamelCase(propName);
      const itemsSchemaName = `${camelProp}Data`;

      // Create the items schema if it doesn't exist
      if (!components[itemsSchemaName]) {
        components[itemsSchemaName] = {
          type: items.type || "object",
          properties: { ...(items.properties || {}) },
          required: [...(items.required || [])],
        };
        console.log(`    [ARRAY] ${propName} -> ${itemsSchemaName}`);
        pass3Arrays++;

        // Extract nested objects from items schema
        extractNestedObjects(itemsSchemaName, components[itemsSchemaName]);
      }

      // Replace inline items with $ref
      schema.properties[propName] = {
        ...propSchema,
        items: {
          $ref: `#/components/schemas/${itemsSchemaName}`,
        },
      };
    }
    // Handle inline objects (non-additionalProperties)
    else if (
      propSchema.type === "object" &&
      !propSchema.additionalProperties &&
      propSchema.properties
    ) {
      if (!hasChanges) {
        console.log(`  [NORMALIZE] ${schemaName}`);
        hasChanges = true;
      }

      const camelProp = toCamelCase(propName);
      const objectSchemaName = `${schemaName}${camelProp}`;

      // Create the object schema if it doesn't exist
      if (!components[objectSchemaName]) {
        components[objectSchemaName] = {
          type: "object",
          properties: { ...(propSchema.properties || {}) },
          required: [...(propSchema.required || [])],
        };
        console.log(`    [OBJECT] ${propName} -> ${objectSchemaName}`);
        pass3Objects++;

        // Extract nested objects
        extractNestedObjects(objectSchemaName, components[objectSchemaName]);
      }

      // Replace inline object with $ref
      schema.properties[propName] = {
        $ref: `#/components/schemas/${objectSchemaName}`,
      };
    }
  }
}

// Apply to all schemas (except PaginatedResponse and PaginatedData which are already handled)
for (const schemaName of Object.keys(components)) {
  const schema = components[schemaName];
  if (!schema || typeof schema !== "object") continue;

  // Skip *PaginatedResponse and *PaginatedData schemas as they're handled in Pass 1
  if (
    schemaName.endsWith("PaginatedResponse") ||
    schemaName.endsWith("PaginatedData")
  )
    continue;

  normalizeRootLevelProperties(schemaName, schema);
}

console.log(
  `  [DONE] Pass 3 complete: ${pass3Arrays} arrays, ${pass3Objects} objects normalized`,
);

// -------------------------------------------------
// Clean legacy auto-generated Paginated* leftovers
// -------------------------------------------------
console.log("\n[CLEANUP] Removing legacy schemas...");
let cleanedCount = 0;
for (const key of Object.keys(components)) {
  if (key === "PaginatedMeta" || key === "PaginatedLinks") continue;
  if (key.endsWith("PaginatedMeta") || key.endsWith("PaginatedLinks")) {
    delete components[key];
    console.log(`  [REMOVE] ${key}`);
    cleanedCount++;
  }
}
console.log(
  `  [DONE] Cleanup complete: ${cleanedCount} legacy schemas removed`,
);

// -------------------------------------------------
// Rewrite leftover refs
// -------------------------------------------------
console.log("\n[REWRITE] Updating references...");
function rewriteRefs(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const [k, v] of Object.entries(obj)) {
    if (k === "$ref" && typeof v === "string") {
      if (v.endsWith("PaginatedMeta"))
        obj[k] = "#/components/schemas/PaginatedMeta";

      if (v.endsWith("PaginatedLinks"))
        obj[k] = "#/components/schemas/PaginatedLinks";
    } else {
      if (Array.isArray(v)) v.forEach(rewriteRefs);
      else rewriteRefs(v);
    }
  }
}

rewriteRefs(spec);
console.log("  [DONE] References rewritten");

// -------------------------------------------------
// Write Output
// -------------------------------------------------
spec.components.schemas = components;
fs.writeFileSync(outputPath, YAML.stringify(spec), "utf8");

console.log("\n[COMPLETE] Normalization finished");
console.log("[SUMMARY]");
console.log(`  Pass 1: ${pass1Count} Response/Paginated schemas`);
console.log(
  `  Pass 2: ${pass2Reused} reused, ${pass2Created} created (${pass2Conflicts} conflicts)`,
);
console.log(`  Pass 3: ${pass3Arrays} arrays, ${pass3Objects} objects`);
console.log(`  Cleanup: ${cleanedCount} legacy schemas removed`);
console.log(`[OUTPUT] ${outputPath}\n`);
