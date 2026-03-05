output "public_ip" {
  description = "Public IP of the agent EC2 instance"
  value       = aws_eip.agent.public_ip
}

output "instance_id" {
  description = "Instance ID of the agent EC2 instance"
  value       = aws_instance.agent.id
}
