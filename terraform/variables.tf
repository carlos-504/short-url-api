# Variáveis - valores em terraform.tfvars
# Sensíveis: use TF_VAR_nome ou -var "nome=valor"

variable "aws_region" {
  description = "Região AWS"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "short-url-api"
}

variable "global_tags" {
  description = "Tags em todos os recursos"
  type        = map(string)
  default     = {}
}

# Rede
variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "ssh_allowed_cidrs" {
  description = "IPs permitidos para SSH"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# API (EC2)
variable "api_instance_type" {
  type    = string
  default = "t3.micro"
}

variable "api_ami_id" {
  description = "Vazio = Amazon Linux 2023"
  type        = string
  default     = ""
}

variable "api_port" {
  type    = number
  default = 3000
}

variable "api_ssh_public_key_path" {
  description = "Caminho da chave pública SSH (ex: ~/.ssh/id_ed25519.pub)"
  type        = string
}

variable "api_use_elastic_ip" {
  type    = bool
  default = false
}

variable "api_github_repo" {
  description = "URL do repositório Git"
  type        = string
}

variable "api_github_branch" {
  type    = string
  default = "main"
}

variable "api_jwt_secret" {
  type      = string
  sensitive = true
}

# Banco RDS
variable "db_instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "db_allocated_storage" {
  type    = number
  default = 20
}

variable "db_name" {
  type    = string
  default = "short_url_db"
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "db_engine_version" {
  type    = string
  default = "16"
}
