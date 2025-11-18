# UrlsApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                             | HTTP request                 | Description                   |
| ---------------------------------- | ---------------------------- | ----------------------------- |
| [**\_delete**](UrlsApi.md#_delete) | **DELETE** /api/v1/urls/{id} | Delete a short URL            |
| [**getAll**](UrlsApi.md#getall)    | **GET** /api/v1/urls         | Get all short URLs for a user |
| [**getById**](UrlsApi.md#getbyid)  | **GET** /api/v1/urls/{id}    | Get a short URL by id         |
| [**shorten**](UrlsApi.md#shorten)  | **POST** /api/v1/urls        | Create a new short URL        |
| [**update**](UrlsApi.md#update)    | **PUT** /api/v1/urls/{id}    | Update a short URL            |

## \_delete

> \_delete(id)

Delete a short URL

### Example

```ts
import { Configuration, UrlsApi } from "";
import type { DeleteRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UrlsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies DeleteRequest;

  try {
    const data = await api._delete(body);
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

`void` (Empty response body)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                     | Response headers |
| ----------- | ------------------------------- | ---------------- |
| **204**     | Delete a short URL successfully | -                |
| **4XX**     | API Error Response              | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getAll

> AllUrlsResponse getAll()

Get all short URLs for a user

### Example

```ts
import { Configuration, UrlsApi } from "";
import type { GetAllRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UrlsApi(config);

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

[**AllUrlsResponse**](AllUrlsResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                                | Response headers |
| ----------- | ------------------------------------------ | ---------------- |
| **200**     | Get all short URLs for a user successfully | -                |
| **4XX**     | API Error Response                         | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getById

> UrlResponse getById(id)

Get a short URL by id

### Example

```ts
import { Configuration, UrlsApi } from "";
import type { GetByIdRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UrlsApi(config);

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

[**UrlResponse**](UrlResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                        | Response headers |
| ----------- | ---------------------------------- | ---------------- |
| **200**     | Get a short URL by id successfully | -                |
| **4XX**     | API Error Response                 | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## shorten

> UrlResponse shorten(shortenUrlRequest)

Create a new short URL

### Example

```ts
import {
  Configuration,
  UrlsApi,
} from '';
import type { ShortenRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UrlsApi(config);

  const body = {
    // ShortenUrlRequest | Request body to shorten a URL
    shortenUrlRequest: ...,
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

| Name                  | Type                                      | Description                   | Notes |
| --------------------- | ----------------------------------------- | ----------------------------- | ----- |
| **shortenUrlRequest** | [ShortenUrlRequest](ShortenUrlRequest.md) | Request body to shorten a URL |       |

### Return type

[**UrlResponse**](UrlResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description             | Response headers |
| ----------- | ----------------------- | ---------------- |
| **201**     | Created a new short URL | -                |
| **4XX**     | API Error Response      | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## update

> UrlResponse update(id, updateUrlRequest)

Update a short URL

### Example

```ts
import {
  Configuration,
  UrlsApi,
} from '';
import type { UpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UrlsApi(config);

  const body = {
    // string
    id: id_example,
    // UpdateUrlRequest | Request body to update a URL
    updateUrlRequest: ...,
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

| Name                 | Type                                    | Description                  | Notes                     |
| -------------------- | --------------------------------------- | ---------------------------- | ------------------------- |
| **id**               | `string`                                |                              | [Defaults to `undefined`] |
| **updateUrlRequest** | [UpdateUrlRequest](UpdateUrlRequest.md) | Request body to update a URL |                           |

### Return type

[**UrlResponse**](UrlResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description        | Response headers |
| ----------- | ------------------ | ---------------- |
| **200**     | Update a short URL | -                |
| **4XX**     | API Error Response | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
