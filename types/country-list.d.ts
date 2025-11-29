declare module "country-list" {
  interface Country {
    name: string;
    code: string;
  }

  function getNames(): string[];
  function getCode(name: string): string[];
  function getCodes(): string[];
  function getName(code: string): string[];
}
