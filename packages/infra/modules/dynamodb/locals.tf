locals {
  # ─── Table Definitions ───────────────────────────────────────────────
  #
  # Adding a new standard table (hash=id, one GSI on projectId):
  #   wishlists = {}
  #
  # Override any default by specifying the key:
  #   hash_key, range_key, billing_mode, gsis, tags
  #
  tables = {
    # Standard tables: hash=id, one GSI on projectId
    adventures = {}
    birthdays  = {}
    meal_plans = {}
    recipes    = {}
    shops      = {}

    # Standard tables with non-default GSI names
    todo_list = {
      gsis = [{ name = "ProjectTodosIndex", hash_key = "projectId" }]
    }

    # No-GSI tables
    grocery_items_defaults = { hash_key = "name", gsis = [] }
    user_preferences       = { hash_key = "userId", gsis = [] }
    migrations             = { gsis = [] }

    # Composite key tables
    noise_tracking = {
      hash_key  = "projectId"
      range_key = { name = "timestamp", type = "N" }
      gsis      = [{ name = "ProjectNoiseIndex", hash_key = "projectId" }]
    }

    # Multi-GSI tables
    grocery_list = {
      gsis = [
        { name = "NameUnitIndex", hash_key = "name", range_key = "unit" },
        { name = "ProjectItemsIndex", hash_key = "projectId" },
      ]
    }

    projects = {
      gsis = [
        { name = "OwnerIndex", hash_key = "ownerId" },
        { name = "InviteCodeIndex", hash_key = "inviteCode" },
      ]
    }

    project_members = {
      hash_key  = "projectId"
      range_key = { name = "userId", type = "S" }
      gsis = [
        { name = "UserProjectsIndex", hash_key = "userId", range_key = "projectId" },
        { name = "ProjectMembersIndex", hash_key = "projectId", range_key = "userId" },
      ]
    }

    push_subscriptions = {
      hash_key     = "userId"
      range_key    = { name = "endpoint", type = "S" }
      billing_mode = "PAY_PER_REQUEST"
      gsis         = [{ name = "UserPushSubscriptionsIndex", hash_key = "userId" }]
      tags         = { Name = format("kairos-push-subscriptions-%s", var.random_name) }
    }
  }

  # ─── Computed Configs ────────────────────────────────────────────────

  table_configs = {
    for name, overrides in local.tables : name => {
      table_name   = replace(title(replace(name, "_", " ")), " ", "")
      hash_key     = lookup(overrides, "hash_key", "id")
      range_key    = lookup(overrides, "range_key", null)
      billing_mode = lookup(overrides, "billing_mode", "PROVISIONED")
      tags         = lookup(overrides, "tags", {})

      gsis = lookup(overrides, "gsis", null) != null ? [
        for gsi in lookup(overrides, "gsis", []) : {
          name      = gsi.name
          hash_key  = gsi.hash_key
          range_key = lookup(gsi, "range_key", null)
        }
        ] : [
        {
          name      = "Project${replace(title(replace(name, "_", " ")), " ", "")}Index"
          hash_key  = "projectId"
          range_key = null
        }
      ]
    }
  }

  # Pre-compute the set of all attributes needed per table (keys + GSI keys)
  table_attributes = {
    for name, config in local.table_configs : name => {
      for attr_name, attr_type in merge(
        # Hash key
        { (config.hash_key) = "S" },
        # Range key
        config.range_key != null ? { (config.range_key.name) = config.range_key.type } : {},
        # GSI hash keys
        { for gsi in config.gsis : (gsi.hash_key) => "S" },
        # GSI range keys
        { for gsi in config.gsis : (gsi.range_key) => "S" if gsi.range_key != null },
      ) : attr_name => attr_type
    }
  }
}
