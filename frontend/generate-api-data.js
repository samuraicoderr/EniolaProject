const fs = require('fs');

const tags = {
  AuditLogs: "Audit Logs",
  Coupons: "Coupons",
  Customers: "Customers",
  DunningAttempts: "Dunning Attempts",
  Entitlements: "Entitlements",
  Invoices: "Invoices",
  Payments: "Payments",
  Plans: "Plans",
  Subscriptions: "Subscriptions",
  Webhooks: "Webhooks"
};

const defaultListParams = `[
  { name: "ordering", type: "string", in: "query", required: false, description: "Which field to use when ordering the results." },
  { name: "page", type: "integer", in: "query", required: false, description: "A page number within the paginated result set." },
  { name: "search", type: "string", in: "query", required: false, description: "A search term." }
]`;

const idParam = `[{ name: "id", type: "string", in: "path", required: true, description: "Object ID" }]`;
const customerPaymentMethodsParams = `[
  { name: "id", type: "string", in: "path", required: true, description: "Customer ID" },
  { name: "payment_method_id", type: "string", in: "path", required: true, description: "Payment Method ID" }
]`;

function genEndpoint(tag, method, path, summary, params, reqBody, respCode, respBody) {
  const id = `${method.toLowerCase()}-${path.replace(/[^a-zA-Z0-9]/g, '-')}`.replace(/-+/g, '-').replace(/-$/, '');
  let out = `  {
    id: "${id}",
    tag: "${tag}",
    method: "${method}",
    path: "${path}",
    summary: "${summary}",
`;
  if (params) {
    out += `    parameters: ${params},\n`;
  }
  if (reqBody) {
    out += `    requestBodyExample: \`${reqBody}\`,\n`;
  }
  out += `    responses: [{ code: ${respCode}, description: "${respCode >= 200 && respCode < 300 ? 'Successful response' : 'Error'}"`;
  if (respBody) {
    out += `, example: \`${respBody}\``;
  }
  out += ` }]
  }`;
  return out;
}

const endpoints = [];

// AUDIT LOGS
endpoints.push(genEndpoint(tags.AuditLogs, "GET", "/api/v1/audit-logs/", "View audit log trail of all state changes. Read-only for compliance and debugging.", defaultListParams, null, 200, `{ "count": 123, "results": [{ "id": "uuid", "object": "audit_log", "event_type": "string" }] }`));
endpoints.push(genEndpoint(tags.AuditLogs, "GET", "/api/v1/audit-logs/{id}/", "View audit log trail of all state changes. Read-only for compliance and debugging.", idParam, null, 200, `{ "id": "uuid", "object": "audit_log", "event_type": "string" }`));

// COUPONS
endpoints.push(genEndpoint(tags.Coupons, "GET", "/api/v1/coupons/", "Manage discount coupons for promotional pricing. Supports CRUD and redeem operations.", defaultListParams, null, 200, `{ "count": 123, "results": [{ "id": "uuid", "code": "string", "discount_type": "percentage", "discount_value": 10 }] }`));
endpoints.push(genEndpoint(tags.Coupons, "POST", "/api/v1/coupons/", "Manage discount coupons for promotional pricing.", null, `{ "code": "string", "discount_type": "percentage", "discount_value": 10 }`, 201, `{ "id": "uuid", "code": "string" }`));
endpoints.push(genEndpoint(tags.Coupons, "GET", "/api/v1/coupons/{id}/", "Manage discount coupons for promotional pricing.", idParam, null, 200, `{ "id": "uuid", "code": "string" }`));
endpoints.push(genEndpoint(tags.Coupons, "PUT", "/api/v1/coupons/{id}/", "Manage discount coupons for promotional pricing.", idParam, `{ "code": "string", "discount_type": "percentage", "discount_value": 10 }`, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Coupons, "PATCH", "/api/v1/coupons/{id}/", "Manage discount coupons for promotional pricing.", idParam, `{ "code": "string" }`, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Coupons, "DELETE", "/api/v1/coupons/{id}/", "Manage discount coupons for promotional pricing.", idParam, null, 204, null));
endpoints.push(genEndpoint(tags.Coupons, "POST", "/api/v1/coupons/{id}/redeem/", "Redeem a coupon. Validates active status, expiry, and redemption limit.", idParam, `{ "code": "string" }`, 200, `{ "id": "uuid", "times_redeemed": 1 }`));

