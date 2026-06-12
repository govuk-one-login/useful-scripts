export enum AccessLevel {
  read = "read",
  write = "write",
  admin = "admin",
}

export type AccountPermissionName =
  | "blocking"
  | "codespaces_user_secrets"
  | "copilot_messages"
  | "copilot_editor_context"
  | "copilot_requests"
  | "emails"
  | "user_events"
  | "followers"
  | "gpg_keys"
  | "gists"
  | "keys"
  | "interaction_limits"
  | "knowledge_bases"
  | "user_models"
  | "plan"
  | "private_repository_invitations"
  | "profile"
  | "git_signing_ssh_public_keys"
  | "starring"
  | "watching";

export type RepositoryPermissionName =
  | "actions"
  | "administration"
  | "artifact_metadata"
  | "attestations"
  | "code_quality"
  | "security_events"
  | "codespaces"
  | "codespaces_lifecycle_admin"
  | "codespaces_metadata"
  | "codespaces_secrets"
  | "statuses"
  | "contents"
  | "repository_custom_properties"
  | "vulnerability_alerts"
  | "dependabot_secrets"
  | "deployments"
  | "discussions"
  | "environments"
  | "issues"
  | "merge_queues"
  | "metadata"
  | "pages"
  | "pull_requests"
  | "repository_advisories"
  | "secret_scanning_alerts"
  | "secrets"
  | "actions_variables"
  | "repository_hooks"
  | "workflows";

export type OrganisationPermissionName =
  | "organization_api_insights"
  | "organization_administration"
  | "organization_user_blocking"
  | "organization_campaigns"
  | "organization_custom_org_roles"
  | "organization_custom_properties"
  | "organization_custom_roles"
  | "organization_events"
  | "organization_copilot_seat_management"
  | "issue_types"
  | "organization_knowledge_bases"
  | "members"
  | "organization_models"
  | "organization_network_configurations"
  | "organization_announcement_banners"
  | "organization_codespaces"
  | "organization_codespaces_secrets"
  | "organization_codespaces_settings"
  | "organization_dependabot_secrets"
  | "organization_code_scanning_dismissal_requests"
  | "organization_private_registries"
  | "organization_plan"
  | "organization_projects"
  | "organization_secrets"
  | "organization_self_hosted_runners"
  | "team_discussions"
  | "organization_actions_variables"
  | "organization_hooks";

export type PermissionName =
  | AccountPermissionName
  | RepositoryPermissionName
  | OrganisationPermissionName;

