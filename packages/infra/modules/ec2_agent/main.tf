data "aws_ami" "amazon_linux_2023_arm" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-arm64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_security_group" "agent" {
  name        = format("kairos-agent-%s", var.random_name)
  description = "Security group for Kairos agent EC2 instance"

  # Agent service port — token-protected
  ingress {
    description = "Agent service"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH access — restricted
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_allowed_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = format("kairos-agent-%s", var.random_name)
  }
}

resource "aws_instance" "agent" {
  ami                    = data.aws_ami.amazon_linux_2023_arm.id
  instance_type          = "t4g.micro"
  vpc_security_group_ids = [aws_security_group.agent.id]

  user_data = <<-EOF
    #!/bin/bash
    set -e

    # Install Node.js 20
    dnf install -y nodejs20

    # Install Claude Code CLI
    npm install -g @anthropic-ai/claude-code

    # Create service directory
    mkdir -p /home/ec2-user/agent-service
    chown ec2-user:ec2-user /home/ec2-user/agent-service
  EOF

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = {
    Name = format("kairos-agent-%s", var.random_name)
  }
}

resource "aws_eip" "agent" {
  instance = aws_instance.agent.id

  tags = {
    Name = format("kairos-agent-%s", var.random_name)
  }
}
