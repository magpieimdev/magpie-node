# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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