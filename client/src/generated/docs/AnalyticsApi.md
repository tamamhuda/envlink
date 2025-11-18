# AnalyticsApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                                       | HTTP request                                    | Description                         |
| ------------------------------------------------------------ | ----------------------------------------------- | ----------------------------------- |
| [**getAllUrlLogs**](AnalyticsApi.md#getallurllogs)           | **GET** /api/v1/analytics/urls/logs             | Get all analytics logs of urls      |
| [**getAllUrlStats**](AnalyticsApi.md#getallurlstats)         | **GET** /api/v1/analytics/urls/stats            | Get all analytics stats of urls     |
| [**getAllUrlTimeline**](AnalyticsApi.md#getallurltimeline)   | **GET** /api/v1/analytics/urls/timeline         | Get all timeline of urls            |
| [**getUrlLogsById**](AnalyticsApi.md#geturllogsbyid)         | **GET** /api/v1/analytics/urls/{urlId}/logs     | Get all analytics logs of url by id |
| [**getUrlStatsById**](AnalyticsApi.md#geturlstatsbyid)       | **GET** /api/v1/analytics/urls/{urlId}/stats    | Get analytics stats of url by id    |
| [**getUrlTimelineById**](AnalyticsApi.md#geturltimelinebyid) | **GET** /api/v1/analytics/urls/{urlId}/timeline | Get url timeline by id              |
| [**getUrlsOverview**](AnalyticsApi.md#geturlsoverview)       | **GET** /api/v1/analytics/urls/overview         | Overview of url analytics           |

## getAllUrlLogs

> UrlAnalyticLogPaginatedResponse getAllUrlLogs(limit, page)

Get all analytics logs of urls

### Example

```ts
import { Configuration, AnalyticsApi } from "";
import type { GetAllUrlLogsRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AnalyticsApi();

  const body = {
    // number | Page size (optional)
    limit: 8.14,
    // number | Page number (optional)
    page: 8.14,
  } satisfies GetAllUrlLogsRequest;

  try {
    const data = await api.getAllUrlLogs(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name      | Type     | Description | Notes                         |
| --------- | -------- | ----------- | ----------------------------- |
| **limit** | `number` | Page size   | [Optional] [Defaults to `10`] |
| **page**  | `number` | Page number | [Optional] [Defaults to `1`]  |

### Return type

[**UrlAnalyticLogPaginatedResponse**](UrlAnalyticLogPaginatedResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                                 | Response headers |
| ----------- | ------------------------------------------- | ---------------- |
| **200**     | Get all analytics logs of urls successfully | -                |
| **4XX**     | API Error Response                          | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getAllUrlStats

> UrlAnalyticStatPaginatedResponse getAllUrlStats(limit, page)

Get all analytics stats of urls

### Example

```ts
import { Configuration, AnalyticsApi } from "";
import type { GetAllUrlStatsRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AnalyticsApi();

  const body = {
    // number | Page size (optional)
    limit: 8.14,
    // number | Page number (optional)
    page: 8.14,
  } satisfies GetAllUrlStatsRequest;

  try {
    const data = await api.getAllUrlStats(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name      | Type     | Description | Notes                         |
| --------- | -------- | ----------- | ----------------------------- |
| **limit** | `number` | Page size   | [Optional] [Defaults to `10`] |
| **page**  | `number` | Page number | [Optional] [Defaults to `1`]  |

### Return type

[**UrlAnalyticStatPaginatedResponse**](UrlAnalyticStatPaginatedResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                                  | Response headers |
| ----------- | -------------------------------------------- | ---------------- |
| **200**     | Get all analytics stats of urls successfully | -                |
| **4XX**     | API Error Response                           | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getAllUrlTimeline

> UrlAnalyticTimelineDto getAllUrlTimeline()

Get all timeline of urls

### Example

```ts
import { Configuration, AnalyticsApi } from "";
import type { GetAllUrlTimelineRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AnalyticsApi();

  try {
    const data = await api.getAllUrlTimeline();
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

[**UrlAnalyticTimelineDto**](UrlAnalyticTimelineDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                           | Response headers |
| ----------- | ------------------------------------- | ---------------- |
| **200**     | Get all timeline of urls successfully | -                |
| **4XX**     | API Error Response                    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getUrlLogsById

> UrlAnalyticLogPaginatedResponse getUrlLogsById(urlId, limit, page)

Get all analytics logs of url by id

### Example

```ts
import { Configuration, AnalyticsApi } from "";
import type { GetUrlLogsByIdRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AnalyticsApi();

  const body = {
    // string
    urlId: urlId_example,
    // number | Page size (optional)
    limit: 8.14,
    // number | Page number (optional)
    page: 8.14,
  } satisfies GetUrlLogsByIdRequest;

  try {
    const data = await api.getUrlLogsById(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name      | Type     | Description | Notes                         |
| --------- | -------- | ----------- | ----------------------------- |
| **urlId** | `string` |             | [Defaults to `undefined`]     |
| **limit** | `number` | Page size   | [Optional] [Defaults to `10`] |
| **page**  | `number` | Page number | [Optional] [Defaults to `1`]  |

### Return type

[**UrlAnalyticLogPaginatedResponse**](UrlAnalyticLogPaginatedResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                                      | Response headers |
| ----------- | ------------------------------------------------ | ---------------- |
| **200**     | Get all analytics logs of url by id successfully | -                |
| **4XX**     | API Error Response                               | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getUrlStatsById

> UrlAnalyticStatResponse getUrlStatsById(urlId)

Get analytics stats of url by id

### Example

```ts
import { Configuration, AnalyticsApi } from "";
import type { GetUrlStatsByIdRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AnalyticsApi();

  const body = {
    // string
    urlId: urlId_example,
  } satisfies GetUrlStatsByIdRequest;

  try {
    const data = await api.getUrlStatsById(body);
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
| **urlId** | `string` |             | [Defaults to `undefined`] |

### Return type

[**UrlAnalyticStatResponse**](UrlAnalyticStatResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                                   | Response headers |
| ----------- | --------------------------------------------- | ---------------- |
| **200**     | Get analytics stats of url by id successfully | -                |
| **4XX**     | API Error Response                            | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getUrlTimelineById

> UrlAnalyticTimelineResponse getUrlTimelineById(urlId)

Get url timeline by id

### Example

```ts
import { Configuration, AnalyticsApi } from "";
import type { GetUrlTimelineByIdRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AnalyticsApi();

  const body = {
    // string
    urlId: urlId_example,
  } satisfies GetUrlTimelineByIdRequest;

  try {
    const data = await api.getUrlTimelineById(body);
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
| **urlId** | `string` |             | [Defaults to `undefined`] |

### Return type

[**UrlAnalyticTimelineResponse**](UrlAnalyticTimelineResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                         | Response headers |
| ----------- | ----------------------------------- | ---------------- |
| **200**     | Get url timeline by id successfully | -                |
| **4XX**     | API Error Response                  | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getUrlsOverview

> UrlAnalyticsOverviewResponse getUrlsOverview()

Overview of url analytics

### Example

```ts
import { Configuration, AnalyticsApi } from "";
import type { GetUrlsOverviewRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AnalyticsApi();

  try {
    const data = await api.getUrlsOverview();
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

[**UrlAnalyticsOverviewResponse**](UrlAnalyticsOverviewResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                             | Response headers |
| ----------- | --------------------------------------- | ---------------- |
| **200**     | Get url analytics overview successfully | -                |
| **4XX**     | API Error Response                      | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
