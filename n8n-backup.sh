#!/bin/bash
# ----------------------------------------------------------------------
# TAVARDT Elite n8n Automated Backup Script
# ----------------------------------------------------------------------
# Description: Backs up n8n workflow definitions (JSON) and the
# PostgreSQL database. Run this via cron before every n8n update.
#
# Instructions:
# 1. chmod +x n8n-backup.sh
# 2. Add to crontab: 0 3 * * * /path/to/n8n-backup.sh >/dev/null 2>&1
#    (Runs at 3 AM every day)
# ----------------------------------------------------------------------

# Configuration
BACKUP_DIR="/var/backups/n8n"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
N8N_CONTAINER="n8n"        # Docker container name
POSTGRES_CONTAINER="postgres"
POSTGRES_USER="n8n_user"
POSTGRES_DB="n8n_db"
RETENTION_DAYS=30           # Keep backups for 30 days

echo "[TAVARDT] Starting n8n Backup: $DATE"

# Create backup directory
mkdir -p $BACKUP_DIR/$DATE

# 1. Export n8n Workflows (JSON format)
# This captures all workflow definitions without credentials (safe to store)
echo "Exporting n8n Workflows..."
docker exec $N8N_CONTAINER n8n export:workflow --all \
  --output=/home/node/.n8n/workflows_backup.json

docker cp $N8N_CONTAINER:/home/node/.n8n/workflows_backup.json \
  $BACKUP_DIR/$DATE/workflows.json

# 2. Export n8n Credentials (Encrypted JSON)
# Note: These are encrypted with N8N_ENCRYPTION_KEY. 
# Store this backup off-server (e.g., S3, Google Cloud Storage).
echo "Exporting n8n Credentials (Encrypted)..."
docker exec $N8N_CONTAINER n8n export:credentials --all \
  --output=/home/node/.n8n/credentials_backup.json

docker cp $N8N_CONTAINER:/home/node/.n8n/credentials_backup.json \
  $BACKUP_DIR/$DATE/credentials.json

# 3. PostgreSQL Database Dump
echo "Dumping PostgreSQL Database..."
docker exec $POSTGRES_CONTAINER pg_dump \
  -U $POSTGRES_USER $POSTGRES_DB \
  > $BACKUP_DIR/$DATE/database.sql

# Compress the entire backup
tar -czf $BACKUP_DIR/n8n_backup_$DATE.tar.gz -C $BACKUP_DIR $DATE
rm -rf $BACKUP_DIR/$DATE

# 4. Prune old backups
echo "Pruning backups older than $RETENTION_DAYS days..."
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "[TAVARDT] n8n Backup Complete: $BACKUP_DIR/n8n_backup_$DATE.tar.gz"
