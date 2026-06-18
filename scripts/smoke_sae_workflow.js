#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const workflowPath = path.join(root, 'workflows', 'sae-first-intake-webhook.json');
const samplePath = path.join(root, 'examples', 'sae-first-intake-payload.json');

const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
const sample = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
const codeNode = workflow.nodes.find((node) => node.name === 'Normalize + Score Lead');

if (!codeNode) {
  throw new Error('Normalize + Score Lead node not found.');
}

const runCodeNode = new Function('$input', codeNode.parameters.jsCode);
const result = runCodeNode({
  first: () => ({
    json: {
      body: sample,
    },
  }),
});

if (!Array.isArray(result) || result.length !== 1 || !result[0].json) {
  throw new Error('Code node did not return one n8n item.');
}

const output = result[0].json;
const expected = {
  qualification: 'hot',
  score: 6,
  recommendedOffer: 'AI WhatsApp Assistant',
};

for (const [key, value] of Object.entries(expected)) {
  if (output[key] !== value) {
    throw new Error(`Expected ${key} to be ${value}, received ${output[key]}.`);
  }
}

if (!output.persistenceRecord || output.persistenceRecord.status !== 'Discovery call needed') {
  throw new Error('Expected persistenceRecord.status to be Discovery call needed.');
}

if (!output.notification || output.notification.shouldNotify !== true) {
  throw new Error('Expected hot lead notification to be enabled.');
}

if (output.primaryUseCase !== 'ai_whatsapp_assistant') {
  throw new Error('Expected primaryUseCase to be ai_whatsapp_assistant.');
}

if (output.detectedIndustry !== 'healthcare' || output.dataSensitivity !== 'high') {
  throw new Error('Expected healthcare lead with high data sensitivity.');
}

if (!output.scoreBreakdown || output.scoreBreakdown.contactability !== 1) {
  throw new Error('Expected scoreBreakdown.contactability to be 1.');
}

if (!output.proposalDraft || output.proposalDraft.title !== 'AI WhatsApp Assistant for Atlas Dental Clinic') {
  throw new Error('Expected proposalDraft title for Atlas Dental Clinic.');
}

if (!output.proposalDraft.aiPrompt.includes('Atlas Dental Clinic')) {
  throw new Error('Expected proposalDraft.aiPrompt to include the lead company.');
}

if (!output.connectorTargets || !output.connectorTargets.notion || !output.connectorTargets.crm) {
  throw new Error('Expected connector targets for persistence and CRM.');
}

if (!output.proposalDraft.recommendedStack.includes('WhatsApp Business API provider')) {
  throw new Error('Expected WhatsApp stack recommendation.');
}

console.log('SAE workflow smoke test passed.');
console.log(`- ${output.companyName}: ${output.qualification} lead`);
console.log(`- recommended offer: ${output.recommendedOffer}`);
console.log(`- next action: ${output.nextAction}`);
console.log(`- persistence status: ${output.persistenceRecord.status}`);
console.log(`- hot notification: ${output.notification.shouldNotify}`);
console.log(`- proposal draft: ${output.proposalDraft.title}`);
console.log(`- use case: ${output.primaryUseCase}`);
console.log(`- data sensitivity: ${output.dataSensitivity}`);
