variable "vapid_public_key" {
  description = "VAPID public key for push notifications"
  type        = string
}

variable "vapid_private_key" {
  description = "VAPID private key for push notifications"
  type        = string
  sensitive   = true
}