output "api_url" {
  description = "URL da API"
  value       = "http://${var.api_use_elastic_ip ? aws_eip.api[0].public_ip : aws_instance.api.public_ip}:${var.api_port}"
}

output "api_public_ip" {
  value = var.api_use_elastic_ip ? aws_eip.api[0].public_ip : aws_instance.api.public_ip
}

output "rds_endpoint" {
  value     = aws_db_instance.main.endpoint
  sensitive = true
}
