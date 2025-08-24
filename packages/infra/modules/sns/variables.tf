variable "random_name" {
  description = "Random string to add to names for this environment."
  type        = string
}

variable "notification_lambda_arn" {
  description = "ARN of the notification lambda function"
  type        = string
}

variable "notification_lambda_function_name" {
  description = "Name of the notification lambda function"
  type        = string
}
