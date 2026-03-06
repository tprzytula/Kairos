output "agent_ec2_ip" {
  description = "Public IP of the agent EC2 instance"
  value       = var.enable_agent ? module.ec2_agent[0].public_ip : null
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain name — set this as the 'cloudfront_domain' workspace variable to enable recipe image uploads"
  value       = module.s3.cloudfront_domain
}