// CUSTOMERS
endpoints.push(genEndpoint(tags.Customers, "GET", "/api/v1/customers/", "Manage customers - billable end-users.", defaultListParams, null, 200, `{ "count": 123, "results": [{ "id": "uuid", "email": "user@example.com" }] }`));
endpoints.push(genEndpoint(tags.Customers, "POST", "/api/v1/customers/", "Manage customers - billable end-users.", null, `{ "email": "user@example.com", "name": "string" }`, 201, `{ "id": "uuid", "email": "user@example.com" }`));
endpoints.push(genEndpoint(tags.Customers, "GET", "/api/v1/customers/{id}/", "Manage customers - billable end-users.", idParam, null, 200, `{ "id": "uuid", "email": "user@example.com" }`));
endpoints.push(genEndpoint(tags.Customers, "PUT", "/api/v1/customers/{id}/", "Manage customers - billable end-users.", idParam, `{ "email": "user@example.com", "name": "string" }`, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Customers, "PATCH", "/api/v1/customers/{id}/", "Manage customers - billable end-users.", idParam, `{ "name": "string" }`, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Customers, "DELETE", "/api/v1/customers/{id}/", "Manage customers - billable end-users.", idParam, null, 204, null));
endpoints.push(genEndpoint(tags.Customers, "GET", "/api/v1/customers/{id}/payment-methods/", "List payment methods for a customer.", idParam, null, 200, `{ "count": 2, "results": [] }`));
endpoints.push(genEndpoint(tags.Customers, "POST", "/api/v1/customers/{id}/payment-methods/", "Attach a new payment method.", idParam, `{ "token": "tok_123" }`, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Customers, "DELETE", "/api/v1/customers/{id}/payment-methods/{payment_method_id}/", "Detach a payment method from a customer.", customerPaymentMethodsParams, null, 204, null));
endpoints.push(genEndpoint(tags.Customers, "POST", "/api/v1/customers/{id}/payment-methods/{payment_method_id}/set-default/", "Set a payment method as default.", customerPaymentMethodsParams, null, 200, `{ "id": "uuid" }`));

// DUNNING ATTEMPTS
endpoints.push(genEndpoint(tags.DunningAttempts, "GET", "/api/v1/dunning-attempts/", "View dunning retry attempts and their status.", defaultListParams, null, 200, `{ "count": 123, "results": [] }`));
endpoints.push(genEndpoint(tags.DunningAttempts, "GET", "/api/v1/dunning-attempts/{id}/", "View dunning retry attempts and their status.", idParam, null, 200, `{ "id": "uuid" }`));

// ENTITLEMENTS
endpoints.push(genEndpoint(tags.Entitlements, "GET", "/api/v1/entitlements/", "View feature entitlements granted to customers.", defaultListParams, null, 200, `{ "count": 123, "results": [] }`));
endpoints.push(genEndpoint(tags.Entitlements, "GET", "/api/v1/entitlements/{id}/", "View feature entitlements granted to customers.", idParam, null, 200, `{ "id": "uuid" }`));

// INVOICES
endpoints.push(genEndpoint(tags.Invoices, "GET", "/api/v1/invoices/", "Manage invoices - financial records.", defaultListParams, null, 200, `{ "count": 123, "results": [] }`));
endpoints.push(genEndpoint(tags.Invoices, "GET", "/api/v1/invoices/{id}/", "Manage invoices - financial records.", idParam, null, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Invoices, "POST", "/api/v1/invoices/{id}/pay/", "Manually trigger payment for an open invoice.", idParam, `{ "payment_method": "uuid" }`, 200, `{ "id": "uuid", "status": "paid" }`));
endpoints.push(genEndpoint(tags.Invoices, "POST", "/api/v1/invoices/{id}/void/", "Void an invoice.", idParam, null, 200, `{ "id": "uuid", "status": "void" }`));

// PAYMENTS
endpoints.push(genEndpoint(tags.Payments, "GET", "/api/v1/payments/", "View payment attempts and their outcomes.", defaultListParams, null, 200, `{ "count": 123, "results": [] }`));
endpoints.push(genEndpoint(tags.Payments, "GET", "/api/v1/payments/{id}/", "View payment attempts and their outcomes.", idParam, null, 200, `{ "id": "uuid" }`));

