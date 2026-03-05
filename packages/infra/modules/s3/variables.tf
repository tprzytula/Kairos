variable "random_name" {
  description = "Random string to add to names for this environment."
  type        = string
}

variable "stream_agent_message_url" {
  description = "Lambda Function URL for the stream_agent_message function."
  type        = string
}
