# PublicPaymentMethodsApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                              | HTTP request                                     | Description             |
| --------------------------------------------------- | ------------------------------------------------ | ----------------------- |
| [**add**](PublicPaymentMethodsApi.md#add)           | **GET** /api/v1/public/payment-methods/add       | Add payment method      |
| [**create**](PublicPaymentMethodsApi.md#create)     | **POST** /api/v1/public/payment-methods          | Create payment method   |
| [**validate**](PublicPaymentMethodsApi.md#validate) | **POST** /api/v1/public/payment-methods/validate | Validate payment method |

## add

> add(token, successReturnUrl, failureReturnUrl)

Add payment method

### Example

```ts
import { Configuration, PublicPaymentMethodsApi } from "";
import type { AddRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PublicPaymentMethodsApi();

  const body = {
    // string
    token: token_example,
    // string
    successReturnUrl: successReturnUrl_example,
    // string
    failureReturnUrl: failureReturnUrl_example,
  } satisfies AddRequest;

  try {
    const data = await api.add(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                 | Type     | Description | Notes                     |
| -------------------- | -------- | ----------- | ------------------------- |
| **token**            | `string` |             | [Defaults to `undefined`] |
| **successReturnUrl** | `string` |             | [Defaults to `undefined`] |
| **failureReturnUrl** | `string` |             | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description        | Response headers |
| ----------- | ------------------ | ---------------- |
| **200**     |                    | -                |
| **4XX**     | API Error Response | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## create

> PaymentMethodActionResponse create(token, createPaymentMethodRequest)

Create payment method

### Example

```ts
import {
  Configuration,
  PublicPaymentMethodsApi,
} from '';
import type { CreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PublicPaymentMethodsApi();

  const body = {
    // string
    token: token_example,
    // CreatePaymentMethodRequest | Request body for creating a payment method
    createPaymentMethodRequest: ...,
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

| Name                           | Type                                                        | Description                                | Notes                     |
| ------------------------------ | ----------------------------------------------------------- | ------------------------------------------ | ------------------------- |
| **token**                      | `string`                                                    |                                            | [Defaults to `undefined`] |
| **createPaymentMethodRequest** | [CreatePaymentMethodRequest](CreatePaymentMethodRequest.md) | Request body for creating a payment method |                           |

### Return type

[**PaymentMethodActionResponse**](PaymentMethodActionResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                        | Response headers |
| ----------- | ---------------------------------- | ---------------- |
| **200**     | Create payment method successfully | -                |
| **4XX**     | API Error Response                 | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## validate

> OkResponse validate(token, validatePaymentMethodRequest)

Validate payment method

### Example

```ts
import {
  Configuration,
  PublicPaymentMethodsApi,
} from '';
import type { ValidateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PublicPaymentMethodsApi();

  const body = {
    // string
    token: token_example,
    // ValidatePaymentMethodRequest | Request body for validating a payment method
    validatePaymentMethodRequest: ...,
  } satisfies ValidateRequest;

  try {
    const data = await api.validate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                             | Type                                                            | Description                                  | Notes                     |
| -------------------------------- | --------------------------------------------------------------- | -------------------------------------------- | ------------------------- |
| **token**                        | `string`                                                        |                                              | [Defaults to `undefined`] |
| **validatePaymentMethodRequest** | [ValidatePaymentMethodRequest](ValidatePaymentMethodRequest.md) | Request body for validating a payment method |                           |

### Return type

[**OkResponse**](OkResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                          | Response headers |
| ----------- | ------------------------------------ | ---------------- |
| **200**     | Validate payment method successfully | -                |
| **4XX**     | API Error Response                   | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
