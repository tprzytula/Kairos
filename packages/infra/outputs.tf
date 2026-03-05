output "agent_ec2_ip" {
  description = "Public IP of the agent EC2 instance"
  value       = var.enable_agent ? module.ec2_agent[0].public_ip : null
}
