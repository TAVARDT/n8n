# n8n Workflow Automation Security

<div align="center">
  <p>Elite B2B Security & Infrastructure Configurations for n8n Self-Hosted Automation.</p>
  <p>
    <a href="#-english">🇺🇸 English</a> | 
    <a href="#-português">🇧🇷 Português</a>
  </p>
</div>

---

## 🇺🇸 English

### Enterprise Workflow Automation Infrastructure
This repository contains the official **TAVARDT Agency** hardening templates for self-hosted n8n deployments. n8n stores credentials for hundreds of external services (APIs, CRMs, payment gateways). A poorly secured n8n instance is one of the most dangerous data leak vectors in any B2B operation.

### Contents
- **`nginx-n8n-secure.conf`**: Nginx reverse proxy configuration with separate rate-limiting zones for the editor interface and public webhooks. Never expose n8n's port 5678 directly to the internet.
- **`docker-compose.n8n.yml`**: Production-grade Docker Compose stack using PostgreSQL (instead of the default fragile SQLite), strict resource limits to prevent runaway workflows, and all secrets managed through environment variables. n8n binds only to localhost.
- **`n8n-backup.sh`**: A cron-ready backup script that exports workflow definitions (JSON), encrypted credentials, and a full PostgreSQL dump. Enforces a 30-day retention policy automatically.

### Implementation Guide
1. Generate your encryption key before starting: `openssl rand -hex 32`. Store it securely — losing it means losing all stored credentials.
2. The `nginx-n8n-secure.conf` keeps port 5678 internal. Always access n8n through the Nginx proxy on port 443.

### Contact & Services
Looking for elite B2B infrastructure and high-ticket digital engineering?
- **Website:** [ag.tavardt.com](https://ag.tavardt.com/)
- **Email:** contact@tavardt.com

---

## 🇧🇷 Português

### Infraestrutura Corporativa de Automação de Fluxo de Trabalho
Este repositório contém os templates oficiais de "Hardening" (blindagem) da **TAVARDT** para instalações auto-hospedadas de n8n. O n8n armazena credenciais de centenas de serviços externos (APIs, CRMs, gateways de pagamento). Uma instância n8n mal protegida é um dos vetores de vazamento de dados mais perigosos em qualquer operação B2B.

### Conteúdo
- **`nginx-n8n-secure.conf`**: Configuração do proxy reverso Nginx com zonas de *Rate Limiting* separadas para a interface do editor e para os webhooks públicos. Nunca exponha a porta 5678 do n8n diretamente à internet.
- **`docker-compose.n8n.yml`**: Stack Docker Compose de nível produção usando PostgreSQL (em vez do SQLite padrão, frágil), limites rígidos de recursos para prevenir travamentos por workflows descontrolados, e todos os segredos gerenciados via variáveis de ambiente. O n8n é vinculado apenas ao *localhost*.
- **`n8n-backup.sh`**: Um script de backup pronto para Cron que exporta definições de workflows (JSON), credenciais criptografadas e um *dump* completo do PostgreSQL. Aplica automaticamente uma política de retenção de 30 dias.

### Guia de Implementação
1. Gere sua chave de criptografia antes de iniciar: `openssl rand -hex 32`. Armazene-a com segurança — perdê-la significa perder todas as credenciais armazenadas.
2. O `nginx-n8n-secure.conf` mantém a porta 5678 interna. Sempre acesse o n8n pelo proxy Nginx na porta 443.

### Contato & Serviços
Procurando por infraestrutura B2B de elite e engenharia digital high-ticket?
- **Site:** [ag.tavardt.com/br/](https://ag.tavardt.com/br/)
- **E-mail:** contato@tavardt.com
