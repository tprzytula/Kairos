variable "random_name" {
  description = "Random string to add to names for this environment."
  type        = string
}

variable "todo_notifications_topic_arn" {
  description = "ARN of the SNS topic for todo notifications"
  type        = string
}

variable "vapid_public_key" {
  description = "VAPID public key for push notifications"
  type        = string
}

variable "vapid_private_key" {
  description = "VAPID private key for push notifications"
  type        = string
  sensitive   = true
}

variable "agent_ec2_ip" {
  description = "Public IP of the agent EC2 instance"
  type        = string
  default     = ""
}

variable "agent_secret" {
  description = "Shared secret for authenticating Lambda to EC2 agent requests"
  type        = string
  default     = ""
  sensitive   = true
}

variable "s3_kairos_web_bucket_name" {
  description = "Name of the S3 bucket for web assets (used for recipe image uploads)"
  type        = string
  default     = ""
}

variable "s3_cloudfront_domain" {
  description = "CloudFront domain for serving uploaded recipe images"
  type        = string
  default     = ""
}
