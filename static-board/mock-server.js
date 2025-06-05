import express from 'express';
import fs from 'fs/promises';
import { encode } from '@msgpack/msgpack';
import Automerge from 'automerge';

const PORT = 3001;

async function boardCommit() {
  const raw = await fs.readFile('./public/board.json', 'utf8');
  const board = JSON.parse(raw);
  const doc = Automerge.from(board);
  const state = Automerge.save(doc);
  const encoded = encode(state);
  return { state: Array.from(encoded) };
}

const commitPromise = boardCommit();
const documentHash = 'mock-document';
const commitHash = 'mock-commit';

const app = express();

app.get('/:dna/:id/content/get_documents_with_tag', (req, res) => {
  res.json([{ target: documentHash }]);
});

app.get('/:dna/:id/content/get_commits_for_document', (req, res) => {
  res.json([{ target: commitHash }]);
});

app.get('/:dna/:id/content/get_commit', async (req, res) => {
  const commit = await commitPromise;
  res.json({ entry: commit });
});

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});
