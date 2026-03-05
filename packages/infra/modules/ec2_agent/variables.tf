variable "random_name" {
  description = "Random string to add to names for this environment."
  type        = string
}

variable "agent_secret" {
  description = "Shared secret for authenticating Lambda→EC2 requests"
  type        = string
  sensitive   = true
}

variable "ssh_allowed_cidr" {
  description = "CIDR block allowed to SSH into the agent EC2 instance"
  type        = string
  default     = "0.0.0.0/0"
}
