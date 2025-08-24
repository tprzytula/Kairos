variable "random_name" {
  description = "Random string to add to names for this environment."
  type        = string
}

variable "todo_notifications_topic_arn" {
  description = "ARN of the SNS topic for todo notifications"
  type        = string
}
