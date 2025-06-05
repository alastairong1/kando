// Fetches the latest board state from a base URL exposing the Syn endpoints.
// If no URL is provided, the function falls back to loading `board.json` from
// the public folder.
export async function fetchBoardState(baseUrl) {
  if (!baseUrl) {
    const res = await fetch('/board.json');
    if (!res.ok) {
      throw new Error('Failed to load board.json');
    }
    return res.json();
  }

  const callMethod = async (method, payloadObj) => {
    const jsonString = JSON.stringify(payloadObj);
    const payload = btoa(jsonString);
    const url = `${baseUrl}/${method}?payload=${payload}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed ${method}: ${res.status}`);
    }
    return res.json();
  };

  // 1. get documents tagged as active
  const docs = await callMethod('get_documents_with_tag', 'active');
  if (!docs.length) {
    throw new Error('No active boards found');
  }
  const documentTarget = docs[0].target;

  // 2. get commits for the document
  const commits = await callMethod('get_commits_for_document', documentTarget);
  if (!commits.length) {
    throw new Error('No commits for document');
  }
  const commitAddress = commits[commits.length - 1].target;

  // 3. fetch the commit record
  const record = await callMethod('get_commit', commitAddress);

  // 4. convert commit to board state
  const { stateFromCommit } = await import('@holochain-syn/core');
  const boardState = stateFromCommit(record.entry);
  return boardState;
}
