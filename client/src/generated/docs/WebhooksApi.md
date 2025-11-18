# WebhooksApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                                                                                          | HTTP request                                     | Description                                 |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------- |
| [**webhooksControllerHandleXenditPaymentMethods**](WebhooksApi.md#webhookscontrollerhandlexenditpaymentmethods) | **POST** /api/v1/webhooks/xendit/payment_methods | Handle Xendit payment methods callback data |
| [**webhooksControllerHandleXenditRecurring**](WebhooksApi.md#webhookscontrollerhandlexenditrecurring)           | **POST** /api/v1/webhooks/xendit/recurring       | Handle Xendit recurring plan callback data  |

## webhooksControllerHandleXenditPaymentMethods

> OkResponse webhooksControllerHandleXenditPaymentMethods(webhookRequest)

Handle Xendit payment methods callback data

### Example

```ts
import {
  Configuration,
  WebhooksApi,
} from '';
import type { WebhooksControllerHandleXenditPaymentMethodsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WebhooksApi();

  const body = {
    // WebhookRequest | Xendit payment methods callback data
    webhookRequest: ...,
  } satisfies WebhooksControllerHandleXenditPaymentMethodsRequest;

  try {
    const data = await api.webhooksControllerHandleXenditPaymentMethods(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name               | Type                                | Description                          | Notes |
| ------------------ | ----------------------------------- | ------------------------------------ | ----- |
| **webhookRequest** | [WebhookRequest](WebhookRequest.md) | Xendit payment methods callback data |       |

### Return type

[**OkResponse**](OkResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                                         | Response headers |
| ----------- | --------------------------------------------------- | ---------------- |
| **200**     | successfully handling payment methods callback data | -                |
| **4XX**     | API Error Response                                  | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## webhooksControllerHandleXenditRecurring

> OkResponse webhooksControllerHandleXenditRecurring(webhookRequest)

Handle Xendit recurring plan callback data

### Example

```ts
import {
  Configuration,
  WebhooksApi,
} from '';
import type { WebhooksControllerHandleXenditRecurringRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WebhooksApi();

  const body = {
    // WebhookRequest | Xendit recurring plan callback data
    webhookRequest: ...,
  } satisfies WebhooksControllerHandleXenditRecurringRequest;

  try {
    const data = await api.webhooksControllerHandleXenditRecurring(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name               | Type                                | Description                         | Notes |
| ------------------ | ----------------------------------- | ----------------------------------- | ----- |
| **webhookRequest** | [WebhookRequest](WebhookRequest.md) | Xendit recurring plan callback data |       |

### Return type

[**OkResponse**](OkResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                                        | Response headers |
| ----------- | -------------------------------------------------- | ---------------- |
| **200**     | successfully handling recurring plan callback data | -                |
| **4XX**     | API Error Response                                 | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
