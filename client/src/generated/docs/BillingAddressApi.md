# BillingAddressApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                      | HTTP request                           | Description                 |
| ------------------------------------------- | -------------------------------------- | --------------------------- |
| [**create**](BillingAddressApi.md#create)   | **POST** /api/v1/billing-address       | Create a billing address    |
| [**getAll**](BillingAddressApi.md#getall)   | **GET** /api/v1/billing-address        | Get all billing addresses   |
| [**getById**](BillingAddressApi.md#getbyid) | **GET** /api/v1/billing-address/{id}   | Get a billing address by id |
| [**update**](BillingAddressApi.md#update)   | **PATCH** /api/v1/billing-address/{id} | Update a billing address    |

## create

> BillingAddressResponse create(createBillingAddressRequest)

Create a billing address

### Example

```ts
import {
  Configuration,
  BillingAddressApi,
} from '';
import type { CreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BillingAddressApi(config);

  const body = {
    // CreateBillingAddressRequest | Request body for creating a billing address
    createBillingAddressRequest: ...,
  } satisfies CreateRequest;

  try {
    const data = await api.create(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                            | Type                                                          | Description                                 | Notes |
| ------------------------------- | ------------------------------------------------------------- | ------------------------------------------- | ----- |
| **createBillingAddressRequest** | [CreateBillingAddressRequest](CreateBillingAddressRequest.md) | Request body for creating a billing address |       |

### Return type

[**BillingAddressResponse**](BillingAddressResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                            | Response headers |
| ----------- | -------------------------------------- | ---------------- |
| **200**     | Returns a billing address successfully | -                |
| **4XX**     | API Error Response                     | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getAll

> AllBillingAddressResponse getAll()

Get all billing addresses

### Example

```ts
import { Configuration, BillingAddressApi } from "";
import type { GetAllRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BillingAddressApi(config);

  try {
    const data = await api.getAll();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**AllBillingAddressResponse**](AllBillingAddressResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                                      | Response headers |
| ----------- | ------------------------------------------------ | ---------------- |
| **200**     | Returns a list of billing addresses successfully | -                |
| **4XX**     | API Error Response                               | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getById

> BillingAddressResponse getById(id)

Get a billing address by id

### Example

```ts
import { Configuration, BillingAddressApi } from "";
import type { GetByIdRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BillingAddressApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies GetByIdRequest;

  try {
    const data = await api.getById(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name   | Type     | Description | Notes                     |
| ------ | -------- | ----------- | ------------------------- |
| **id** | `string` |             | [Defaults to `undefined`] |

### Return type

[**BillingAddressResponse**](BillingAddressResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                            | Response headers |
| ----------- | -------------------------------------- | ---------------- |
| **200**     | Returns a billing address successfully | -                |
| **4XX**     | API Error Response                     | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## update

> BillingAddressResponse update(id, updateBillingAddressRequest)

Update a billing address

### Example

```ts
import {
  Configuration,
  BillingAddressApi,
} from '';
import type { UpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BillingAddressApi(config);

  const body = {
    // string
    id: id_example,
    // UpdateBillingAddressRequest | Request body for updating a billing address
    updateBillingAddressRequest: ...,
  } satisfies UpdateRequest;

  try {
    const data = await api.update(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                            | Type                                                          | Description                                 | Notes                     |
| ------------------------------- | ------------------------------------------------------------- | ------------------------------------------- | ------------------------- |
| **id**                          | `string`                                                      |                                             | [Defaults to `undefined`] |
| **updateBillingAddressRequest** | [UpdateBillingAddressRequest](UpdateBillingAddressRequest.md) | Request body for updating a billing address |                           |

### Return type

[**BillingAddressResponse**](BillingAddressResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                            | Response headers |
| ----------- | -------------------------------------- | ---------------- |
| **200**     | Returns a billing address successfully | -                |
| **4XX**     | API Error Response                     | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
