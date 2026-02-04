#!/bin/bash
# Roda na primeira inicialização da EC2: instala Docker, clona o repo e sobe a API
set -e

yum update -y
yum install -y docker git
systemctl start docker && systemctl enable docker
usermod -aG docker ec2-user

curl -sL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

APP_DIR="/home/ec2-user/app"
mkdir -p "$APP_DIR" && cd "$APP_DIR"
git clone --branch "${github_branch}" "${github_repo}" .

cat > .env << EOF
DATABASE_URL=${database_url}
JWT_SECRET=${jwt_secret}
NODE_ENV=production
EOF

docker build -f Dockerfile.prod -t short-url-api .
docker run -d --restart unless-stopped -p ${api_port}:3000 --env-file .env short-url-api
