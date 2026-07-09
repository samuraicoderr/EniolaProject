export type OrganizationRoleType =
  "owner" | "admin" | "developer" | "billing_manager" | "viewer";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  allowed_ips: string[];
  webhook_secret: string;
  settlement_settings: {
    allow_settlement_bank_api_creation: boolean;
    allow_non_admin_settlement_bank_creation: boolean;
  };
  settings: Record<string, unknown>;
  retry_settings: Record<string, unknown>;
  member_count: number;
  created_at: string;
  updated_at: string;
};

export type OrganizationMembership = {
  id: string;
  organization: string;
  user: string | null;
  user_email: string;
  user_name: string;
  role: OrganizationRoleType;
  created_at: string;
};

export type OrganizationInvitation = {
  id: string;
  organization: string;
  invitee_email: string;
  role: OrganizationRoleType;
  status: "pending" | "accepted" | "declined" | "revoked" | "expired";
  expires_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  invited_by: string | null;
  invited_by_email: string;
  accepted_by: string | null;
  accepted_by_email: string | null;
  created_at: string;
  updated_at: string;
};

export type OrganizationInvitationCreatePayload = {
  organization: string;
  invitee_email: string;
  role: OrganizationRoleType;
  expires_in_days?: number;
};

export type OrganizationAPIKey = {
  id: string;
  organization: string;
  name: string;
  environment: "live" | "sandbox";
  key_prefix: string;
  last4: string;
  is_active: boolean;
  revoked_at: string | null;
  raw_key?: string;
  created_at: string;
};

export type CreateOrganizationInvitationPayload =
  OrganizationInvitationCreatePayload;

export type UpdateOrganizationPayload = Partial<{
  name: string;
  slug: string;
  is_active: boolean;
  settings: Record<string, unknown>;
  settlement_settings: Organization["settlement_settings"];
}>;
