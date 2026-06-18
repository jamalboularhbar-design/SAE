#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const workflowPath = path.join(root, 'workflows', 'sae-first-intake-webhook.json');
const scenariosDir = path.join(root, 'examples', 'scenarios');

const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
const codeNode = workflow.nodes.find((node) => node.name === 'Normalize + Score Lead');

if (!codeNode) {
  throw new Error('Normalize + Score Lead node not found.');
}

const runCodeNode = new Function('$input', codeNode.parameters.jsCode);

function runScenario(payload) {
  const result = runCodeNode({
    first: () => ({
      json: {
        body: payload,
      },
    }),
  });

  if (!Array.isArray(result) || result.length !== 1 || !result[0].json) {
    throw new Error('Code node did not return one n8n item.');
  }

  return result[0].json;
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
}

const files = fs.readdirSync(scenariosDir)
  .filter((file) => file.endsWith('.json'))
  .sort();

if (files.length === 0) {
  throw new Error('No scenario files found.');
}

for (const file of files) {
  const scenarioPath = path.join(scenariosDir, file);
  const scenario = JSON.parse(fs.readFileSync(scenarioPath, 'utf8'));
  const output = runScenario(scenario.payload);
  const expected = scenario.expected;

  assertEqual(output.qualification, expected.qualification, `${file} qualification`);
  assertEqual(output.recommendedOffer, expected.recommendedOffer, `${file} recommendedOffer`);
  assertEqual(output.primaryUseCase, expected.primaryUseCase, `${file} primaryUseCase`);
  assertEqual(output.detectedIndustry, expected.detectedIndustry, `${file} detectedIndustry`);
  assertEqual(output.dataSensitivity, expected.dataSensitivity, `${file} dataSensitivity`);
  assertEqual(output.notification.shouldNotify, expected.shouldNotify, `${file} notification.shouldNotify`);

  if (!output.persistenceRecord.leadId.startsWith('SAE-')) {
    throw new Error(`${file}: expected persistenceRecord.leadId to start with SAE-`);
  }

  if (!output.proposalDraft.aiPrompt.includes(output.companyName)) {
    throw new Error(`${file}: expected proposal prompt to include company name`);
  }

  console.log(`${file}: ${output.qualification} -> ${output.recommendedOffer} (${output.primaryUseCase})`);
}

console.log(`SAE scenario test passed for ${files.length} reality cases.`);
