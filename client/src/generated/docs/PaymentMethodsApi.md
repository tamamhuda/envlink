# PaymentMethodsApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                                    | HTTP request                                     | Description                   |
| --------------------------------------------------------- | ------------------------------------------------ | ----------------------------- |
| [**create**](PaymentMethodsApi.md#create)                 | **POST** /api/v1/payment-methods                 | Create payment method         |
| [**getAll**](PaymentMethodsApi.md#getall)                 | **GET** /api/v1/payment-methods                  | Get all payment methods       |
| [**getById**](PaymentMethodsApi.md#getbyid)               | **GET** /api/v1/payment-methods/{id}             | Get payment method by id      |
| [**requestActions**](PaymentMethodsApi.md#requestactions) | **GET** /api/v1/payment-methods/requests-actions | Get requested payment methods |
| [**sort**](PaymentMethodsApi.md#sort)                     | **PATCH** /api/v1/payment-methods/sort           | Sort payment methods          |
| [**validate**](PaymentMethodsApi.md#validate)             | **POST** /api/v1/payment-methods/validate        | Validate payment method       |

## create

> PaymentMethodActionResponse create(createPaymentMethodRequest)

Create payment method

### Example

```ts
import {
  Configuration,
  PaymentMethodsApi,
} from '';
import type { CreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PaymentMethodsApi(config);

  const body = {
    // CreatePaymentMethodRequest | Request body create payment method
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

| Name                           | Type                                                        | Description                        | Notes |
| ------------------------------ | ----------------------------------------------------------- | ---------------------------------- | ----- |
| **createPaymentMethodRequest** | [CreatePaymentMethodRequest](CreatePaymentMethodRequest.md) | Request body create payment method |       |

### Return type

[**PaymentMethodActionResponse**](PaymentMethodActionResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                        | Response headers |
| ----------- | ---------------------------------- | ---------------- |
| **200**     | Create payment method successfully | -                |
| **4XX**     | API Error Response                 | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getAll

> AllPaymentMethodsResponse getAll()

Get all payment methods

### Example

```ts
import { Configuration, PaymentMethodsApi } from "";
import type { GetAllRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PaymentMethodsApi(config);

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

[**AllPaymentMethodsResponse**](AllPaymentMethodsResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                          | Response headers |
| ----------- | ------------------------------------ | ---------------- |
| **200**     | Get all payment methods successfully | -                |
| **4XX**     | API Error Response                   | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getById

> PaymentMethodResponse getById(id)

Get payment method by id

### Example

```ts
import { Configuration, PaymentMethodsApi } from "";
import type { GetByIdRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PaymentMethodsApi(config);

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

[**PaymentMethodResponse**](PaymentMethodResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                           | Response headers |
| ----------- | ------------------------------------- | ---------------- |
| **200**     | Get payment method by id successfully | -                |
| **4XX**     | API Error Response                    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## requestActions

> AllPaymentMethodActionResponse requestActions(successReturnUrl, failureReturnUrl)

Get requested payment methods

### Example

```ts
import { Configuration, PaymentMethodsApi } from "";
import type { RequestActionsRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PaymentMethodsApi(config);

  const body = {
    // string
    successReturnUrl: successReturnUrl_example,
    // string
    failureReturnUrl: failureReturnUrl_example,
  } satisfies RequestActionsRequest;

  try {
    const data = await api.requestActions(body);
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
| **successReturnUrl** | `string` |             | [Defaults to `undefined`] |
| **failureReturnUrl** | `string` |             | [Defaults to `undefined`] |

### Return type

[**AllPaymentMethodActionResponse**](AllPaymentMethodActionResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                               | Response headers |
| ----------- | ----------------------------------------- | ---------------- |
| **200**     | Get requested payment method successfully | -                |
| **4XX**     | API Error Response                        | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## sort

> AllPaymentMethodsResponse sort(sortPaymentMethodsRequestInner)

Sort payment methods

### Example

```ts
import {
  Configuration,
  PaymentMethodsApi,
} from '';
import type { SortRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PaymentMethodsApi(config);

  const body = {
    // Array<SortPaymentMethodsRequestInner> | Request body sort payment methods
    sortPaymentMethodsRequestInner: ...,
  } satisfies SortRequest;

  try {
    const data = await api.sort(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                               | Type                                    | Description                       | Notes |
| ---------------------------------- | --------------------------------------- | --------------------------------- | ----- |
| **sortPaymentMethodsRequestInner** | `Array<SortPaymentMethodsRequestInner>` | Request body sort payment methods |       |

### Return type

[**AllPaymentMethodsResponse**](AllPaymentMethodsResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                           | Response headers |
| ----------- | ------------------------------------- | ---------------- |
| **200**     | Get payment method by id successfully | -                |
| **4XX**     | API Error Response                    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## validate

> OkResponse validate(validatePaymentMethodRequest)

Validate payment method

### Example

```ts
import {
  Configuration,
  PaymentMethodsApi,
} from '';
import type { ValidateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PaymentMethodsApi(config);

  const body = {
    // ValidatePaymentMethodRequest | Request body validate payment method
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

| Name                             | Type                                                            | Description                          | Notes |
| -------------------------------- | --------------------------------------------------------------- | ------------------------------------ | ----- |
| **validatePaymentMethodRequest** | [ValidatePaymentMethodRequest](ValidatePaymentMethodRequest.md) | Request body validate payment method |       |

### Return type

[**OkResponse**](OkResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                          | Response headers |
| ----------- | ------------------------------------ | ---------------- |
| **200**     | Validate payment method successfully | -                |
| **4XX**     | API Error Response                   | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
