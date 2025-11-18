# TransactionsApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                    | HTTP request                      | Description           |
| ----------------------------------------- | --------------------------------- | --------------------- |
| [**getAll**](TransactionsApi.md#getall)   | **GET** /api/v1/transactions      | Get all transactions  |
| [**getById**](TransactionsApi.md#getbyid) | **GET** /api/v1/transactions/{id} | Get transaction by id |

## getAll

> TransactionsResponse getAll(startDate, endDate, status)

Get all transactions

### Example

```ts
import {
  Configuration,
  TransactionsApi,
} from '';
import type { GetAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TransactionsApi(config);

  const body = {
    // string | Start date filter (YYYY-MM-DD) (optional)
    startDate: startDate_example,
    // string | End date filter (YYYY-MM-DD) (optional)
    endDate: endDate_example,
    // Array<string> | Transaction status filter (can include multiple) (optional)
    status: ...,
  } satisfies GetAllRequest;

  try {
    const data = await api.getAll(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name          | Type            | Description                                      | Notes                                |
| ------------- | --------------- | ------------------------------------------------ | ------------------------------------ |
| **startDate** | `string`        | Start date filter (YYYY-MM-DD)                   | [Optional] [Defaults to `undefined`] |
| **endDate**   | `string`        | End date filter (YYYY-MM-DD)                     | [Optional] [Defaults to `undefined`] |
| **status**    | `Array<string>` | Transaction status filter (can include multiple) | [Optional]                           |

### Return type

[**TransactionsResponse**](TransactionsResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                       | Response headers |
| ----------- | --------------------------------- | ---------------- |
| **200**     | Get all transactions successfully | -                |
| **4XX**     | API Error Response                | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getById

> TransactionsResponse getById(id)

Get transaction by id

### Example

```ts
import { Configuration, TransactionsApi } from "";
import type { GetByIdRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TransactionsApi(config);

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

[**TransactionsResponse**](TransactionsResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                        | Response headers |
| ----------- | ---------------------------------- | ---------------- |
| **200**     | get transaction by id successfully | -                |
| **4XX**     | API Error Response                 | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
