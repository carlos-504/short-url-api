# =============================================================================
# Short URL API - Infraestrutura AWS (EC2 + RDS PostgreSQL)
# =============================================================================
# Tudo em um arquivo para facilitar o entendimento.
# Para usar: copie terraform.tfvars.example para terraform.tfvars e preencha.
# =============================================================================

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws  = { source = "hashicorp/aws", version = "~> 5.0" }
    time = { source = "hashicorp/time", version = "~> 0.9" }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags { tags = var.global_tags }
}

# --- AMI Amazon Linux 2023 (usada se api_ami_id estiver vazio) ---
data "aws_ami" "amazon_linux" {
  count  = var.api_ami_id == "" ? 1 : 0
  owners      = ["amazon"]
  most_recent = true

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "state"
    values = ["available"]
  }
}

locals {
  prefix = "${var.project_name}-${var.environment}"
  ami    = var.api_ami_id != "" ? var.api_ami_id : data.aws_ami.amazon_linux[0].id
}

# --- Chave SSH (importa sua chave pública para a AWS) ---
resource "aws_key_pair" "api" {
  key_name_prefix = "${local.prefix}-"
  public_key      = file(pathexpand(var.api_ssh_public_key_path))
}

# --- Rede: VPC, Subnets, Internet Gateway ---
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = { Name = "${local.prefix}-vpc" }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${local.prefix}-igw" }
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true
  tags = { Name = "${local.prefix}-public-${count.index + 1}" }
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]
  tags = { Name = "${local.prefix}-private-${count.index + 1}" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = { Name = "${local.prefix}-public-rt" }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${local.prefix}-private-rt" }
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# --- Security Group da API (EC2) ---
resource "aws_security_group" "api" {
  name        = "${local.prefix}-api-sg"
  description = "Security group para a API EC2 - HTTP, HTTPS, SSH"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = var.api_port
    to_port     = var.api_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.ssh_allowed_cidrs
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${local.prefix}-api-sg" }
}

# --- RDS: Subnet Group, Security Group, Instância PostgreSQL ---
resource "aws_db_subnet_group" "main" {
  name       = "${local.prefix}-db-subnet"
  subnet_ids = aws_subnet.private[*].id
  tags       = { Name = "${local.prefix}-db-subnet" }
}

resource "aws_security_group" "rds" {
  name        = "${local.prefix}-rds-sg"
  description = "Security group para RDS - acesso somente da API"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.api.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${local.prefix}-rds-sg"
  }
}

# Delay na destruição: aguarda RDS liberar ENIs antes de excluir o SG (evita AuthFailure)
resource "time_sleep" "rds_cleanup" {
  create_duration  = "0s"
  destroy_duration = "120s"
  depends_on       = [aws_db_instance.main]
}

resource "aws_db_instance" "main" {
  identifier     = "${local.prefix}-postgres"
  engine         = "postgres"
  engine_version = var.db_engine_version
  instance_class = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  storage_type   = "gp3"
  storage_encrypted = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  multi_az               = false

  backup_retention_period = 1
  skip_final_snapshot     = true
  tags = { Name = "${local.prefix}-rds" }
}

# --- EC2: Instância da API ---
resource "aws_eip" "api" {
  count  = var.api_use_elastic_ip ? 1 : 0
  domain = "vpc"
  tags   = { Name = "${local.prefix}-api-eip" }
}

resource "aws_eip_association" "api" {
  count         = var.api_use_elastic_ip ? 1 : 0
  instance_id   = aws_instance.api.id
  allocation_id = aws_eip.api[0].id
}

resource "aws_instance" "api" {
  ami                    = local.ami
  instance_type          = var.api_instance_type
  key_name               = aws_key_pair.api.key_name
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.api.id]

  user_data = base64encode(templatefile("${path.module}/user-data.sh", {
    github_repo   = var.api_github_repo
    github_branch = var.api_github_branch
    database_url  = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.endpoint}/${var.db_name}?sslmode=require&uselibpqcompat=true"
    jwt_secret    = var.api_jwt_secret
    api_port      = var.api_port
  }))
  user_data_replace_on_change = false

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    delete_on_termination = true
  }
  tags = { Name = "${local.prefix}-api" }
  depends_on = [aws_db_instance.main]
}
