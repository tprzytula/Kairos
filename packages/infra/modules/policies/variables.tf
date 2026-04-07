variable "random_name" {
  description = "Random string to add to names for this environment."
  type        = string
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
        migrations             = optional(string, "none")
        projects               = optional(string, "none")
        project_members        = optional(string, "none")
        user_preferences       = optional(string, "none")
        push_subscriptions     = optional(string, "none")
        shops                  = optional(string, "none")
        recipes                = optional(string, "none")
        birthdays              = optional(string, "none")
        meal_plans             = optional(string, "none")
        office_attendance      = optional(string, "none")
        adventures             = optional(string, "none")
      })
      cognito = optional(object({
        admin_get_user = optional(string, "none")
      }), { admin_get_user = "none" })
      sns = object({
        todo_notifications = optional(string, "none")
      })
      s3 = optional(object({
        recipe_uploads          = optional(string, "none")
        shop_uploads            = optional(string, "none")
        grocery_default_uploads = optional(string, "none")
        adventure_uploads       = optional(string, "none")
      }), { recipe_uploads = "none", shop_uploads = "none", grocery_default_uploads = "none", adventure_uploads = "none" })
    })
  }))
}

variable "dynamodb_table_arns" {
  description = "Map of DynamoDB table names to their ARNs"
  type        = map(string)
}

variable "s3_kairos_web_arn" {
  type = string
}

variable "s3_kairos_lambdas_arn" {
  type = string
}

variable "sns_todo_notifications_arn" {
  type = string
}

variable "cognito_user_pool_arn" {
  description = "ARN of the Cognito User Pool for AdminGetUser permissions"
  type        = string
  default     = ""
}