const validAccessLevels: Record<PermissionName, AccessLevel[]> = {
  // Account
  blocking: [AccessLevel.read, AccessLevel.write],
  codespaces_user_secrets: [AccessLevel.read, AccessLevel.write],
  copilot_messages: [AccessLevel.read],
  copilot_editor_context: [AccessLevel.read],
  copilot_requests: [AccessLevel.write],
  emails: [AccessLevel.read, AccessLevel.write],
  user_events: [AccessLevel.read],
  followers: [AccessLevel.read, AccessLevel.write],
  gpg_keys: [AccessLevel.read, AccessLevel.write],
  gists: [AccessLevel.write],
  keys: [AccessLevel.read, AccessLevel.write],
  interaction_limits: [AccessLevel.read, AccessLevel.write],
  knowledge_bases: [AccessLevel.read, AccessLevel.write],
  user_models: [AccessLevel.read],
  plan: [AccessLevel.read],
  private_repository_invitations: [AccessLevel.read],
  profile: [AccessLevel.write],
  git_signing_ssh_public_keys: [AccessLevel.read, AccessLevel.write],
  starring: [AccessLevel.read, AccessLevel.write],
  watching: [AccessLevel.read, AccessLevel.write],
  // Repository
  actions: [AccessLevel.read, AccessLevel.write],
  administration: [AccessLevel.read, AccessLevel.write],
  artifact_metadata: [AccessLevel.read, AccessLevel.write],
  attestations: [AccessLevel.read, AccessLevel.write],
  code_quality: [AccessLevel.read, AccessLevel.write],
  security_events: [AccessLevel.read, AccessLevel.write],
  codespaces: [AccessLevel.read, AccessLevel.write],
  codespaces_lifecycle_admin: [AccessLevel.read, AccessLevel.write],
  codespaces_metadata: [AccessLevel.read],
  codespaces_secrets: [AccessLevel.write],
  statuses: [AccessLevel.read, AccessLevel.write],
  contents: [AccessLevel.read, AccessLevel.write],
  repository_custom_properties: [AccessLevel.read, AccessLevel.write],
  vulnerability_alerts: [AccessLevel.read, AccessLevel.write],
  dependabot_secrets: [AccessLevel.read, AccessLevel.write],
  deployments: [AccessLevel.read, AccessLevel.write],
  discussions: [AccessLevel.read, AccessLevel.write],
  environments: [AccessLevel.read, AccessLevel.write],
  issues: [AccessLevel.read, AccessLevel.write],
  merge_queues: [AccessLevel.read, AccessLevel.write],
  metadata: [AccessLevel.read],
  pages: [AccessLevel.read, AccessLevel.write],
  pull_requests: [AccessLevel.read, AccessLevel.write],
  repository_advisories: [AccessLevel.read, AccessLevel.write],
  secret_scanning_alerts: [AccessLevel.read, AccessLevel.write],
  secrets: [AccessLevel.read, AccessLevel.write],
  actions_variables: [AccessLevel.read, AccessLevel.write],
  repository_hooks: [AccessLevel.read, AccessLevel.write],
  workflows: [AccessLevel.write],
  // Organisation
  organization_api_insights: [AccessLevel.read],
  organization_administration: [AccessLevel.read, AccessLevel.write],
  organization_user_blocking: [AccessLevel.read, AccessLevel.write],
  organization_campaigns: [AccessLevel.read, AccessLevel.write],
  organization_custom_org_roles: [AccessLevel.read, AccessLevel.write],
  organization_custom_properties: [
    AccessLevel.read,
    AccessLevel.write,
    AccessLevel.admin,
  ],
  organization_custom_roles: [AccessLevel.read, AccessLevel.write],
  organization_events: [AccessLevel.read],
  organization_copilot_seat_management: [AccessLevel.read, AccessLevel.write],
  issue_types: [AccessLevel.read, AccessLevel.write],
  organization_knowledge_bases: [AccessLevel.read, AccessLevel.write],
  members: [AccessLevel.read, AccessLevel.write],
  organization_models: [AccessLevel.read],
  organization_network_configurations: [AccessLevel.read, AccessLevel.write],
  organization_announcement_banners: [AccessLevel.read, AccessLevel.write],
  organization_codespaces: [AccessLevel.read, AccessLevel.write],
  organization_codespaces_secrets: [AccessLevel.read, AccessLevel.write],
  organization_codespaces_settings: [AccessLevel.read, AccessLevel.write],
  organization_dependabot_secrets: [AccessLevel.read, AccessLevel.write],
  organization_code_scanning_dismissal_requests: [
    AccessLevel.read,
    AccessLevel.write,
  ],
  organization_private_registries: [AccessLevel.read, AccessLevel.write],
  organization_plan: [AccessLevel.read],
  organization_projects: [
    AccessLevel.read,
    AccessLevel.write,
    AccessLevel.admin,
  ],
  organization_secrets: [AccessLevel.read, AccessLevel.write],
  organization_self_hosted_runners: [AccessLevel.read, AccessLevel.write],
  team_discussions: [AccessLevel.read, AccessLevel.write],
  organization_actions_variables: [AccessLevel.read, AccessLevel.write],
  organization_hooks: [AccessLevel.read, AccessLevel.write],
};

const isValidAccessLevel = (
  permission: PermissionName,
  level: AccessLevel,
): boolean => validAccessLevels[permission].includes(level);

const GITHUB_NEW_TOKEN_URL_BASE = `https://github.com/settings/personal-access-tokens/new`;

/**
 * Warning, this does not check if the permission + access level combination are valid
 */
export class TokenGenerator {
  #name: undefined | string;
  #description: undefined | string;
  #targetName: undefined | string;
  #expiresIn: undefined | number;
  #permissions: Partial<Record<PermissionName, AccessLevel>> = {};

  setName(value: string): TokenGenerator {
    this.#name = value;
    return this;
  }

  setDescription(value: string): TokenGenerator {
    this.#description = value;
    return this;
  }

  setTargetName(value: string): TokenGenerator {
    this.#targetName = value;
    return this;
  }

  setExpiresIn(value: number): TokenGenerator {
    this.#expiresIn = value;
    return this;
  }

  setPermissions(
    permission: PermissionName,
    level: AccessLevel,
  ): TokenGenerator {
    if (!isValidAccessLevel(permission, level)) {
      throw new Error(
        `Invalid access level requested for ${permission}, must be one of: ${validAccessLevels[permission].join(", ")}`,
      );
    }
    this.#permissions[permission] = level;
    return this;
  }

  toUrl(): string {
    const url = new URL(GITHUB_NEW_TOKEN_URL_BASE);

    if (this.#name !== undefined) {
      url.searchParams.set("name", this.#name);
    }
    if (this.#description !== undefined) {
      url.searchParams.set("description", this.#description);
    }
    if (this.#targetName !== undefined) {
      url.searchParams.set("target_name", this.#targetName);
    }
    if (this.#expiresIn !== undefined) {
      url.searchParams.set(
        "expires_in",
        this.#expiresIn > 0 ? `${this.#expiresIn}` : "none",
      );
    }

    Object.entries(this.#permissions).forEach(([name, level]) => {
      url.searchParams.set(name, level);
    });

    return url.toString();
  }
}
