# UserApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                      | HTTP request                       | Description             |
| ------------------------------------------- | ---------------------------------- | ----------------------- |
| [**getInfo**](UserApi.md#getinfo)           | **GET** /api/v1/user/me            | Get user information    |
| [**update**](UserApi.md#update)             | **PATCH** /api/v1/user/{id}        | Update user information |
| [**uploadAvatar**](UserApi.md#uploadavatar) | **POST** /api/v1/user/image/upload | Upload user image       |

## getInfo

> UserInfoResponse getInfo()

Get user information

### Example

```ts
import { Configuration, UserApi } from "";
import type { GetInfoRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserApi(config);

  try {
    const data = await api.getInfo();
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

[**UserInfoResponse**](UserInfoResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                       | Response headers |
| ----------- | --------------------------------- | ---------------- |
| **200**     | Get user information successfully | -                |
| **4XX**     | API Error Response                | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## update

> UserInfoResponse update(id, updateUserRequest)

Update user information

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { UpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserApi(config);

  const body = {
    // string
    id: id_example,
    // UpdateUserRequest | Request body for updating user
    updateUserRequest: ...,
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

| Name                  | Type                                      | Description                    | Notes                     |
| --------------------- | ----------------------------------------- | ------------------------------ | ------------------------- |
| **id**                | `string`                                  |                                | [Defaults to `undefined`] |
| **updateUserRequest** | [UpdateUserRequest](UpdateUserRequest.md) | Request body for updating user |                           |

### Return type

[**UserInfoResponse**](UserInfoResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                          | Response headers |
| ----------- | ------------------------------------ | ---------------- |
| **200**     | Update user information successfully | -                |
| **4XX**     | API Error Response                   | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## uploadAvatar

> UserInfoResponse uploadAvatar(file)

Upload user image

### Example

```ts
import { Configuration, UserApi } from "";
import type { UploadAvatarRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserApi(config);

  const body = {
    // Blob (optional)
    file: BINARY_DATA_HERE,
  } satisfies UploadAvatarRequest;

  try {
    const data = await api.uploadAvatar(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name     | Type   | Description | Notes                                |
| -------- | ------ | ----------- | ------------------------------------ |
| **file** | `Blob` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**UserInfoResponse**](UserInfoResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                    | Response headers |
| ----------- | ------------------------------ | ---------------- |
| **200**     | Upload user image successfully | -                |
| **4XX**     | API Error Response             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
