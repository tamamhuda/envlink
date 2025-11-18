# @envlink/client@v1.0

A TypeScript SDK client for the local-nest.utadev.app API.

## Usage

First, install the SDK from npm.

```bash
npm install @envlink/client --save
```

Next, try it out.


```ts
import {
  Configuration,
  AccountApi,
} from '@envlink/client';
import type { ChangePasswordRequest } from '@envlink/client';

async function example() {
  console.log("🚀 Testing @envlink/client SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: jwt-access
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  const body = {
    // ChangePasswordBodyDto
    changePasswordBodyDto: ...,
  } satisfies ChangePasswordRequest;

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


## Documentation

### API Endpoints

All URIs are relative to *https://local-nest.utadev.app*

| Class | Method | HTTP request | Description
| ----- | ------ | ------------ | -------------
*AccountApi* | [**changePassword**](docs/AccountApi.md#changepassword) | **POST** /api/v1/account/change-password | Change password
*AccountApi* | [**logout**](docs/AccountApi.md#logout) | **POST** /api/v1/account/logout | Logout user
*AccountApi* | [**verifyResend**](docs/AccountApi.md#verifyresend) | **POST** /api/v1/account/verify/resend | Resend verification email
*AuthenticationApi* | [**login**](docs/AuthenticationApi.md#login) | **POST** /api/v1/auth/login | Login an account
*AuthenticationApi* | [**refresh**](docs/AuthenticationApi.md#refresh) | **POST** /api/v1/auth/refresh | Refresh token
*AuthenticationApi* | [**register**](docs/AuthenticationApi.md#register) | **POST** /api/v1/auth/register | Register a new account
*AuthenticationApi* | [**verify**](docs/AuthenticationApi.md#verify) | **GET** /api/v1/auth/verify | Verify email
*HealthApi* | [**healthCheck**](docs/HealthApi.md#healthcheck) | **GET** /api/v1/health | Check health status
*PaymentMethodsApi* | [**create**](docs/PaymentMethodsApi.md#create) | **POST** /api/v1/payment-methods | Create payment method
*PaymentMethodsApi* | [**getAll**](docs/PaymentMethodsApi.md#getall) | **GET** /api/v1/payment-methods | Get all payment methods
*PaymentMethodsApi* | [**getById**](docs/PaymentMethodsApi.md#getbyid) | **GET** /api/v1/payment-methods/{id} | Get payment method by id
*PaymentMethodsApi* | [**request**](docs/PaymentMethodsApi.md#request) | **GET** /api/v1/payment-methods/requests | Get requested payment methods
*PaymentMethodsApi* | [**sort**](docs/PaymentMethodsApi.md#sort) | **PATCH** /api/v1/payment-methods/sort | Sort payment methods
*PaymentMethodsApi* | [**validate**](docs/PaymentMethodsApi.md#validate) | **POST** /api/v1/payment-methods/validate | Validate payment method
*PublicPaymentMethodsApi* | [**add**](docs/PublicPaymentMethodsApi.md#add) | **GET** /api/v1/public/payment-methods/add | Add payment method
*PublicPaymentMethodsApi* | [**create**](docs/PublicPaymentMethodsApi.md#create) | **POST** /api/v1/public/payment-methods | Create payment method
*PublicPaymentMethodsApi* | [**validate**](docs/PublicPaymentMethodsApi.md#validate) | **POST** /api/v1/public/payment-methods/validate | Validate payment method
*PublicSubscriptionsPlansApi* | [**getAll**](docs/PublicSubscriptionsPlansApi.md#getall) | **GET** /api/v1/public/subscriptions/plans | Get all plan details
*PublicSubscriptionsPlansApi* | [**getByName**](docs/PublicSubscriptionsPlansApi.md#getbyname) | **GET** /api/v1/public/subscriptions/plans/{name} | Get plan details by name
*PublicURLsApi* | [**getByCode**](docs/PublicURLsApi.md#getbycode) | **GET** /api/v1/public/urls/{code} | Get a short URL for public access
*PublicURLsApi* | [**shorten**](docs/PublicURLsApi.md#shorten) | **POST** /api/v1/public/urls/shorten | Shorten a URL for public access
*PublicURLsApi* | [**unlock**](docs/PublicURLsApi.md#unlock) | **POST** /api/v1/public/urls/unlock/{code} | Unlock a short URL for public access
*SessionsApi* | [**getAll**](docs/SessionsApi.md#getall) | **GET** /api/v1/session | Get all user sessions
*SessionsApi* | [**getById**](docs/SessionsApi.md#getbyid) | **GET** /api/v1/session/{id} | Get session by id
*SessionsApi* | [**revokeAll**](docs/SessionsApi.md#revokeall) | **POST** /api/v1/session/revoke | Revoke all user sessions
*SessionsApi* | [**revokeById**](docs/SessionsApi.md#revokebyid) | **POST** /api/v1/session/revoke/{id} | Revoke a user session
*SubscriptionsApi* | [**deactivate**](docs/SubscriptionsApi.md#deactivate) | **POST** /api/v1/subscriptions/{id}/deactivate | Deactivate subscription plan
*SubscriptionsApi* | [**getActive**](docs/SubscriptionsApi.md#getactive) | **GET** /api/v1/subscriptions/active | Get current user active subscription
*SubscriptionsApi* | [**getById**](docs/SubscriptionsApi.md#getbyid) | **GET** /api/v1/subscriptions/{id} | Get subscription by id
*SubscriptionsApi* | [**getUpgradeOptions**](docs/SubscriptionsApi.md#getupgradeoptions) | **GET** /api/v1/subscriptions/{id}/upgrade-options | Get subscription upgrade options
*SubscriptionsApi* | [**subscriptionsCyclesControllerGetAllUserSubscriptionCycles**](docs/SubscriptionsApi.md#subscriptionscyclescontrollergetallusersubscriptioncycles) | **GET** /api/v1/subscriptions/{id}/cycles | Get all subscription cycles
*SubscriptionsApi* | [**subscriptionsCyclesControllerGetUserActiveSubscriptionCycles**](docs/SubscriptionsApi.md#subscriptionscyclescontrollergetuseractivesubscriptioncycles) | **GET** /api/v1/subscriptions/active/cycles | Get all active subscription cycles
*SubscriptionsApi* | [**subscriptionsCyclesControllerGetUserSubscriptionCycleById**](docs/SubscriptionsApi.md#subscriptionscyclescontrollergetusersubscriptioncyclebyid) | **GET** /api/v1/subscriptions/{id}/cycles/{cycleId} | Get subscription cycle by id
*SubscriptionsApi* | [**upgrade**](docs/SubscriptionsApi.md#upgrade) | **POST** /api/v1/subscriptions/{id}/upgrade | Upgrade subscription plan
*TransactionsApi* | [**getAll**](docs/TransactionsApi.md#getall) | **GET** /api/v1/transactions | Get all transactions
*TransactionsApi* | [**getById**](docs/TransactionsApi.md#getbyid) | **GET** /api/v1/transactions/{id} | Get transaction by id
*UrlsApi* | [**_delete**](docs/UrlsApi.md#_delete) | **DELETE** /api/v1/urls/{id} | Delete a short URL
*UrlsApi* | [**getAll**](docs/UrlsApi.md#getall) | **GET** /api/v1/urls | Get all short URLs for a user
*UrlsApi* | [**getById**](docs/UrlsApi.md#getbyid) | **GET** /api/v1/urls/{id} | Get a short URL by id
*UrlsApi* | [**shorten**](docs/UrlsApi.md#shorten) | **POST** /api/v1/urls | Create a new short URL
*UrlsApi* | [**update**](docs/UrlsApi.md#update) | **PUT** /api/v1/urls/{id} | Update a short URL
*UserApi* | [**userControllerImageUpload**](docs/UserApi.md#usercontrollerimageupload) | **POST** /api/v1/user/image/upload | Upload user image
*UserApi* | [**userControllerUpdateUser**](docs/UserApi.md#usercontrollerupdateuser) | **PATCH** /api/v1/user/{id} | Update user information
*UserApi* | [**userControllerUserInfo**](docs/UserApi.md#usercontrolleruserinfo) | **GET** /api/v1/user/me | Get user information
*WebhooksApi* | [**webhooksControllerHandleXenditPaymentMethods**](docs/WebhooksApi.md#webhookscontrollerhandlexenditpaymentmethods) | **POST** /api/v1/webhooks/xendit/payment_methods | Handle Xendit payment methods callback data
*WebhooksApi* | [**webhooksControllerHandleXenditRecurring**](docs/WebhooksApi.md#webhookscontrollerhandlexenditrecurring) | **POST** /api/v1/webhooks/xendit/recurring | Handle Xendit recurring plan callback data


### Models

- [AllPaymentMethodActionResponse](docs/AllPaymentMethodActionResponse.md)
- [AllPaymentMethodActionResponseDataInner](docs/AllPaymentMethodActionResponseDataInner.md)
- [AllPaymentMethodsResponse](docs/AllPaymentMethodsResponse.md)
- [AllPlansResponse](docs/AllPlansResponse.md)
- [AllSessionsInfoResponse](docs/AllSessionsInfoResponse.md)
- [AllSubscriptionCyclesResponse](docs/AllSubscriptionCyclesResponse.md)
- [AllSubscriptionCyclesResponseDataInner](docs/AllSubscriptionCyclesResponseDataInner.md)
- [AllUrlsResponse](docs/AllUrlsResponse.md)
- [AuthenticatedResponse](docs/AuthenticatedResponse.md)
- [AuthenticatedResponseData](docs/AuthenticatedResponseData.md)
- [AuthenticatedResponseDataTokens](docs/AuthenticatedResponseDataTokens.md)
- [ChangePasswordBodyDto](docs/ChangePasswordBodyDto.md)
- [CreatePaymentMethodBodyDto](docs/CreatePaymentMethodBodyDto.md)
- [ErrorResponse](docs/ErrorResponse.md)
- [HealthCheck200Response](docs/HealthCheck200Response.md)
- [HealthCheck200ResponseErrorValue](docs/HealthCheck200ResponseErrorValue.md)
- [HealthCheck200ResponseInfoValue](docs/HealthCheck200ResponseInfoValue.md)
- [HealthCheck503Response](docs/HealthCheck503Response.md)
- [LoginBodyDto](docs/LoginBodyDto.md)
- [OkResponse](docs/OkResponse.md)
- [OkResponseData](docs/OkResponseData.md)
- [PaymentMethodActionResponse](docs/PaymentMethodActionResponse.md)
- [PaymentMethodResponse](docs/PaymentMethodResponse.md)
- [PaymentMethodResponseData](docs/PaymentMethodResponseData.md)
- [PaymentMethodResponseDataCard](docs/PaymentMethodResponseDataCard.md)
- [PaymentMethodResponseDataDirectDebit](docs/PaymentMethodResponseDataDirectDebit.md)
- [PaymentMethodResponseDataEwallet](docs/PaymentMethodResponseDataEwallet.md)
- [PlanResponse](docs/PlanResponse.md)
- [PublicUrlResponse](docs/PublicUrlResponse.md)
- [PublicUrlResponseData](docs/PublicUrlResponseData.md)
- [RegisterBodyDto](docs/RegisterBodyDto.md)
- [SessionInfoResponse](docs/SessionInfoResponse.md)
- [SessionInfoResponseData](docs/SessionInfoResponseData.md)
- [ShortenUrlBodyDto](docs/ShortenUrlBodyDto.md)
- [SortPaymentMethodsBodyDto](docs/SortPaymentMethodsBodyDto.md)
- [SortPaymentMethodsBodyDtoRootInner](docs/SortPaymentMethodsBodyDtoRootInner.md)
- [SubscriptionCycleResponse](docs/SubscriptionCycleResponse.md)
- [SubscriptionInfoResponse](docs/SubscriptionInfoResponse.md)
- [SubscriptionInfoResponseData](docs/SubscriptionInfoResponseData.md)
- [SubscriptionInfoResponseDataActionsInner](docs/SubscriptionInfoResponseDataActionsInner.md)
- [SubscriptionInfoResponseDataMetadata](docs/SubscriptionInfoResponseDataMetadata.md)
- [SubscriptionInfoResponseDataPlan](docs/SubscriptionInfoResponseDataPlan.md)
- [SubscriptionInfoResponseDataSchedule](docs/SubscriptionInfoResponseDataSchedule.md)
- [SubscriptionUpgradeOptionsResponse](docs/SubscriptionUpgradeOptionsResponse.md)
- [SubscriptionUpgradeOptionsResponseDataInner](docs/SubscriptionUpgradeOptionsResponseDataInner.md)
- [SubscriptionUpgradeOptionsResponseDataInnerOptionsInner](docs/SubscriptionUpgradeOptionsResponseDataInnerOptionsInner.md)
- [TokensResponse](docs/TokensResponse.md)
- [TransactionsResponse](docs/TransactionsResponse.md)
- [TransactionsResponseDataInner](docs/TransactionsResponseDataInner.md)
- [UnlockUrlBodyDto](docs/UnlockUrlBodyDto.md)
- [UpdateUrlBodyDto](docs/UpdateUrlBodyDto.md)
- [UpdateUserBodyDto](docs/UpdateUserBodyDto.md)
- [UpgradeSubscriptionBodyDto](docs/UpgradeSubscriptionBodyDto.md)
- [UpgradeSubscriptionBodyDtoSchedule](docs/UpgradeSubscriptionBodyDtoSchedule.md)
- [UrlResponse](docs/UrlResponse.md)
- [UrlResponseData](docs/UrlResponseData.md)
- [UrlResponseDataChannelsInner](docs/UrlResponseDataChannelsInner.md)
- [UrlResponseDataMetadata](docs/UrlResponseDataMetadata.md)
- [UserInfoDto](docs/UserInfoDto.md)
- [UserInfoResponse](docs/UserInfoResponse.md)
- [UserInfoResponseData](docs/UserInfoResponseData.md)
- [UserInfoResponseDataProviders](docs/UserInfoResponseDataProviders.md)
- [ValidatePaymentMethodBodyDto](docs/ValidatePaymentMethodBodyDto.md)
- [ValidatePaymentMethodBodyDtoCard](docs/ValidatePaymentMethodBodyDtoCard.md)
- [ValidatePaymentMethodBodyDtoDirectDebit](docs/ValidatePaymentMethodBodyDtoDirectDebit.md)
- [ValidatePaymentMethodBodyDtoEwallet](docs/ValidatePaymentMethodBodyDtoEwallet.md)
- [WebhookBodyDto](docs/WebhookBodyDto.md)

### Authorization


Authentication schemes defined for the API:
<a id="jwt-access"></a>
#### jwt-access


- **Type**: HTTP Bearer Token authentication (JWT)
<a id="jwt-refresh"></a>
#### jwt-refresh


- **Type**: HTTP Bearer Token authentication (JWT)

## About

This TypeScript SDK client supports the [Fetch API](https://fetch.spec.whatwg.org/)
and is automatically generated by the
[OpenAPI Generator](https://openapi-generator.tech) project:

- API version: `v1.0`
- Package version: `v1.0`
- Generator version: `7.17.0`
- Build package: `org.openapitools.codegen.languages.TypeScriptFetchClientCodegen`

The generated npm module supports the following:

- Environments
  * Node.js
  * Webpack
  * Browserify
- Language levels
  * ES5 - you must have a Promises/A+ library installed
  * ES6
- Module systems
  * CommonJS
  * ES6 module system


## Development

### Building

To build the TypeScript source code, you need to have Node.js and npm installed.
After cloning the repository, navigate to the project directory and run:

```bash
npm install
npm run build
```

### Publishing

Once you've built the package, you can publish it to npm:

```bash
npm publish
```

## License

[]()
