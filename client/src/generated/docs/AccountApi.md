# AccountApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                                      | HTTP request                             | Description               |
| ----------------------------------------------------------- | ---------------------------------------- | ------------------------- |
| [**changePassword**](AccountApi.md#changepasswordoperation) | **POST** /api/v1/account/change-password | Change password           |
| [**logout**](AccountApi.md#logout)                          | **POST** /api/v1/account/logout          | Logout user               |
| [**verifyResend**](AccountApi.md#verifyresend)              | **POST** /api/v1/account/verify/resend   | Resend verification email |

## changePassword

> UserInfoResponse changePassword(changePasswordRequest)

Change password

### Example

```ts
import {
  Configuration,
  AccountApi,
} from '';
import type { ChangePasswordOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  const body = {
    // ChangePasswordRequest | Request body for changing password
    changePasswordRequest: ...,
  } satisfies ChangePasswordOperationRequest;

  try {
    const data = await api.changePassword(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                      | Type                                              | Description                        | Notes |
| ------------------------- | ------------------------------------------------- | ---------------------------------- | ----- |
| **changePasswordRequest** | [ChangePasswordRequest](ChangePasswordRequest.md) | Request body for changing password |       |

### Return type

[**UserInfoResponse**](UserInfoResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                | Response headers |
| ----------- | -------------------------- | ---------------- |
| **200**     | Change password successful | -                |
| **4XX**     | API Error Response         | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## logout

> logout()

Logout user

### Example

```ts
import { Configuration, AccountApi } from "";
import type { LogoutRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.logout();
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
| **204**     | Logout successful  | -                |
| **4XX**     | API Error Response | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## verifyResend

> string verifyResend(xClientUrl)

Resend verification email

### Example

```ts
import { Configuration, AccountApi } from "";
import type { VerifyResendRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  const body = {
    // string | Client URL (optional)
    xClientUrl: xClientUrl_example,
  } satisfies VerifyResendRequest;

  try {
    const data = await api.verifyResend(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name           | Type     | Description | Notes                                |
| -------------- | -------- | ----------- | ------------------------------------ |
| **xClientUrl** | `string` | Client URL  | [Optional] [Defaults to `undefined`] |

### Return type

**string**

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                    | Response headers |
| ----------- | ------------------------------ | ---------------- |
| **200**     | Resend verify email successful | -                |
| **4XX**     | API Error Response             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
