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

  # SSH access — restricted (omitted entirely if no CIDRs provided)
  dynamic "ingress" {
    for_each = length(var.ssh_allowed_cidrs) > 0 ? [1] : []
    content {
      description = "SSH"
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = var.ssh_allowed_cidrs
    }
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

resource "aws_iam_role" "agent" {
  name = format("kairos-agent-%s", var.random_name)

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })

  tags = {
    Name = format("kairos-agent-%s", var.random_name)
  }
}

resource "aws_iam_role_policy_attachment" "agent_ssm" {
  role       = aws_iam_role.agent.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}


resource "aws_iam_instance_profile" "agent" {
  name = format("kairos-agent-%s", var.random_name)
  role = aws_iam_role.agent.name
}

resource "aws_instance" "agent" {
  ami                    = data.aws_ami.amazon_linux_2023_arm.id
  instance_type          = "t4g.micro"
  vpc_security_group_ids = [aws_security_group.agent.id]
  iam_instance_profile   = aws_iam_instance_profile.agent.name

  user_data = templatefile("${path.module}/user_data.sh.tpl", {
    agent_secret = var.agent_secret
  })

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
