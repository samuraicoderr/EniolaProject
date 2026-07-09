import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService } from "@/lib/api/services/BillingService";
import type {
  Plan,
  Customer,
  Subscription,
  Invoice,
  Payment,
  WebhookEndpoint,
  DashboardSummary,
  DunningAttempt,
  SettlementBank,
  BankCode,
  BankAccountLookupResult,
} from "@/lib/api/types/billing.types";

/* ================================================================
   Query Keys
   ================================================================ */
const keys = {
  plans: (orgId: string) => ["plans", orgId] as const,
  customers: (orgId: string) => ["customers", orgId] as const,
  subscriptions: (orgId: string) => ["subscriptions", orgId] as const,
  invoices: (orgId: string) => ["invoices", orgId] as const,
  payments: (orgId: string) => ["payments", orgId] as const,
  webhooks: (orgId: string) => ["webhooks", orgId] as const,
  summary: (orgId: string) => ["summary", orgId] as const,
  dunning: (orgId: string) => ["dunning", orgId] as const,
  settlementBanks: (orgId: string) => ["settlement-banks", orgId] as const,
  bankCodes: (orgId: string) => ["bank-codes", orgId] as const,
};

/* ================================================================
   List Queries (deduped + cached + stale-while-revalidate)
   ================================================================ */
export function usePlans(organizationId: string | null | undefined) {
  return useQuery<Plan[]>({
    queryKey: keys.plans(organizationId || ""),
    queryFn: () => billingService.listPlans(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCustomers(organizationId: string | null | undefined) {
  return useQuery<Customer[]>({
    queryKey: keys.customers(organizationId || ""),
    queryFn: () => billingService.listCustomers(organizationId!),
    enabled: !!organizationId,
  });
}

export function useSubscriptions(organizationId: string | null | undefined) {
  return useQuery<Subscription[]>({
    queryKey: keys.subscriptions(organizationId || ""),
    queryFn: () => billingService.listSubscriptions(organizationId!),
    enabled: !!organizationId,
  });
}

export function useInvoices(organizationId: string | null | undefined) {
  return useQuery<Invoice[]>({
    queryKey: keys.invoices(organizationId || ""),
    queryFn: () => billingService.listInvoices(organizationId!),
    enabled: !!organizationId,
  });
}

export function usePayments(organizationId: string | null | undefined) {
  return useQuery<Payment[]>({
    queryKey: keys.payments(organizationId || ""),
    queryFn: () => billingService.listPayments(organizationId!),
    enabled: !!organizationId,
  });
}

export function useWebhookEndpoints(organizationId: string | null | undefined) {
  return useQuery<WebhookEndpoint[]>({
    queryKey: keys.webhooks(organizationId || ""),
    queryFn: () => billingService.listWebhookEndpoints(organizationId!),
    enabled: !!organizationId,
  });
}

export function useDashboardSummary(organizationId: string | null | undefined) {
  return useQuery<DashboardSummary>({
    queryKey: keys.summary(organizationId || ""),
    queryFn: () => billingService.summary(organizationId!),
    enabled: !!organizationId,
  });
}

export function useDunningAttempts(organizationId: string | null | undefined) {
  return useQuery<DunningAttempt[]>({
    queryKey: keys.dunning(organizationId || ""),
    queryFn: () => billingService.listDunningAttempts(organizationId!),
    enabled: !!organizationId,
  });
}

export function useSettlementBanks(organizationId: string | null | undefined) {
  return useQuery<SettlementBank[]>({
    queryKey: keys.settlementBanks(organizationId || ""),
    queryFn: () => billingService.listSettlementBanks(organizationId!),
    enabled: !!organizationId,
  });
}

export function useBankCodes(organizationId: string | null | undefined) {
  return useQuery<BankCode[]>({
    queryKey: keys.bankCodes(organizationId || ""),
    queryFn: () => billingService.listBankCodes(organizationId!),
    enabled: !!organizationId,
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useBankAccountLookup() {
  return useMutation<
    BankAccountLookupResult,
    Error,
    { accountNumber: string; bankCode: string; organizationId: string }
  >({
    mutationFn: (payload) => billingService.lookupBankAccount(payload),
  });
}

/* ================================================================
   Mutations (auto-invalidate related lists on success)
   ================================================================ */
export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { organizationId: string; payload: Partial<Plan> }) =>
      billingService.createPlan(args.organizationId, args.payload),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: keys.plans(vars.organizationId) }),
  });
}

export function useUpdatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      organizationId: string;
      id: string;
      payload: Partial<Plan>;
    }) => billingService.updatePlan(args.organizationId, args.id, args.payload),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: keys.plans(vars.organizationId) }),
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      organizationId: string;
      payload: Partial<Customer>;
    }) => billingService.createCustomer(args.organizationId, args.payload),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: keys.customers(vars.organizationId) }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      organizationId: string;
      id: string;
      payload: Partial<Customer>;
    }) =>
      billingService.updateCustomer(args.organizationId, args.id, args.payload),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: keys.customers(vars.organizationId) }),
  });
}

export function useCreateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      organizationId: string;
      payload: Partial<Subscription>;
    }) => billingService.createSubscription(args.organizationId, args.payload),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: keys.subscriptions(vars.organizationId),
      }),
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      organizationId: string;
      id: string;
      atPeriodEnd?: boolean;
    }) =>
      billingService.cancelSubscription(
        args.organizationId,
        args.id,
        args.atPeriodEnd,
      ),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: keys.subscriptions(vars.organizationId),
      }),
  });
}

export function useReactivateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      organizationId: string;
      id: string;
      paymentMethodId?: string;
    }) =>
      billingService.reactivateSubscription(
        args.organizationId,
        args.id,
        args.paymentMethodId,
      ),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: keys.subscriptions(vars.organizationId),
      }),
  });
}

export function useChangePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      organizationId: string;
      id: string;
      planId: string;
      prorationMode?: "immediate" | "next_cycle" | "none";
    }) =>
      billingService.changePlan(
        args.organizationId,
        args.id,
        args.planId,
        args.prorationMode,
      ),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: keys.subscriptions(vars.organizationId),
      }),
  });
}

export function useVoidInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { organizationId: string; id: string }) =>
      billingService.voidInvoice(args.organizationId, args.id),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: keys.invoices(vars.organizationId) }),
  });
}

export function useCreateWebhookEndpoint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      organizationId: string;
      payload: Partial<WebhookEndpoint>;
    }) =>
      billingService.createWebhookEndpoint(args.organizationId, args.payload),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: keys.webhooks(vars.organizationId) }),
  });
}

export function useDeleteWebhookEndpoint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { organizationId: string; id: string }) =>
      billingService.deleteWebhookEndpoint(args.organizationId, args.id),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: keys.webhooks(vars.organizationId) }),
  });
}

export function useCreateSettlementBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      organizationId: string;
      payload: Partial<SettlementBank>;
    }) =>
      billingService.createSettlementBank(args.organizationId, args.payload),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: keys.settlementBanks(vars.organizationId),
      }),
  });
}

export function useUpdateSettlementBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      organizationId: string;
      id: string;
      payload: Partial<SettlementBank>;
    }) =>
      billingService.updateSettlementBank(
        args.organizationId,
        args.id,
        args.payload,
      ),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: keys.settlementBanks(vars.organizationId),
      }),
  });
}

export function useDeleteSettlementBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { organizationId: string; id: string }) =>
      billingService.deleteSettlementBank(args.organizationId, args.id),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: keys.settlementBanks(vars.organizationId),
      }),
  });
}
