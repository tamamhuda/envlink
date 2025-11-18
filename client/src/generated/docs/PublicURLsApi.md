# PublicURLsApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                      | HTTP request                               | Description                          |
| ------------------------------------------- | ------------------------------------------ | ------------------------------------ |
| [**getByCode**](PublicURLsApi.md#getbycode) | **GET** /api/v1/public/urls/{code}         | Get a short URL for public access    |
| [**shorten**](PublicURLsApi.md#shorten)     | **POST** /api/v1/public/urls/shorten       | Shorten a URL for public access      |
| [**unlock**](PublicURLsApi.md#unlock)       | **POST** /api/v1/public/urls/unlock/{code} | Unlock a short URL for public access |

## getByCode

> PublicUrlResponse getByCode(code)

Get a short URL for public access

### Example

```ts
import { Configuration, PublicURLsApi } from "";
import type { GetByCodeRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PublicURLsApi();

  const body = {
    // string
    code: code_example,
  } satisfies GetByCodeRequest;

  try {
    const data = await api.getByCode(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name     | Type     | Description | Notes                     |
| -------- | -------- | ----------- | ------------------------- |
| **code** | `string` |             | [Defaults to `undefined`] |

### Return type

[**PublicUrlResponse**](PublicUrlResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                         | Response headers |
| ----------- | ----------------------------------- | ---------------- |
| **200**     | Get a short URL for a public access | -                |
| **4XX**     | API Error Response                  | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## shorten

> PublicUrlResponse shorten(publicShortenUrlRequest)

Shorten a URL for public access

### Example

```ts
import {
  Configuration,
  PublicURLsApi,
} from '';
import type { ShortenRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PublicURLsApi();

  const body = {
    // PublicShortenUrlRequest
    publicShortenUrlRequest: ...,
  } satisfies ShortenRequest;

  try {
    const data = await api.shorten(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                        | Type                                                  | Description | Notes |
| --------------------------- | ----------------------------------------------------- | ----------- | ----- |
| **publicShortenUrlRequest** | [PublicShortenUrlRequest](PublicShortenUrlRequest.md) |             |       |

### Return type

[**PublicUrlResponse**](PublicUrlResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                                 | Response headers |
| ----------- | ------------------------------------------- | ---------------- |
| **201**     | Created a new public short URL successfully | -                |
| **4XX**     | API Error Response                          | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## unlock

> PublicUrlResponse unlock(code, unlockUrlRequest)

Unlock a short URL for public access

### Example

```ts
import {
  Configuration,
  PublicURLsApi,
} from '';
import type { UnlockRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PublicURLsApi();

  const body = {
    // string
    code: code_example,
    // UnlockUrlRequest | Request body for unlocking a short URL
    unlockUrlRequest: ...,
  } satisfies UnlockRequest;

  try {
    const data = await api.unlock(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                 | Type                                    | Description                            | Notes                     |
| -------------------- | --------------------------------------- | -------------------------------------- | ------------------------- |
| **code**             | `string`                                |                                        | [Defaults to `undefined`] |
| **unlockUrlRequest** | [UnlockUrlRequest](UnlockUrlRequest.md) | Request body for unlocking a short URL |                           |

### Return type

[**PublicUrlResponse**](PublicUrlResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                            | Response headers |
| ----------- | -------------------------------------- | ---------------- |
| **200**     | Unlock a short URL for a public access | -                |
| **4XX**     | API Error Response                     | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