// PLANS
endpoints.push(genEndpoint(tags.Plans, "GET", "/api/v1/plans/", "Manage pricing plans. Define what you sell.", defaultListParams, null, 200, `{ "count": 123, "results": [] }`));
endpoints.push(genEndpoint(tags.Plans, "POST", "/api/v1/plans/", "Manage pricing plans. Define what you sell.", null, `{ "name": "Basic Plan", "amount": 1000, "interval": "monthly" }`, 201, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Plans, "GET", "/api/v1/plans/{id}/", "Manage pricing plans. Define what you sell.", idParam, null, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Plans, "PUT", "/api/v1/plans/{id}/", "Manage pricing plans. Define what you sell.", idParam, `{ "name": "Basic Plan", "amount": 1000 }`, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Plans, "PATCH", "/api/v1/plans/{id}/", "Manage pricing plans. Define what you sell.", idParam, `{ "name": "Basic Plan" }`, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Plans, "DELETE", "/api/v1/plans/{id}/", "Manage pricing plans. Define what you sell.", idParam, null, 204, null));

// SUBSCRIPTIONS
endpoints.push(genEndpoint(tags.Subscriptions, "GET", "/api/v1/subscriptions/", "Manage subscriptions - the contract between customer and plan.", defaultListParams, null, 200, `{ "count": 123, "results": [] }`));
endpoints.push(genEndpoint(tags.Subscriptions, "POST", "/api/v1/subscriptions/", "Manage subscriptions - the contract between customer and plan.", null, `{ "customer": "uuid", "plan": "uuid" }`, 201, `{ "id": "uuid", "status": "active" }`));
endpoints.push(genEndpoint(tags.Subscriptions, "GET", "/api/v1/subscriptions/{id}/", "Manage subscriptions - the contract between customer and plan.", idParam, null, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Subscriptions, "PUT", "/api/v1/subscriptions/{id}/", "Manage subscriptions - the contract between customer and plan.", idParam, `{ "plan": "uuid" }`, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Subscriptions, "PATCH", "/api/v1/subscriptions/{id}/", "Manage subscriptions - the contract between customer and plan.", idParam, `{ "metadata": "{}" }`, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Subscriptions, "DELETE", "/api/v1/subscriptions/{id}/", "Manage subscriptions - the contract between customer and plan.", idParam, null, 204, null));
endpoints.push(genEndpoint(tags.Subscriptions, "POST", "/api/v1/subscriptions/{id}/cancel/", "Cancel a subscription.", idParam, `{ "cancel_at_period_end": true }`, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Subscriptions, "POST", "/api/v1/subscriptions/{id}/change-plan/", "Change subscription plan with proration.", idParam, `{ "plan": "uuid", "proration_behavior": "create_prorations" }`, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Subscriptions, "POST", "/api/v1/subscriptions/{id}/reactivate/", "Reactivate a canceled or unpaid subscription.", idParam, null, 200, `{ "id": "uuid" }`));

// WEBHOOKS
endpoints.push(genEndpoint(tags.Webhooks, "GET", "/api/v1/webhooks/endpoints/", "Manage webhook endpoints for receiving event notifications.", defaultListParams, null, 200, `{ "count": 123, "results": [] }`));
endpoints.push(genEndpoint(tags.Webhooks, "POST", "/api/v1/webhooks/endpoints/", "Manage webhook endpoints for receiving event notifications.", null, `{ "url": "https://example.com/webhook", "description": "My Webhook" }`, 201, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Webhooks, "GET", "/api/v1/webhooks/endpoints/{id}/", "Manage webhook endpoints for receiving event notifications.", idParam, null, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Webhooks, "DELETE", "/api/v1/webhooks/endpoints/{id}/", "Manage webhook endpoints for receiving event notifications.", idParam, null, 204, null));
endpoints.push(genEndpoint(tags.Webhooks, "GET", "/api/v1/webhooks/events/", "View webhook event delivery history.", defaultListParams, null, 200, `{ "count": 123, "results": [] }`));
endpoints.push(genEndpoint(tags.Webhooks, "GET", "/api/v1/webhooks/events/{id}/", "View webhook event delivery history.", idParam, null, 200, `{ "id": "uuid" }`));
endpoints.push(genEndpoint(tags.Webhooks, "POST", "/api/v1/webhooks/events/{id}/retry/", "Retry delivery of a failed webhook event.", idParam, null, 200, `{ "id": "uuid" }`));

const fileContent = `export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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
${endpoints.join(',\n')}
];
`;

fs.writeFileSync('lib/api-docs-data.ts', fileContent);
console.log('Successfully wrote ' + endpoints.length + ' endpoints to lib/api-docs-data.ts');
