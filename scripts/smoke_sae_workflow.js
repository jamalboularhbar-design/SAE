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
  score: 5,
  recommendedOffer: 'Business Automation Sprint',
};

for (const [key, value] of Object.entries(expected)) {
  if (output[key] !== value) {
    throw new Error(`Expected ${key} to be ${value}, received ${output[key]}.`);
  }
}

console.log('SAE workflow smoke test passed.');
console.log(`- ${output.companyName}: ${output.qualification} lead`);
console.log(`- recommended offer: ${output.recommendedOffer}`);
console.log(`- next action: ${output.nextAction}`);
