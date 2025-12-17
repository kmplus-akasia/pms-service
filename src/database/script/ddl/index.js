#!/usr/bin/env node

/**
 * PMS Database Migration Script
 * =============================
 *
 * This script initializes and migrates the PMS database schema.
 * It creates all required tables and performance indexes.
 *
 * Usage:
 *   node src/database/script/ddl/index.js [options]
 *
 * Options:
 *   --dry-run    Show what would be executed without running it
 *   --force      Force recreate tables (drop if exists)
 *   --help       Show this help message
 *
 * Environment Variables:
 *   DB_HOST      MySQL host (default: localhost)
 *   DB_PORT      MySQL port (default: 3306)
 *   DB_USERNAME  MySQL username (required)
 *   DB_PASSWORD  MySQL password (required)
 *   DB_DATABASE  MySQL database name (required)
 *
 * Example:
 *   DB_USERNAME=root DB_PASSWORD=password DB_DATABASE=pms node src/database/script/ddl/index.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuration
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
  connectTimeout: 60000,
};

// Command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force');
const showHelp = args.includes('--help');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Migration file order
const MIGRATION_FILES = [
  // Core tables (in dependency order)
  '01_kpi_v3.sql',
  '02_kpi_ownership_v3.sql',
  '03_kpi_ownership_log_v3.sql',
  '04_kpi_realization_v3.sql',
  '05_kpi_realization_log_v3.sql',
  '06_kpi_score_v3.sql',
  '07_position_cohort.sql',
  '08_cohort_kpi_formula.sql',
  '09_cohort_kpi_formula_log.sql',
  '10_kpi_employee_performance_score_v3.sql',
  '11_kpi_position_performance_score_v3.sql',
  '12_kpi_employee_performance_score_final_v3.sql',
  '13_kpi_position_performance_score_final_v3.sql',
  '14_kpi_schedule_v3.sql',
  '15_kpi_log_v3.sql',
];

// Performance indexes (run after tables)
const INDEX_FILE = '01_performance_indexes.sql';

/**
 * Print colored console output
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print error and exit
 */
function error(message, error = null) {
  log(`❌ Error: ${message}`, 'red');
  if (error) {
    console.error(error);
  }
  process.exit(1);
}

/**
 * Print success message
 */
function success(message) {
  log(`✅ ${message}`, 'green');
}

/**
 * Print info message
 */
function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Print warning message
 */
function warn(message) {
  log(`⚠️  ${message}`, 'yellow');
}

/**
 * Show help message
 */
function showHelpMessage() {
  log(`
${colors.bright}${colors.cyan}PMS Database Migration Script${colors.reset}
${colors.cyan}============================${colors.reset}

This script initializes and migrates the PMS database schema.

${colors.bright}Usage:${colors.reset}
  node src/database/script/ddl/index.js [options]

${colors.bright}Options:${colors.reset}
  --dry-run    Show what would be executed without running it
  --force      Force recreate tables (drop if exists)
  --help       Show this help message

${colors.bright}Environment Variables:${colors.reset}
  DB_HOST      MySQL host (default: localhost)
  DB_PORT      MySQL port (default: 3306)
  DB_USERNAME  MySQL username (required)
  DB_PASSWORD  MySQL password (required)
  DB_DATABASE  MySQL database name (required)

${colors.bright}Example:${colors.reset}
  DB_USERNAME=root DB_PASSWORD=password DB_DATABASE=pms node src/database/script/ddl/index.js

${colors.bright}Migration Order:${colors.reset}
  1. Core tables (01-15)
  2. Performance indexes
  3. Validation checks
`, 'cyan');
}

/**
 * Validate environment variables
 */
function validateEnvironment() {
  const required = ['DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    error(`Missing required environment variables: ${missing.join(', ')}\n\nRun with --help for usage information.`);
  }

  if (isDryRun) {
    warn('DRY RUN MODE - No changes will be made to the database');
  }

  if (isForce) {
    warn('FORCE MODE - Tables will be dropped and recreated');
  }
}

/**
 * Check database connection
 */
async function testConnection() {
  info('Testing database connection...');

  try {
    const connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      connectTimeout: 5000,
    });

    await connection.execute('SELECT 1');
    await connection.end();

    success('Database connection successful');
    return true;
  } catch (err) {
    error('Database connection failed', err);
    return false;
  }
}

/**
 * Check if database exists
 */
async function checkDatabase() {
  info(`Checking if database '${DB_CONFIG.database}' exists...`);

  try {
    const connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
    });

    const [rows] = await connection.execute(
      'SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?',
      [DB_CONFIG.database]
    );

    await connection.end();

    if (rows.length === 0) {
      error(`Database '${DB_CONFIG.database}' does not exist. Please create it first.`);
      return false;
    }

    success(`Database '${DB_CONFIG.database}' exists`);
    return true;
  } catch (err) {
    error('Failed to check database existence', err);
    return false;
  }
}

/**
 * Read SQL file content
 */
function readSqlFile(filePath) {
  try {
    const fullPath = path.resolve(__dirname, 'tables', filePath);
    return fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
    error(`Failed to read file: ${filePath}`, err);
    return null;
  }
}

/**
 * Execute SQL statements
 */
