# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2025-09-07

### Fixed

- **Axios Retry Logic Error** - Fixed `Cannot read properties of undefined (reading '_retryCount')` error that occurred when axios errors don't have a config object during retry attempts
- **Test Stability** - Resolved flaky webhook timestamp validation tests that caused intermittent CI failures by calculating timestamps individually per test
- **Error Handling** - Added proper null checks in HTTP client response interceptor and shouldRetry method

### Technical Improvements

- Enhanced error handling test coverage with regression tests for axios error scenarios
- Improved CI reliability by eliminating race conditions in timing-sensitive tests
- Added null safety checks throughout HTTP client retry logic

## [1.1.1] - 2025-09-07

### Fixed

- **CheckoutSessions Base URL** - Corrected CheckoutSessions base URL from `https://new.pay.magpie.im` to `https://api.pay.magpie.im`
- **API Resolution** - Resolved CheckoutSession API call failures for create, retrieve, capture, and expire operations

### Changed

- Updated CheckoutSessionsResource constructor to use correct API endpoint
- Updated corresponding test expectations for base URL validation

## [1.1.0] - 2025-09-05

### Added

- **Organization Resource** - New resource for retrieving organization information including branding, payment method settings, and payout configurations
- **createTestOrganization()** utility function for testing with realistic organization data
- **Organization Types** - Complete TypeScript definitions for Organization, OrganizationBranding, PaymentMethodSettings, PaymentGateway, PaymentMethodRate, and PayoutSettings

### Changed

- **BREAKING: SourcesResource** - Removed `create()` method as sources should only be created client-side for security
- **SourcesResource Authentication** - Implemented lazy public key (PK) authentication that automatically switches from secret key to public key when retrieving sources
- **BaseClient** - Added `setApiKey()` and `getApiKey()` methods for dynamic API key switching
- **Enhanced Test Utilities** - Extended SpyableMagpie with `mockRequest()` and `mockNetworkError()` methods for better test coverage

### Fixed

- **Sources Security** - Sources now correctly use public key authentication as required by the API
- **Test Coverage** - Updated sources tests to remove create method tests and add PK authentication tests

### Technical Improvements

- Lazy authentication switching prevents unnecessary HTTP calls during SDK initialization
- Public key caching eliminates redundant organization API calls
- Enhanced mock testing infrastructure with request tracking and custom response handling

## [1.0.0] - 2025-09-04

### Added

- **Complete TypeScript SDK** for Magpie payment processing APIs
- **Customer Management** - Create, retrieve, update, delete customers with email lookup
- **Source Management** - Handle payment sources (cards, bank accounts) with secure tokenization
- **Charge Processing** - Create charges with capture, verify, void, and refund operations
- **Checkout Sessions** - Hosted payment pages with line items and customization
- **Payment Requests** - Send payment requests via email with void capabilities
- **Payment Links** - Create shareable payment links with inventory management
- **Webhook Handling** - Complete signature verification and event construction system
- **Comprehensive Error Handling** - Structured errors with proper typing and categorization
- **Request/Response Interceptors** - Built-in retry logic with exponential backoff
- **TypeScript Support** - Full type definitions with namespace organization
- **Authentication** - Secure API key validation and HTTP basic auth
- **Configuration Options** - Timeout, retry, debug mode, and environment settings
- **Idempotency Support** - Safe request retries with idempotency keys
- **Professional Documentation** - Complete JSDoc coverage and usage examples
- **Comprehensive Testing** - 227 tests across 9 test suites with mocking infrastructure
- **CI/CD Pipeline** - GitHub Actions with automated testing and publishing
- **Developer Tools** - ESLint, Prettier, and Jest configuration for development

### Technical Features

- Node.js 18+ compatibility with modern JavaScript support
- CommonJS and ES Module export compatibility
- Axios-based HTTP client with intelligent retry logic
- Timing-safe webhook signature verification
- Comprehensive request/response logging in debug mode
- Proper error propagation with request ID tracking
- Flexible base URL configuration for different environments
- Built-in support for PHP and USD currencies
- Metadata support across all API resources