# SessionsApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                      | HTTP request                         | Description              |
| ------------------------------------------- | ------------------------------------ | ------------------------ |
| [**getAll**](SessionsApi.md#getall)         | **GET** /api/v1/session              | Get all user sessions    |
| [**getById**](SessionsApi.md#getbyid)       | **GET** /api/v1/session/{id}         | Get session by id        |
| [**revokeAll**](SessionsApi.md#revokeall)   | **POST** /api/v1/session/revoke      | Revoke all user sessions |
| [**revokeById**](SessionsApi.md#revokebyid) | **POST** /api/v1/session/revoke/{id} | Revoke a user session    |

## getAll

> AllSessionsInfoResponse getAll(isActive)

Get all user sessions

### Example

```ts
import { Configuration, SessionsApi } from "";
import type { GetAllRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SessionsApi(config);

  const body = {
    // boolean
    isActive: true,
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

| Name         | Type      | Description | Notes                     |
| ------------ | --------- | ----------- | ------------------------- |
| **isActive** | `boolean` |             | [Defaults to `undefined`] |

### Return type

[**AllSessionsInfoResponse**](AllSessionsInfoResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                        | Response headers |
| ----------- | ---------------------------------- | ---------------- |
| **200**     | Get all user sessions successfully | -                |
| **4XX**     | API Error Response                 | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getById

> SessionInfoResponse getById(id)

Get session by id

### Example

```ts
import { Configuration, SessionsApi } from "";
import type { GetByIdRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SessionsApi(config);

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

[**SessionInfoResponse**](SessionInfoResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                    | Response headers |
| ----------- | ------------------------------ | ---------------- |
| **200**     | Get session by id successfully | -                |
| **4XX**     | API Error Response             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## revokeAll

> revokeAll()

Revoke all user sessions

### Example

```ts
import { Configuration, SessionsApi } from "";
import type { RevokeAllRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SessionsApi(config);

  try {
    const data = await api.revokeAll();
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

`void` (Empty response body)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description        | Response headers |
| ----------- | ------------------ | ---------------- |
| **204**     | No content         | -                |
| **4XX**     | API Error Response | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## revokeById

> revokeById(id)

Revoke a user session

### Example

```ts
import { Configuration, SessionsApi } from "";
import type { RevokeByIdRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SessionsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies RevokeByIdRequest;

  try {
    const data = await api.revokeById(body);
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

| Status code | Description        | Response headers |
| ----------- | ------------------ | ---------------- |
| **204**     | No content         | -                |
| **4XX**     | API Error Response | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