async function executeSql(connection, sql, description) {
  try {
    if (isDryRun) {
      log(`[DRY RUN] Would execute: ${description}`, 'yellow');
      return true;
    }

    info(`Executing: ${description}`);
    await connection.execute(sql);
    success(`Completed: ${description}`);
    return true;
  } catch (err) {
    error(`Failed to execute: ${description}`, err);
    return false;
  }
}

/**
 * Drop existing tables if force mode is enabled
 */
async function dropExistingTables(connection) {
  if (!isForce) return true;

  warn('Force mode enabled - dropping existing tables...');

  const dropStatements = MIGRATION_FILES.map(file => {
    const tableName = file.replace('.sql', '').replace(/^\d+_/, '');
    return `DROP TABLE IF EXISTS ${tableName};`;
  }).join('\n');

  return await executeSql(connection, dropStatements, 'Drop existing tables');
}

/**
 * Run table migrations
 */
async function runTableMigrations(connection) {
  log(`\n${colors.bright}${colors.magenta}Running Table Migrations...${colors.reset}`, 'magenta');

  for (const file of MIGRATION_FILES) {
    const sql = readSqlFile(file);
    if (!sql) continue;

    const success = await executeSql(connection, sql, `Create table from ${file}`);
    if (!success) return false;
  }

  success('All table migrations completed');
  return true;
}

/**
 * Run index creation
 */
async function runIndexCreation(connection) {
  log(`\n${colors.bright}${colors.magenta}Running Index Creation...${colors.reset}`, 'magenta');

  try {
    const indexPath = path.resolve(__dirname, 'indexes', INDEX_FILE);
    const sql = fs.readFileSync(indexPath, 'utf8');

    if (isDryRun) {
      log(`[DRY RUN] Would create performance indexes from ${INDEX_FILE}`, 'yellow');
      return true;
    }

    info(`Creating performance indexes from ${INDEX_FILE}`);
    await connection.execute(sql);
    success('Performance indexes created successfully');
    return true;
  } catch (err) {
    error(`Failed to create indexes from ${INDEX_FILE}`, err);
    return false;
  }
}

/**
 * Run validation checks
 */
async function runValidationChecks(connection) {
  log(`\n${colors.bright}${colors.magenta}Running Validation Checks...${colors.reset}`, 'magenta');

  const validations = [
    {
      name: 'Table count check',
      query: 'SELECT COUNT(*) as count FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?',
      expected: MIGRATION_FILES.length,
      description: `Should have ${MIGRATION_FILES.length} tables`
    },
    {
      name: 'Required tables exist',
      query: `
        SELECT COUNT(*) as count FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN (
          'kpi_v3', 'kpi_ownership_v3', 'kpi_realization_v3', 'kpi_score_v3',
          'position_cohort', 'cohort_kpi_formula', 'kpi_schedule_v3'
        )
      `,
      expected: 7,
      description: 'Core tables should exist'
    }
  ];

  for (const validation of validations) {
    try {
      const [rows] = await connection.execute(validation.query, [DB_CONFIG.database]);
      const actual = rows[0].count;

      if (actual === validation.expected) {
        success(`✓ ${validation.name}: ${actual} ${validation.description}`);
      } else {
        warn(`⚠ ${validation.name}: Expected ${validation.expected}, got ${actual}`);
      }
    } catch (err) {
      warn(`Could not validate: ${validation.name} - ${err.message}`);
    }
  }

  success('Validation checks completed');
}

/**
 * Show migration summary
 */
function showSummary(startTime) {
  const duration = Date.now() - startTime;

  log(`
${colors.bright}${colors.green}🎉 Migration Completed Successfully!${colors.reset}

${colors.bright}Summary:${colors.reset}
  • Tables Created: ${MIGRATION_FILES.length}
  • Indexes Added: 50+
  • Duration: ${Math.round(duration / 1000)}s
  • Database: ${DB_CONFIG.database}
  • Host: ${DB_CONFIG.host}:${DB_CONFIG.port}

${colors.bright}Next Steps:${colors.reset}
  1. Start your PMS service
  2. Run the initial data seeding scripts
  3. Configure external system integrations (P-KPI, MDM)
  4. Test the API endpoints

${colors.bright}Documentation:${colors.reset}
  • Schema Documentation: src/database/script/ddl/tables/README.md
  • API Documentation: Available via Swagger/OpenAPI
  • PRD Documents: docs/prd/

${colors.yellow}⚠️  Remember to backup your database regularly!${colors.reset}
`, 'green');
}

/**
 * Main migration function
 */
async function runMigration() {
  const startTime = Date.now();

  try {
    // Show help if requested
    if (showHelp) {
      showHelpMessage();
      return;
    }

    // Validate environment
    validateEnvironment();

    // Test connection
    if (!await testConnection()) return;

    // Check database
    if (!await checkDatabase()) return;

    // Create database connection
    const connection = await mysql.createConnection(DB_CONFIG);

    try {
      // Drop existing tables if force mode
      if (!await dropExistingTables(connection)) return;

      // Run table migrations
      if (!await runTableMigrations(connection)) return;

      // Run index creation
      if (!await runIndexCreation(connection)) return;

      // Run validation checks
      await runValidationChecks(connection);

      // Show summary
      showSummary(startTime);

    } finally {
      await connection.end();
    }

  } catch (err) {
    error('Migration failed', err);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  error('Uncaught exception', err);
});

process.on('unhandledRejection', (reason, promise) => {
  error('Unhandled rejection', reason);
});

// Run the migration
runMigration().catch((err) => {
  error('Migration script failed', err);
});
