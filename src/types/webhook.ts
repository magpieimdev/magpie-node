/**
 * A webhook event represents a notification about something that happened in your Magpie account.
 * 
 * Webhook events are sent to your configured endpoint URLs whenever certain events occur,
 * such as successful payments, failed charges, or customer updates.
 * 
 * @template T - The type of the object contained in the event data
 * 
 * @example
 * ```typescript
 * // Example webhook event for a successful charge
 * const event: WebhookEvent<Charge> = {
 *   id: 'evt_1234567890',
 *   type: 'charge.succeeded',
 *   data: {
 *     object: chargeObject // The actual charge that succeeded
 *   },
 *   created: 1609459200,
 *   livemode: false
 * };
 * ```
 */
export interface WebhookEvent<T = unknown> {
  /** Unique identifier for the event */
  id: string;

  /** Event type (e.g., 'payment.completed', 'customer.created') */
  type: string;

  /** The data associated with the event */
  data: {
    /** The actual object that was created, updated, etc. */
    object: T;
  };

  /** Time the event was created (Unix timestamp) */
  created: number;

  /** Whether this event is from test mode */
  livemode: boolean;

  /** API version used when the event was created */
  api_version?: string;

  /** Number of times delivery of this event was attempted */
  pending_webhooks?: number;

  /** Request details that caused this event */
  request?: {
    /** Request ID */
    id: string | null;
    
    /** Idempotency key of the request */
    idempotency_key: string | null;
  };
}

/**
 * Configuration for a webhook endpoint.
 * 
 * Webhook endpoints are URLs that Magpie can send event notifications to.
 * You can configure which events each endpoint should receive and manage
 * their enabled/disabled status.
 * 
 * @example
 * ```typescript
 * const endpoint: WebhookEndpoint = {
 *   id: 'we_1234567890',
 *   url: 'https://example.com/webhooks/magpie',
 *   enabled_events: ['charge.succeeded', 'customer.created'],
 *   enabled: true,
 *   status: 'enabled',
 *   livemode: false,
 *   created: 1609459200,
 *   updated: 1609545600
 * };
 * ```
 */
export interface WebhookEndpoint {
  /** Unique identifier for the webhook endpoint */
  id: string;

  /** The URL of the webhook endpoint */
  url: string;

  /** List of event types this endpoint is subscribed to */
  enabled_events: string[];

  /** Whether this endpoint is enabled */
  enabled: boolean;

  /** Whether this endpoint is from test mode */
  livemode: boolean;

  /** The status of the webhook endpoint */
  status: 'enabled' | 'disabled';

  /** When the webhook endpoint was created */
  created: number;

  /** When the webhook endpoint was last updated */
  updated: number;

  /** Webhook endpoint description */
  description?: string;

  /** Webhook endpoint metadata */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
}

/**
 * Configuration options for webhook signature verification.
 * 
 * These options control how webhook signatures are generated and verified
 * to ensure the authenticity of incoming webhook events.
 * 
 * @example
 * ```typescript
 * const config: WebhookSignatureConfig = {
 *   algorithm: 'sha256',
 *   signatureHeader: 'x-magpie-signature',
 *   timestampHeader: 'x-magpie-timestamp',
 *   tolerance: 300, // 5 minutes
 *   prefix: 'v1='
 * };
 * ```
 */
export interface WebhookSignatureConfig {
  /** Algorithm used for signature generation (default: 'sha256') */
  algorithm?: 'sha256' | 'sha1' | 'sha512';

  /** Header name containing the signature (default: 'x-magpie-signature') */
  signatureHeader?: string;

  /** Header name containing the timestamp (default: 'x-magpie-timestamp') */
  timestampHeader?: string;

  /** Maximum age of webhook in seconds (default: 300) */
  tolerance?: number;

  /** Signature prefix (default: 'v1=') */
  prefix?: string;
}

/**
 * Parsed webhook signature information.
 * 
 * Represents the components of a webhook signature after parsing
 * the signature header value.
 * @internal
 */
export interface WebhookSignature {
  /** Signature version */
  version: string;

  /** The signature value */
  signature: string;

  /** Timestamp when the signature was generated */
  timestamp?: number;
}

/**
 * Types of webhook events that can be sent by Magpie.
 * 
 * These event types correspond to different actions and state changes
 * in your Magpie account. Subscribe to the events you're interested in
 * to receive real-time notifications.
 * 
 * @example
 * ```typescript
 * // Handle different event types
 * switch (event.type) {
 *   case 'charge.succeeded':
 *     // Handle successful payment
 *     break;
 *   case 'charge.failed':
 *     // Handle failed payment
 *     break;
 *   case 'customer.created':
 *     // Handle new customer registration
 *     break;
 * }
 * ```
 */
export type WebhookEventType =
  | 'customer.created'
  | 'customer.updated'
  | 'customer.deleted'
  | 'source.created'
  | 'source.updated' 
  | 'source.deleted'
  | 'charge.created'
  | 'charge.updated'
  | 'charge.succeeded'
  | 'charge.failed'
  | 'charge.captured'
  | 'charge.disputed'
  | 'refund.created'
  | 'refund.updated'
  | 'payment_request.created'
  | 'payment_request.updated'
  | 'payment_request.succeeded'
  | 'payment_request.failed'
  | 'checkout_session.created'
  | 'checkout_session.completed'
  | 'checkout_session.expired'
  | 'payment_link.created'
  | 'payment_link.updated';