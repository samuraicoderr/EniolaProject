export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "unpaid"
  | "canceled"
  | "incomplete"
  | "incomplete_expired";

export type InvoiceStatus =
  "draft" | "open" | "paid" | "void" | "uncollectible";
export type PaymentStatus = "pending" | "succeeded" | "failed";
export type DunningStatus = "pending" | "succeeded" | "failed" | "abandoned";
export type WebhookEventStatus = "pending" | "delivered" | "failed";
export type PlanInterval = "weekly" | "monthly" | "annual" | "custom";
export type PaymentMethodType = "card" | "bank_debit" | "mandate";
export type CouponDiscountType = "percentage" | "fixed";

export type BankCode = {
  code: string;
  name: string;
  logo?: string;
};

export type BankAccountLookupResult = {
  accountNumber: string;
  accountName: string;
};

export type Customer = {
  id: string;
  object: "customer";
  external_id: string;
  email: string;
  name: string;
  metadata: Record<string, unknown>;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Plan = {
  id: string;
  object: "plan";
  name: string;
  amount: number;
  currency: string;
  interval: PlanInterval;
  interval_count: number;
  trial_period_days: number;
  is_active: boolean;
  settlement_bank_id: string | null;
  metadata: Record<string, unknown>;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentMethod = {
  id: string;
  object: "payment_method";
  customer: string;
  type: PaymentMethodType;
  nomba_token: string;
  last4: string;
  expiry_month: string;
  expiry_year: string;
  is_default: boolean;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type SettlementBank = {
  id: string;
  object: "settlement_bank";
  name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  is_default: boolean;
  metadata: Record<string, unknown>;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  object: "subscription";
  customer: string;
  plan: string | null;
  status: SubscriptionStatus;
  amount: number | null;
  currency: string;
  interval: PlanInterval | null;
  interval_count: number | null;
  current_period_start: string;
  current_period_end: string;
  trial_start: string | null;
  trial_end: string | null;
  canceled_at: string | null;
  cancel_at_period_end: boolean;
  payment_method: string | null;
  checkout_url: string;
  checkout_reference: string;
  settlement_bank:
    | { settlement_bank_id: string }
    | { bank_code: string; account_number: string; account_name: string }
    | null;
  idempotency_key: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type Invoice = {
  id: string;
  object: "invoice";
  subscription: string;
  customer: string;
  amount_due: number;
  amount_paid: number;
  status: InvoiceStatus;
  due_date: string;
  paid_at: string | null;
  period_start: string;
  period_end: string;
  proration_amount: number;
  idempotency_key: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  object: "payment";
  invoice: string;
  payment_method: string;
  amount: number;
  status: PaymentStatus;
  nomba_reference: string;
  failure_code: string;
  failure_message: string;
  paid_at: string | null;
  idempotency_key: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type DunningAttempt = {
  id: string;
  object: "dunning_attempt";
  invoice: string;
  subscription: string;
  attempt_number: number;
  status: DunningStatus;
  scheduled_at: string;
  attempted_at: string | null;
  payment: string | null;
  next_attempt_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AuditLog = {
  id: string;
  object: "audit_log";
  /** The ID (UUID) of the user who performed the action. Null for system events. */
  actor: string | null;
  event_type: string;
  entity_type: string;
  entity_id: string;
  payload: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
};

export type WebhookEndpoint = {
  id: string;
  object: "webhook_endpoint";
  url: string;
  description: string;
  secret: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type WebhookEvent = {
  id: string;
  object: "webhook_event";
  event_type: string;
  payload: Record<string, unknown>;
  endpoint_url: string;
  status: WebhookEventStatus;
  attempt_count: number;
  last_attempted_at: string | null;
  next_retry_at: string | null;
  delivered_at: string | null;
  response_status_code: number | null;
  signature: string;
  created_at: string;
  updated_at: string;
};

export type Coupon = {
  id: string;
  object: "coupon";
  code: string;
  discount_type: CouponDiscountType;
  discount_value: number;
  max_redemptions: number | null;
  times_redeemed: number;
  valid_until: string | null;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type DashboardSummary = {
  active_subscriptions: number;
  trialing_subscriptions: number;
  past_due_subscriptions: number;
  unpaid_subscriptions: number;
  total_customers: number;
  active_plans: number;
  overdue_amount: number;
  recent_invoices: Invoice[];
  recent_payments: Payment[];
};

export type ListResponse<T> = T[] | { results: T[] };
