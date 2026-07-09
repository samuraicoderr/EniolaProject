import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "@/lib/api/services/OrganizationService";
import type {
  OrganizationAPIKey,
  OrganizationInvitation,
  OrganizationRoleType,
} from "@/lib/api/types/organizations.types";

const keys = {
  apiKeys: ["api-keys"] as const,
  security: ["organization-security"] as const,
  invitations: (orgId: string) => ["invitations", orgId] as const,
};

export function useApiKeys(enabled = true) {
  return useQuery<OrganizationAPIKey[]>({
    queryKey: keys.apiKeys,
    queryFn: () => organizationService.listApiKeys(),
    enabled,
  });
}

export function useMyInvitations(enabled = true) {
  return useQuery<OrganizationInvitation[]>({
    queryKey: ["my-invitations"],
    queryFn: () => organizationService.myInvitations(),
    enabled,
  });
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; slug?: string }) =>
      organizationService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-invitations"] });
    },
  });
}

export function useAcceptMyInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      organizationService.acceptMyInvitation(invitationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-invitations"] });
    },
  });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      organization: string;
      name: string;
      environment: "live" | "sandbox";
    }) => organizationService.createApiKey(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.apiKeys }),
  });
}

export function useUpdateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; name: string }) =>
      organizationService.updateApiKey(args.id, { name: args.name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.apiKeys }),
  });
}

export function useDeleteApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => organizationService.deleteApiKey(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.apiKeys }),
  });
}

export function useRotateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => organizationService.rotateApiKey(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.apiKeys }),
  });
}

/* ================================================================
   Invitations
   ================================================================ */
export function useOrganizationInvitations(
  organizationId: string | null | undefined,
) {
  return useQuery<OrganizationInvitation[]>({
    queryKey: keys.invitations(organizationId || ""),
    queryFn: () => organizationService.invitations(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateOrganizationInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      organization: string;
      invitee_email: string;
      role: OrganizationRoleType;
    }) => organizationService.createInvitation(payload),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: keys.invitations(vars.organization) }),
  });
}

export function useRevokeOrganizationInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; organizationId: string }) =>
      organizationService.revokeInvitation(args.id),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: keys.invitations(vars.organizationId) }),
  });
}

export function useResendOrganizationInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; organizationId: string }) =>
      organizationService.resendInvitation(args.id),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: keys.invitations(vars.organizationId) }),
  });
}
