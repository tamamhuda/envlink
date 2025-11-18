# AuthenticationApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                                 | HTTP request                   | Description            |
| ------------------------------------------------------ | ------------------------------ | ---------------------- |
| [**login**](AuthenticationApi.md#loginoperation)       | **POST** /api/v1/auth/login    | Login an account       |
| [**refresh**](AuthenticationApi.md#refresh)            | **POST** /api/v1/auth/refresh  | Refresh token          |
| [**register**](AuthenticationApi.md#registeroperation) | **POST** /api/v1/auth/register | Register a new account |
| [**verify**](AuthenticationApi.md#verify)              | **GET** /api/v1/auth/verify    | Verify email           |

## login

> AuthenticatedResponse login(loginRequest)

Login an account

### Example

```ts
import {
  Configuration,
  AuthenticationApi,
} from '';
import type { LoginOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthenticationApi();

  const body = {
    // LoginRequest | Request body for logging in an account
    loginRequest: ...,
  } satisfies LoginOperationRequest;

  try {
    const data = await api.login(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name             | Type                            | Description                            | Notes |
| ---------------- | ------------------------------- | -------------------------------------- | ----- |
| **loginRequest** | [LoginRequest](LoginRequest.md) | Request body for logging in an account |       |

### Return type

[**AuthenticatedResponse**](AuthenticatedResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description        | Response headers |
| ----------- | ------------------ | ---------------- |
| **200**     | Login successful   | -                |
| **4XX**     | API Error Response | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## refresh

> TokensResponse refresh()

Refresh token

### Example

```ts
import { Configuration, AuthenticationApi } from "";
import type { RefreshRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-refresh
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthenticationApi(config);

  try {
    const data = await api.refresh();
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

[**TokensResponse**](TokensResponse.md)

### Authorization

[jwt-refresh](../README.md#jwt-refresh)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description              | Response headers |
| ----------- | ------------------------ | ---------------- |
| **200**     | Refresh token successful | -                |
| **4XX**     | API Error Response       | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## register

> AuthenticatedResponse register(registerRequest, xClientUrl)

Register a new account

### Example

```ts
import {
  Configuration,
  AuthenticationApi,
} from '';
import type { RegisterOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthenticationApi();

  const body = {
    // RegisterRequest | Request body for registering a new account
    registerRequest: ...,
    // string | Client URL used for email verification (optional)
    xClientUrl: xClientUrl_example,
  } satisfies RegisterOperationRequest;

  try {
    const data = await api.register(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                | Type                                  | Description                                | Notes                                |
| ------------------- | ------------------------------------- | ------------------------------------------ | ------------------------------------ |
| **registerRequest** | [RegisterRequest](RegisterRequest.md) | Request body for registering a new account |                                      |
| **xClientUrl**      | `string`                              | Client URL used for email verification     | [Optional] [Defaults to `undefined`] |

### Return type

[**AuthenticatedResponse**](AuthenticatedResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description             | Response headers |
| ----------- | ----------------------- | ---------------- |
| **200**     | Registration successful | -                |
| **4XX**     | API Error Response      | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## verify

> UserInfoResponse verify(token)

Verify email

### Example

```ts
import { Configuration, AuthenticationApi } from "";
import type { VerifyRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthenticationApi();

  const body = {
    // string
    token: token_example,
  } satisfies VerifyRequest;

  try {
    const data = await api.verify(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name      | Type     | Description | Notes                     |
| --------- | -------- | ----------- | ------------------------- |
| **token** | `string` |             | [Defaults to `undefined`] |

### Return type

[**UserInfoResponse**](UserInfoResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description             | Response headers |
| ----------- | ----------------------- | ---------------- |
| **200**     | Verify email successful | -                |
| **4XX**     | API Error Response      | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
