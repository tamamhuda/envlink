# SubscriptionsApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                                                                   | HTTP request                                        | Description                          |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------ |
| [**deactivate**](SubscriptionsApi.md#deactivate)                                         | **POST** /api/v1/subscriptions/{id}/deactivate      | Deactivate subscription plan         |
| [**getActive**](SubscriptionsApi.md#getactive)                                           | **GET** /api/v1/subscriptions/active                | Get current user active subscription |
| [**getAllActiveSubscriptionCycles**](SubscriptionsApi.md#getallactivesubscriptioncycles) | **GET** /api/v1/subscriptions/active/cycles         | Get all active subscription cycles   |
| [**getAllBySubscriptionId**](SubscriptionsApi.md#getallbysubscriptionid)                 | **GET** /api/v1/subscriptions/{id}/cycles           | Get all subscription cycles          |
| [**getById**](SubscriptionsApi.md#getbyid)                                               | **GET** /api/v1/subscriptions/{id}                  | Get subscription by id               |
| [**getCycleById**](SubscriptionsApi.md#getcyclebyid)                                     | **GET** /api/v1/subscriptions/{id}/cycles/{cycleId} | Get subscription cycle by id         |
| [**getUpgradeOptions**](SubscriptionsApi.md#getupgradeoptions)                           | **GET** /api/v1/subscriptions/{id}/upgrade-options  | Get subscription upgrade options     |
| [**upgrade**](SubscriptionsApi.md#upgrade)                                               | **POST** /api/v1/subscriptions/{id}/upgrade         | Upgrade subscription plan            |

## deactivate

> SubscriptionInfoResponse deactivate(id)

Deactivate subscription plan

### Example

```ts
import { Configuration, SubscriptionsApi } from "";
import type { DeactivateRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SubscriptionsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies DeactivateRequest;

  try {
    const data = await api.deactivate(body);
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

[**SubscriptionInfoResponse**](SubscriptionInfoResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                               | Response headers |
| ----------- | ----------------------------------------- | ---------------- |
| **200**     | Deactivate Subscription plan successfully | -                |
| **4XX**     | API Error Response                        | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getActive

> SubscriptionInfoResponse getActive()

Get current user active subscription

### Example

```ts
import { Configuration, SubscriptionsApi } from "";
import type { GetActiveRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SubscriptionsApi(config);

  try {
    const data = await api.getActive();
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

[**SubscriptionInfoResponse**](SubscriptionInfoResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                               | Response headers |
| ----------- | ----------------------------------------- | ---------------- |
| **200**     | Get user active subscription successfully | -                |
| **4XX**     | API Error Response                        | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getAllActiveSubscriptionCycles

> AllSubscriptionCyclesResponse getAllActiveSubscriptionCycles()

Get all active subscription cycles

### Example

```ts
import { Configuration, SubscriptionsApi } from "";
import type { GetAllActiveSubscriptionCyclesRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SubscriptionsApi(config);

  try {
    const data = await api.getAllActiveSubscriptionCycles();
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

[**AllSubscriptionCyclesResponse**](AllSubscriptionCyclesResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                                     | Response headers |
| ----------- | ----------------------------------------------- | ---------------- |
| **200**     | Get all active subscription cycles successfully | -                |
| **4XX**     | API Error Response                              | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getAllBySubscriptionId

> AllSubscriptionCyclesResponse getAllBySubscriptionId(id)

Get all subscription cycles

### Example

```ts
import { Configuration, SubscriptionsApi } from "";
import type { GetAllBySubscriptionIdRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SubscriptionsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies GetAllBySubscriptionIdRequest;

  try {
    const data = await api.getAllBySubscriptionId(body);
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

[**AllSubscriptionCyclesResponse**](AllSubscriptionCyclesResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                              | Response headers |
| ----------- | ---------------------------------------- | ---------------- |
| **200**     | Get all subscription cycles successfully | -                |
| **4XX**     | API Error Response                       | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getById

> SubscriptionInfoResponse getById(id)

Get subscription by id

### Example

```ts
import { Configuration, SubscriptionsApi } from "";
import type { GetByIdRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SubscriptionsApi(config);

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

[**SubscriptionInfoResponse**](SubscriptionInfoResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                         | Response headers |
| ----------- | ----------------------------------- | ---------------- |
| **200**     | Get subscription by id successfully | -                |
| **4XX**     | API Error Response                  | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getCycleById

> SubscriptionCycleResponse getCycleById(id, cycleId)

Get subscription cycle by id

### Example

```ts
import { Configuration, SubscriptionsApi } from "";
import type { GetCycleByIdRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SubscriptionsApi(config);

  const body = {
    // string
    id: id_example,
    // string
    cycleId: cycleId_example,
  } satisfies GetCycleByIdRequest;

  try {
    const data = await api.getCycleById(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name        | Type     | Description | Notes                     |
| ----------- | -------- | ----------- | ------------------------- |
| **id**      | `string` |             | [Defaults to `undefined`] |
| **cycleId** | `string` |             | [Defaults to `undefined`] |

### Return type

[**SubscriptionCycleResponse**](SubscriptionCycleResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                               | Response headers |
| ----------- | ----------------------------------------- | ---------------- |
| **200**     | Get subscription cycle by id successfully | -                |
| **4XX**     | API Error Response                        | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getUpgradeOptions

> SubscriptionUpgradeOptionsResponse getUpgradeOptions(id)

Get subscription upgrade options

### Example

```ts
import { Configuration, SubscriptionsApi } from "";
import type { GetUpgradeOptionsRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SubscriptionsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies GetUpgradeOptionsRequest;

  try {
    const data = await api.getUpgradeOptions(body);
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

[**SubscriptionUpgradeOptionsResponse**](SubscriptionUpgradeOptionsResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                                   | Response headers |
| ----------- | --------------------------------------------- | ---------------- |
| **201**     | Get subscription upgrade options successfully | -                |
| **4XX**     | API Error Response                            | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## upgrade

> SubscriptionInfoResponse upgrade(id, upgradeSubscriptionRequest)

Upgrade subscription plan

### Example

```ts
import {
  Configuration,
  SubscriptionsApi,
} from '';
import type { UpgradeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SubscriptionsApi(config);

  const body = {
    // string
    id: id_example,
    // UpgradeSubscriptionRequest | Request body for upgrading subscription plan
    upgradeSubscriptionRequest: ...,
  } satisfies UpgradeRequest;

  try {
    const data = await api.upgrade(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                           | Type                                                        | Description                                  | Notes                     |
| ------------------------------ | ----------------------------------------------------------- | -------------------------------------------- | ------------------------- |
| **id**                         | `string`                                                    |                                              | [Defaults to `undefined`] |
| **upgradeSubscriptionRequest** | [UpgradeSubscriptionRequest](UpgradeSubscriptionRequest.md) | Request body for upgrading subscription plan |                           |

### Return type

[**SubscriptionInfoResponse**](SubscriptionInfoResponse.md)

### Authorization

[jwt-access](../README.md#jwt-access)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                            | Response headers |
| ----------- | -------------------------------------- | ---------------- |
| **201**     | Upgrade subscription plan successfully | -                |
| **4XX**     | API Error Response                     | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
