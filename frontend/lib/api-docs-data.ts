export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiParameter {
  name: string;
  type: string;
  in: "query" | "path" | "header" | "body";
  required: boolean;
  description: string;
}

export interface ApiResponse {
  code: number;
  description: string;
  example?: string;
}

export interface ApiEndpoint {
  id: string;
  tag: string;
  method: ApiMethod;
  path: string;
  summary: string;
  parameters?: ApiParameter[];
  requestBodyExample?: string;
  responses: ApiResponse[];
}

export const apiEndpoints: ApiEndpoint[] = [
  {
    id: "get-api-v1-audit-logs",
    tag: "Audit Logs",
    method: "GET",
    path: "/api/v1/audit-logs/",
    summary: "View audit log trail of all state changes. Read-only for compliance and debugging.",
    parameters: [
  { name: "ordering", type: "string", in: "query", required: false, description: "Which field to use when ordering the results." },
  { name: "page", type: "integer", in: "query", required: false, description: "A page number within the paginated result set." },
  { name: "search", type: "string", in: "query", required: false, description: "A search term." }
],
    responses: [{ code: 200, description: "Successful response", example: `{ "count": 123, "results": [{ "id": "uuid", "object": "audit_log", "event_type": "string" }] }` }]
  },
  {
    id: "get-api-v1-audit-logs-id",
    tag: "Audit Logs",
    method: "GET",
    path: "/api/v1/audit-logs/{id}/",
    summary: "View audit log trail of all state changes. Read-only for compliance and debugging.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid", "object": "audit_log", "event_type": "string" }` }]
  },
  {
    id: "get-api-v1-coupons",
    tag: "Coupons",
    method: "GET",
    path: "/api/v1/coupons/",
    summary: "Manage discount coupons for promotional pricing. Supports CRUD and redeem operations.",
    parameters: [
  { name: "ordering", type: "string", in: "query", required: false, description: "Which field to use when ordering the results." },
  { name: "page", type: "integer", in: "query", required: false, description: "A page number within the paginated result set." },
  { name: "search", type: "string", in: "query", required: false, description: "A search term." }
],
    responses: [{ code: 200, description: "Successful response", example: `{ "count": 123, "results": [{ "id": "uuid", "code": "string", "discount_type": "percentage", "discount_value": 10 }] }` }]
  },
  {
    id: "post-api-v1-coupons",
    tag: "Coupons",
    method: "POST",
    path: "/api/v1/coupons/",
    summary: "Manage discount coupons for promotional pricing.",
    requestBodyExample: `{ "code": "string", "discount_type": "percentage", "discount_value": 10 }`,
    responses: [{ code: 201, description: "Successful response", example: `{ "id": "uuid", "code": "string" }` }]
  },
  {
    id: "get-api-v1-coupons-id",
    tag: "Coupons",
    method: "GET",
    path: "/api/v1/coupons/{id}/",
    summary: "Manage discount coupons for promotional pricing.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid", "code": "string" }` }]
  },
  {
    id: "put-api-v1-coupons-id",
    tag: "Coupons",
    method: "PUT",
    path: "/api/v1/coupons/{id}/",
    summary: "Manage discount coupons for promotional pricing.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    requestBodyExample: `{ "code": "string", "discount_type": "percentage", "discount_value": 10 }`,
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "patch-api-v1-coupons-id",
    tag: "Coupons",
    method: "PATCH",
    path: "/api/v1/coupons/{id}/",
    summary: "Manage discount coupons for promotional pricing.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    requestBodyExample: `{ "code": "string" }`,
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "delete-api-v1-coupons-id",
    tag: "Coupons",
    method: "DELETE",
    path: "/api/v1/coupons/{id}/",
    summary: "Manage discount coupons for promotional pricing.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 204, description: "Successful response" }]
  },
  {
    id: "post-api-v1-coupons-id-redeem",
    tag: "Coupons",
    method: "POST",
    path: "/api/v1/coupons/{id}/redeem/",
    summary: "Redeem a coupon. Validates active status, expiry, and redemption limit.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    requestBodyExample: `{ "code": "string" }`,
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid", "times_redeemed": 1 }` }]
  },
  {
    id: "get-api-v1-customers",
    tag: "Customers",
    method: "GET",
    path: "/api/v1/customers/",
    summary: "Manage customers - billable end-users.",
    parameters: [
  { name: "ordering", type: "string", in: "query", required: false, description: "Which field to use when ordering the results." },
  { name: "page", type: "integer", in: "query", required: false, description: "A page number within the paginated result set." },
  { name: "search", type: "string", in: "query", required: false, description: "A search term." }
],
    responses: [{ code: 200, description: "Successful response", example: `{ "count": 123, "results": [{ "id": "uuid", "email": "user@example.com" }] }` }]
  },
  {
    id: "post-api-v1-customers",
    tag: "Customers",
    method: "POST",
    path: "/api/v1/customers/",
    summary: "Manage customers - billable end-users.",
    requestBodyExample: `{ "email": "user@example.com", "name": "string" }`,
    responses: [{ code: 201, description: "Successful response", example: `{ "id": "uuid", "email": "user@example.com" }` }]
  },
  {
    id: "get-api-v1-customers-id",
    tag: "Customers",
    method: "GET",
    path: "/api/v1/customers/{id}/",
    summary: "Manage customers - billable end-users.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid", "email": "user@example.com" }` }]
  },
  {
    id: "put-api-v1-customers-id",
    tag: "Customers",
    method: "PUT",
    path: "/api/v1/customers/{id}/",
    summary: "Manage customers - billable end-users.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    requestBodyExample: `{ "email": "user@example.com", "name": "string" }`,
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "patch-api-v1-customers-id",
    tag: "Customers",
    method: "PATCH",
    path: "/api/v1/customers/{id}/",
    summary: "Manage customers - billable end-users.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    requestBodyExample: `{ "name": "string" }`,
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "delete-api-v1-customers-id",
    tag: "Customers",
    method: "DELETE",
    path: "/api/v1/customers/{id}/",
    summary: "Manage customers - billable end-users.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 204, description: "Successful response" }]
  },
  {
    id: "get-api-v1-customers-id-payment-methods",
    tag: "Customers",
    method: "GET",
    path: "/api/v1/customers/{id}/payment-methods/",
    summary: "List payment methods for a customer.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "count": 2, "results": [] }` }]
  },
  {
    id: "post-api-v1-customers-id-payment-methods",
    tag: "Customers",
    method: "POST",
    path: "/api/v1/customers/{id}/payment-methods/",
    summary: "Attach a new payment method.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    requestBodyExample: `{ "token": "tok_123" }`,
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "delete-api-v1-customers-id-payment-methods-payment-method-id",
    tag: "Customers",
    method: "DELETE",
    path: "/api/v1/customers/{id}/payment-methods/{payment_method_id}/",
    summary: "Detach a payment method from a customer.",
    parameters: [
  { name: "id", type: "string", in: "path", required: true, description: "Customer ID" },
  { name: "payment_method_id", type: "string", in: "path", required: true, description: "Payment Method ID" }
],
    responses: [{ code: 204, description: "Successful response" }]
  },
  {
    id: "post-api-v1-customers-id-payment-methods-payment-method-id-set-default",
    tag: "Customers",
    method: "POST",
    path: "/api/v1/customers/{id}/payment-methods/{payment_method_id}/set-default/",
    summary: "Set a payment method as default.",
    parameters: [
  { name: "id", type: "string", in: "path", required: true, description: "Customer ID" },
  { name: "payment_method_id", type: "string", in: "path", required: true, description: "Payment Method ID" }
],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "get-api-v1-dunning-attempts",
    tag: "Dunning Attempts",
    method: "GET",
    path: "/api/v1/dunning-attempts/",
    summary: "View dunning retry attempts and their status.",
    parameters: [
  { name: "ordering", type: "string", in: "query", required: false, description: "Which field to use when ordering the results." },
  { name: "page", type: "integer", in: "query", required: false, description: "A page number within the paginated result set." },
  { name: "search", type: "string", in: "query", required: false, description: "A search term." }
],
    responses: [{ code: 200, description: "Successful response", example: `{ "count": 123, "results": [] }` }]
  },
  {
    id: "get-api-v1-dunning-attempts-id",
    tag: "Dunning Attempts",
    method: "GET",
    path: "/api/v1/dunning-attempts/{id}/",
    summary: "View dunning retry attempts and their status.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "get-api-v1-entitlements",
    tag: "Entitlements",
    method: "GET",
    path: "/api/v1/entitlements/",
    summary: "View feature entitlements granted to customers.",
    parameters: [
  { name: "ordering", type: "string", in: "query", required: false, description: "Which field to use when ordering the results." },
  { name: "page", type: "integer", in: "query", required: false, description: "A page number within the paginated result set." },
  { name: "search", type: "string", in: "query", required: false, description: "A search term." }
],
    responses: [{ code: 200, description: "Successful response", example: `{ "count": 123, "results": [] }` }]
  },
  {
    id: "get-api-v1-entitlements-id",
    tag: "Entitlements",
    method: "GET",
    path: "/api/v1/entitlements/{id}/",
    summary: "View feature entitlements granted to customers.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "get-api-v1-invoices",
    tag: "Invoices",
    method: "GET",
    path: "/api/v1/invoices/",
    summary: "Manage invoices - financial records.",
    parameters: [
  { name: "ordering", type: "string", in: "query", required: false, description: "Which field to use when ordering the results." },
  { name: "page", type: "integer", in: "query", required: false, description: "A page number within the paginated result set." },
  { name: "search", type: "string", in: "query", required: false, description: "A search term." }
],
    responses: [{ code: 200, description: "Successful response", example: `{ "count": 123, "results": [] }` }]
  },
  {
    id: "get-api-v1-invoices-id",
    tag: "Invoices",
    method: "GET",
    path: "/api/v1/invoices/{id}/",
    summary: "Manage invoices - financial records.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "post-api-v1-invoices-id-pay",
    tag: "Invoices",
    method: "POST",
    path: "/api/v1/invoices/{id}/pay/",
    summary: "Manually trigger payment for an open invoice.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    requestBodyExample: `{ "payment_method": "uuid" }`,
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid", "status": "paid" }` }]
  },
  {
    id: "post-api-v1-invoices-id-void",
    tag: "Invoices",
    method: "POST",
    path: "/api/v1/invoices/{id}/void/",
    summary: "Void an invoice.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid", "status": "void" }` }]
  },
  {
    id: "get-api-v1-payments",
    tag: "Payments",
    method: "GET",
    path: "/api/v1/payments/",
    summary: "View payment attempts and their outcomes.",
    parameters: [
  { name: "ordering", type: "string", in: "query", required: false, description: "Which field to use when ordering the results." },
  { name: "page", type: "integer", in: "query", required: false, description: "A page number within the paginated result set." },
  { name: "search", type: "string", in: "query", required: false, description: "A search term." }
],
    responses: [{ code: 200, description: "Successful response", example: `{ "count": 123, "results": [] }` }]
  },
  {
    id: "get-api-v1-payments-id",
    tag: "Payments",
    method: "GET",
    path: "/api/v1/payments/{id}/",
    summary: "View payment attempts and their outcomes.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "get-api-v1-plans",
    tag: "Plans",
    method: "GET",
    path: "/api/v1/plans/",
    summary: "Manage pricing plans. Define what you sell.",
    parameters: [
  { name: "ordering", type: "string", in: "query", required: false, description: "Which field to use when ordering the results." },
  { name: "page", type: "integer", in: "query", required: false, description: "A page number within the paginated result set." },
  { name: "search", type: "string", in: "query", required: false, description: "A search term." }
],
    responses: [{ code: 200, description: "Successful response", example: `{ "count": 123, "results": [] }` }]
  },
  {
    id: "post-api-v1-plans",
    tag: "Plans",
    method: "POST",
    path: "/api/v1/plans/",
    summary: "Manage pricing plans. Define what you sell.",
    requestBodyExample: `{ "name": "Basic Plan", "amount": 1000, "interval": "monthly" }`,
    responses: [{ code: 201, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "get-api-v1-plans-id",
    tag: "Plans",
    method: "GET",
    path: "/api/v1/plans/{id}/",
    summary: "Manage pricing plans. Define what you sell.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "put-api-v1-plans-id",
    tag: "Plans",
    method: "PUT",
    path: "/api/v1/plans/{id}/",
    summary: "Manage pricing plans. Define what you sell.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    requestBodyExample: `{ "name": "Basic Plan", "amount": 1000 }`,
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "patch-api-v1-plans-id",
    tag: "Plans",
    method: "PATCH",
    path: "/api/v1/plans/{id}/",
    summary: "Manage pricing plans. Define what you sell.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    requestBodyExample: `{ "name": "Basic Plan" }`,
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "delete-api-v1-plans-id",
    tag: "Plans",
    method: "DELETE",
    path: "/api/v1/plans/{id}/",
    summary: "Manage pricing plans. Define what you sell.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 204, description: "Successful response" }]
  },
  {
    id: "get-api-v1-subscriptions",
    tag: "Subscriptions",
    method: "GET",
    path: "/api/v1/subscriptions/",
    summary: "Manage subscriptions - the contract between customer and plan.",
    parameters: [
  { name: "ordering", type: "string", in: "query", required: false, description: "Which field to use when ordering the results." },
  { name: "page", type: "integer", in: "query", required: false, description: "A page number within the paginated result set." },
  { name: "search", type: "string", in: "query", required: false, description: "A search term." }
],
    responses: [{ code: 200, description: "Successful response", example: `{ "count": 123, "results": [] }` }]
  },
  {
    id: "post-api-v1-subscriptions",
    tag: "Subscriptions",
    method: "POST",
    path: "/api/v1/subscriptions/",
    summary: "Manage subscriptions - the contract between customer and plan.",
    requestBodyExample: `{ "customer": "uuid", "plan": "uuid" }`,
    responses: [{ code: 201, description: "Successful response", example: `{ "id": "uuid", "status": "active" }` }]
  },
  {
    id: "get-api-v1-subscriptions-id",
    tag: "Subscriptions",
    method: "GET",
    path: "/api/v1/subscriptions/{id}/",
    summary: "Manage subscriptions - the contract between customer and plan.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "put-api-v1-subscriptions-id",
    tag: "Subscriptions",
    method: "PUT",
    path: "/api/v1/subscriptions/{id}/",
    summary: "Manage subscriptions - the contract between customer and plan.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    requestBodyExample: `{ "plan": "uuid" }`,
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "patch-api-v1-subscriptions-id",
    tag: "Subscriptions",
    method: "PATCH",
    path: "/api/v1/subscriptions/{id}/",
    summary: "Manage subscriptions - the contract between customer and plan.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    requestBodyExample: `{ "metadata": "{}" }`,
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "delete-api-v1-subscriptions-id",
    tag: "Subscriptions",
    method: "DELETE",
    path: "/api/v1/subscriptions/{id}/",
    summary: "Manage subscriptions - the contract between customer and plan.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 204, description: "Successful response" }]
  },
  {
    id: "post-api-v1-subscriptions-id-cancel",
    tag: "Subscriptions",
    method: "POST",
    path: "/api/v1/subscriptions/{id}/cancel/",
    summary: "Cancel a subscription.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    requestBodyExample: `{ "cancel_at_period_end": true }`,
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "post-api-v1-subscriptions-id-change-plan",
    tag: "Subscriptions",
    method: "POST",
    path: "/api/v1/subscriptions/{id}/change-plan/",
    summary: "Change subscription plan with proration.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    requestBodyExample: `{ "plan": "uuid", "proration_behavior": "create_prorations" }`,
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "post-api-v1-subscriptions-id-reactivate",
    tag: "Subscriptions",
    method: "POST",
    path: "/api/v1/subscriptions/{id}/reactivate/",
    summary: "Reactivate a canceled or unpaid subscription.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "get-api-v1-webhooks-endpoints",
    tag: "Webhooks",
    method: "GET",
    path: "/api/v1/webhooks/endpoints/",
    summary: "Manage webhook endpoints for receiving event notifications.",
    parameters: [
  { name: "ordering", type: "string", in: "query", required: false, description: "Which field to use when ordering the results." },
  { name: "page", type: "integer", in: "query", required: false, description: "A page number within the paginated result set." },
  { name: "search", type: "string", in: "query", required: false, description: "A search term." }
],
    responses: [{ code: 200, description: "Successful response", example: `{ "count": 123, "results": [] }` }]
  },
  {
    id: "post-api-v1-webhooks-endpoints",
    tag: "Webhooks",
    method: "POST",
    path: "/api/v1/webhooks/endpoints/",
    summary: "Manage webhook endpoints for receiving event notifications.",
    requestBodyExample: `{ "url": "https://example.com/webhook", "description": "My Webhook" }`,
    responses: [{ code: 201, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "get-api-v1-webhooks-endpoints-id",
    tag: "Webhooks",
    method: "GET",
    path: "/api/v1/webhooks/endpoints/{id}/",
    summary: "Manage webhook endpoints for receiving event notifications.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "delete-api-v1-webhooks-endpoints-id",
    tag: "Webhooks",
    method: "DELETE",
    path: "/api/v1/webhooks/endpoints/{id}/",
    summary: "Manage webhook endpoints for receiving event notifications.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 204, description: "Successful response" }]
  },
  {
    id: "get-api-v1-webhooks-events",
    tag: "Webhooks",
    method: "GET",
    path: "/api/v1/webhooks/events/",
    summary: "View webhook event delivery history.",
    parameters: [
  { name: "ordering", type: "string", in: "query", required: false, description: "Which field to use when ordering the results." },
  { name: "page", type: "integer", in: "query", required: false, description: "A page number within the paginated result set." },
  { name: "search", type: "string", in: "query", required: false, description: "A search term." }
],
    responses: [{ code: 200, description: "Successful response", example: `{ "count": 123, "results": [] }` }]
  },
  {
    id: "get-api-v1-webhooks-events-id",
    tag: "Webhooks",
    method: "GET",
    path: "/api/v1/webhooks/events/{id}/",
    summary: "View webhook event delivery history.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  },
  {
    id: "post-api-v1-webhooks-events-id-retry",
    tag: "Webhooks",
    method: "POST",
    path: "/api/v1/webhooks/events/{id}/retry/",
    summary: "Retry delivery of a failed webhook event.",
    parameters: [{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }],
    responses: [{ code: 200, description: "Successful response", example: `{ "id": "uuid" }` }]
  }
];
