# Terraform - Short URL API

Infraestrutura AWS: EC2 (API Node.js/Docker) + RDS PostgreSQL. Configurada para Free Tier.

## Estrutura

```
terraform/
├── main.tf              # Toda a infraestrutura (VPC, EC2, RDS)
├── variables.tf         # Variáveis
├── outputs.tf           # Valores após o apply
├── user-data.sh         # Script que roda na EC2 ao iniciar
├── import.sh            # Cenário B: importa recursos da AWS (sem state)
├── import-state-mv.sh   # Cenário A: migra state modular → simplificado
└── terraform.tfvars.example
```

## Migrar recursos existentes

**Cenário A – State antigo ainda existe** (recursos criados com a estrutura de módulos):

```bash
./import-state-mv.sh
terraform plan
```

**Cenário B – Sem state** (recursos existem na AWS, mas você não tem o state):

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Preencha terraform.tfvars (api_use_elastic_ip=true se tiver Elastic IP)
export TF_VAR_api_jwt_secret=xxx TF_VAR_db_password=yyy
terraform init
./import.sh
terraform plan
```

## Uso

### 1. Configurar

```bash
cp terraform.tfvars.example terraform.tfvars
# Edite terraform.tfvars com seus valores
```

### 2. Variáveis sensíveis

```bash
export TF_VAR_api_jwt_secret="sua-chave-jwt"
export TF_VAR_db_password="sua-senha-db"
```

### 3. Executar

```bash
terraform init
terraform plan
terraform apply
```

### 4. Resultado

Após o apply, você verá `api_url` no output. A API estará acessível nessa URL.

## Erro P1000: credenciais do banco inválidas

Se a aplicação falhar com "Authentication failed... credentials for shorturl are not valid":

1. **Senha divergente** – O RDS pode ter sido criado com outra senha (ex.: migração/import). Ajuste `db_password` no terraform.tfvars para a senha real do RDS.
2. **Atualizar senha do RDS** – Mude `db_password` no terraform.tfvars e rode `terraform apply`. O RDS será atualizado. Em seguida, atualize o `.env` na EC2 e reinicie o container:
   ```bash
   ssh ec2-user@<IP_EC2>
   cd /home/ec2-user/app
   # Edite .env com a DATABASE_URL correta (nova senha)
   docker ps  # veja o ID do container
   docker restart <ID>
   ```
3. **Caracteres especiais** – Senhas com `@`, `#`, `:`, `/` precisam de URL encoding na connection string (o Terraform já aplica isso).
