import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
if (!url) { console.log('No DATABASE_URL'); process.exit(0); }
const conn = await mysql.createConnection(url);
const sqls = [
  'CREATE TABLE IF NOT EXISTS `document_dependencies` (`id` int AUTO_INCREMENT NOT NULL, `documentSlug` varchar(255) NOT NULL, `dependsOnSlug` varchar(255) NOT NULL, `prerequisiteSlug` varchar(255) NOT NULL, `createdAt` timestamp NOT NULL DEFAULT (now()), CONSTRAINT `document_dependencies_id` PRIMARY KEY(`id`))',
  'CREATE TABLE IF NOT EXISTS `document_templates` (`id` int AUTO_INCREMENT NOT NULL, `name` varchar(200) NOT NULL, `description` text, `category` varchar(100) NOT NULL, `content` mediumtext NOT NULL, `icon` varchar(50), `usageCount` int NOT NULL DEFAULT 0, `createdAt` timestamp NOT NULL DEFAULT (now()), `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP, CONSTRAINT `document_templates_id` PRIMARY KEY(`id`))',
  'CREATE TABLE IF NOT EXISTS `glossary_terms` (`id` int AUTO_INCREMENT NOT NULL, `term` varchar(200) NOT NULL, `definition` text NOT NULL, `category` varchar(100), `relatedTerms` text, `createdAt` timestamp NOT NULL DEFAULT (now()), `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP, CONSTRAINT `glossary_terms_id` PRIMARY KEY(`id`))'
];
for (const sql of sqls) { try { await conn.execute(sql); console.log('OK:', sql.substring(0,40)); } catch(e) { console.warn('Skip:', e.message.substring(0,60)); } }
await conn.end();
console.log('Migration done.');