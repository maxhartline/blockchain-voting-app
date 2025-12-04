// src/api/apiClient.js
// Mock API layer for now. Your backend partner can replace these
// with real fetch() calls later.

const MOCK_CANDIDATES = [
  "Kanye West",
  "Elon Musk",
  "Zohran Mamdani",
  "Bernie Sanders",
  "Greta Thunberg",
  "Dwayne \"The Rock\" Johnson",
];

export async function registerUserAndGenerateToken(
  firstName,
  lastName,
  dob,
  address
) {
  if (!firstName || !lastName || !dob || !address) {
    return { success: false, message: "All fields are required." };
  }

  // Frontend-only mock: generate a fake token
  const random = Math.random().toString(16).slice(2, 8).toUpperCase();
  const token = `TOKEN-${random}`;

  // Later, replace this with a real POST /register call.
  return { success: true, token };
}

export async function validateToken(token) {
  if (!token || !token.trim()) {
    return { valid: false, message: "Token is required." };
  }

  // Frontend-only rule:
  // Any token starting with "TOKEN-" is considered valid.
  if (!token.trim().startsWith("TOKEN-")) {
    return { valid: false, message: "Invalid or already used token." };
  }

  // Later, replace with POST /validate-token.
  return { valid: true };
}

export async function fetchCandidates() {
  // Later, replace with GET /candidates.
  return MOCK_CANDIDATES;
}

export async function castVote(token, selectedCandidate) {
  if (!token || !selectedCandidate) {
    return { success: false, message: "Token and candidate are required." };
  }

  // Frontend-only mock of backend /vote behavior.
  // For fun, treat tokens ending in X as "already used".
  if (token.trim().endsWith("X")) {
    return { success: false, message: "Invalid or already used token." };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    message: "Vote successfully added to the blockchain! (mock)",
  };

  // When backend is ready, replace the above with something like:
  /*
  const res = await fetch("http://127.0.0.1:5000/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, selected_candidate: selectedCandidate }),
  });
  const data = await res.json();
  return data;
  */
}

export async function fetchResults() {
  // Frontend-only mock; later call GET /results.
  return [
    { candidate: "Kanye West", votes: 2 },
    { candidate: "Elon Musk", votes: 4 },
    { candidate: "Zohran Mamdani", votes: 1 },
    { candidate: "Bernie Sanders", votes: 3 },
    { candidate: "Greta Thunberg", votes: 2 },
    { candidate: "Dwayne \"The Rock\" Johnson", votes: 5 },
  ];
}