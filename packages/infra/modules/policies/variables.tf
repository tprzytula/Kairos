variable "random_name" {
  description = "Random string to add to names for this environment."
  type        = string
}

variable "dynamodb_grocery_list_arn" {
  type = string
}

variable "lambda_functions" {
  type = map(object({
    function_name = string
    invoke_arn    = string
    iam_role_name = string
    permissions = object({
      database = object({
        grocery_list           = optional(string, "none")
        grocery_items_defaults = optional(string, "none")
        noise_tracking         = optional(string, "none")
        todo_list              = optional(string, "none")
      })
    })
  }))
}

variable "s3_kairos_web_arn" {
  type = string
}

variable "s3_kairos_lambdas_arn" {
  type = string
}

variable "dynamodb_noise_tracking_arn" {
  type = string
}

variable "dynamodb_grocery_items_defaults_arn" {
  type = string
}

variable "dynamodb_todo_list_arn" {
  type = string
}
