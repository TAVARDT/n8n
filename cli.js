#!/usr/bin/env node
// ----------------------------------------------------------------------
// TAVARDT Elite n8n Tools CLI
// ----------------------------------------------------------------------
// Usage: npx @tavardt/n8n-tools <command>
// Commands:
//   health-check  Check if n8n is responding on the configured URL
//   backup        Trigger a backup of the n8n Docker instance
// ----------------------------------------------------------------------

'use strict';

const { Command } = require('commander');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const program = new Command();

program
  .name('tavardt-n8n')
  .description('TAVARDT Elite CLI tools for managing self-hosted n8n instances')
  .version('1.0.0');

// ----------------------------------------
// Command: health-check
// ----------------------------------------
program
  .command('health-check')
  .description('Check if your n8n instance is healthy and responding')
  .option('-u, --url <url>', 'n8n base URL', process.env.N8N_HOST || 'http://localhost:5678')
  .action((options) => {
    const url = options.url;
    console.log(`[TAVARDT] Checking n8n health at: ${url}/healthz`);

    const client = url.startsWith('https') ? https : http;
    const req = client.get(`${url}/healthz`, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ n8n is HEALTHY (HTTP ${res.statusCode})`);
        process.exit(0);
      } else {
        console.error(`⚠️  n8n returned unexpected status: HTTP ${res.statusCode}`);
        process.exit(1);
      }
    });

    req.on('error', (err) => {
      console.error(`❌ n8n is UNREACHABLE: ${err.message}`);
      console.error('   Check if the Docker container is running: docker ps | grep n8n');
      process.exit(1);
    });

    req.setTimeout(5000, () => {
      console.error('❌ n8n health check TIMED OUT (>5s)');
      req.destroy();
      process.exit(1);
    });
  });

// ----------------------------------------
// Command: backup
// ----------------------------------------
program
  .command('backup')
  .description('Export n8n workflows and credentials from the running Docker container')
  .option('-c, --container <name>', 'Docker container name', 'n8n')
  .option('-o, --output <dir>', 'Output directory', './backups')
  .action((options) => {
    const { container, output } = options;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    console.log(`[TAVARDT] Starting n8n backup from container: ${container}`);

    try {
      execSync(`mkdir -p ${output}/${timestamp}`);

      // Export workflows
      console.log('  📋 Exporting workflows...');
      execSync(
        `docker exec ${container} n8n export:workflow --all --output=/home/node/.n8n/workflows_backup.json && ` +
        `docker cp ${container}:/home/node/.n8n/workflows_backup.json ${output}/${timestamp}/workflows.json`,
        { stdio: 'inherit' }
      );

      // Export credentials
      console.log('  🔐 Exporting encrypted credentials...');
      execSync(
        `docker exec ${container} n8n export:credentials --all --output=/home/node/.n8n/credentials_backup.json && ` +
        `docker cp ${container}:/home/node/.n8n/credentials_backup.json ${output}/${timestamp}/credentials.json`,
        { stdio: 'inherit' }
      );

      console.log(`✅ Backup complete: ${output}/${timestamp}/`);
    } catch (err) {
      console.error(`❌ Backup failed: ${err.message}`);
      console.error('   Ensure Docker is running and the container name is correct.');
      process.exit(1);
    }
  });

program.parse(process.argv);
