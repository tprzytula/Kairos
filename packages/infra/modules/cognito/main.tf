resource "aws_cognito_user_pool" "kairos_user_pool" {
  name = "${var.random_name}-user-pool"

  # User attributes
  schema {
    attribute_data_type = "String"
    name               = "email"
    required           = true
    mutable            = true

    string_attribute_constraints {
      min_length = 1
      max_length = 320
    }
  }

  schema {
    attribute_data_type = "String"
    name               = "given_name"
    required           = false
    mutable            = true

    string_attribute_constraints {
      min_length = 1
      max_length = 50
    }
  }

  schema {
    attribute_data_type = "String"
    name               = "family_name"
    required           = false
    mutable            = true

    string_attribute_constraints {
      min_length = 1
      max_length = 50
    }
  }

  schema {
    attribute_data_type = "String"
    name               = "picture"
    required           = false
    mutable            = true

    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  # Email configuration
  auto_verified_attributes = ["email"]
  
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  # User pool policies
  password_policy {
    minimum_length    = 8
    require_lowercase = false
    require_numbers   = false
    require_symbols   = false
    require_uppercase = false
  }

  # Account recovery
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  tags = {
    Environment = "production"
    Project     = "Kairos"
  }
}

resource "aws_cognito_user_pool_client" "kairos_user_pool_client" {
  name         = "${var.random_name}-user-pool-client"
  user_pool_id = aws_cognito_user_pool.kairos_user_pool.id

  # OAuth configuration for social logins
  supported_identity_providers         = var.google_client_id != "" && var.google_client_secret != "" ? ["Google"] : ["COGNITO"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  
  # Callback URLs for your CloudFront hosted app and localhost development
  callback_urls = [
    "https://d1568c842iynon.cloudfront.net/auth/callback",
    "http://localhost:1234/auth/callback",
    "http://127.0.0.1:1234/auth/callback"
  ]
  logout_urls = [
    "https://d1568c842iynon.cloudfront.net/logout",
    "http://localhost:1234",
    "http://127.0.0.1:1234"
  ]

  # Token configuration
  access_token_validity  = 24   # 24 hours
  id_token_validity      = 24   # 24 hours
  refresh_token_validity = 30   # 30 days

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  # Prevent user existence errors
  prevent_user_existence_errors = "ENABLED"

  # Read and write attributes
  read_attributes  = ["email", "given_name", "family_name", "picture"]
  write_attributes = ["email", "given_name", "family_name", "picture"]
}

# Google Identity Provider (only created when credentials are provided)
resource "aws_cognito_identity_provider" "google" {
  count = var.google_client_id != "" && var.google_client_secret != "" ? 1 : 0

  user_pool_id  = aws_cognito_user_pool.kairos_user_pool.id
  provider_name = "Google"
  provider_type = "Google"

  # These will need to be set with actual Google OAuth credentials
  provider_details = {
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
    authorize_scopes = "email profile openid"
  }

  # Attribute mapping from Google to Cognito
  attribute_mapping = {
    email       = "email"
    given_name  = "given_name"
    family_name = "family_name"
    username    = "sub"
    picture     = "picture"
  }
}



# User Pool Domain for hosted UI (optional but useful for testing)
resource "aws_cognito_user_pool_domain" "kairos_domain" {
  domain       = "${var.random_name}-kairos"
  user_pool_id = aws_cognito_user_pool.kairos_user_pool.id
}
