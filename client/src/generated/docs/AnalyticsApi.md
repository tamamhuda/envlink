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
| [**getUrlsOverview**](AnalyticsApi.md#geturlsoverview)       | **GET** /api/v1/analytics/urls/overview         | Get Overview of url analytics       |
| [**getUrlsSegments**](AnalyticsApi.md#geturlssegments)       | **GET** /api/v1/analytics/urls/segments         | Get Segments of url analytics       |

## getAllUrlLogs

> UrlAnalyticLogPaginatedResponse getAllUrlLogs(page, limit)

Get all analytics logs of urls

### Example

```ts
import { Configuration, AnalyticsApi } from "";
import type { GetAllUrlLogsRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AnalyticsApi();

  const body = {
    // number | Page number (optional)
    page: 1,
    // number | Page size (optional)
    limit: 10,
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

| Name      | Type     | Description | Notes                        |
| --------- | -------- | ----------- | ---------------------------- |
| **page**  | `number` | Page number | [Optional] [Defaults to `1`] |
| **limit** | `number` | Page size   | [Optional] [Defaults to `1`] |

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

> UrlAnalyticStatPaginatedResponse getAllUrlStats(page, limit)

Get all analytics stats of urls

### Example

```ts
import { Configuration, AnalyticsApi } from "";
import type { GetAllUrlStatsRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AnalyticsApi();

  const body = {
    // number | Page number (optional)
    page: 1,
    // number | Page size (optional)
    limit: 10,
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

| Name      | Type     | Description | Notes                        |
| --------- | -------- | ----------- | ---------------------------- |
| **page**  | `number` | Page number | [Optional] [Defaults to `1`] |
| **limit** | `number` | Page size   | [Optional] [Defaults to `1`] |

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

> UrlAnalyticTimelineResponse getAllUrlTimeline()

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

[**UrlAnalyticTimelineResponse**](UrlAnalyticTimelineResponse.md)

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

> UrlAnalyticLogPaginatedResponse getUrlLogsById(urlId, page, limit)

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
    // number | Page number (optional)
    page: 1,
    // number | Page size (optional)
    limit: 10,
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

| Name      | Type     | Description | Notes                        |
| --------- | -------- | ----------- | ---------------------------- |
| **urlId** | `string` |             | [Defaults to `undefined`]    |
| **page**  | `number` | Page number | [Optional] [Defaults to `1`] |
| **limit** | `number` | Page size   | [Optional] [Defaults to `1`] |

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

Get Overview of url analytics

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

## getUrlsSegments

> UrlAnalyticsSegmentsResponse getUrlsSegments()

Get Segments of url analytics

### Example

```ts
import { Configuration, AnalyticsApi } from "";
import type { GetUrlsSegmentsRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AnalyticsApi();

  try {
    const data = await api.getUrlsSegments();
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

[**UrlAnalyticsSegmentsResponse**](UrlAnalyticsSegmentsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                             | Response headers |
| ----------- | --------------------------------------- | ---------------- |
| **200**     | Get url analytics segments successfully | -                |
| **4XX**     | API Error Response                      | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
