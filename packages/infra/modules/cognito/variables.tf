variable "random_name" {
  description = "Random name for resource naming"
  type        = string
}

# Google OAuth credentials
variable "google_client_id" {
  description = "Google OAuth client ID"
  type        = string
  default     = ""
}

variable "google_client_secret" {
  description = "Google OAuth client secret"
  type        = string
  default     = ""
  sensitive   = true
}
