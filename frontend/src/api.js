// Thin API client for the WelfareChain backend (proxied to :8000 by Vite).
async function j(method, url, body) {
  const opts = { method, headers: {} };
  if (body instanceof FormData) opts.body = body;
  else if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  const r = await fetch(url, opts);
  if (!r.ok) {
    let detail = r.statusText;
    try { detail = (await r.json()).detail || detail; } catch { /* noop */ }
    throw new Error(detail);
  }
  return r.json();
}

export const api = {
  health: () => j("GET", "/api/health"),
  chainInfo: () => j("GET", "/api/chain/info"),
  chainBlocks: (limit = 8) => j("GET", `/api/chain/blocks?limit=${limit}`),
  chainTx: (hash) => j("GET", `/api/chain/tx/${encodeURIComponent(hash)}`),
  chainEvents: (limit = 20) => j("GET", `/api/chain/events?limit=${limit}`),
  schemes: () => j("GET", "/api/schemes"),
  samples: () => j("GET", "/api/documents/samples"),
  createUser: (profile) => j("POST", "/api/users", profile),
  getUser: (id) => j("GET", `/api/users/${id}`),
  userApplications: (userId) => j("GET", `/api/users/${userId}/applications`),
  chat: (user_id, message, locale, history = []) =>
    j("POST", "/api/chat", { user_id, message, locale, history }),
  apply: (user_id, scheme_key) => j("POST", "/api/applications", { user_id, scheme_key }),
  uploadSample: (appId, sampleId, docType = "income") => {
    const fd = new FormData();
    fd.append("doc_type", docType);
    fd.append("sample_id", sampleId);
    return j("POST", `/api/applications/${appId}/documents`, fd);
  },
  uploadFile: (appId, file, docType = "income") => {
    const fd = new FormData();
    fd.append("doc_type", docType);
    fd.append("file", file);
    return j("POST", `/api/applications/${appId}/documents`, fd);
  },
  verify: (appId) => j("POST", `/api/applications/${appId}/verify`),
  application: (appId) => j("GET", `/api/applications/${appId}`),
  adminMetrics: () => j("GET", "/api/admin/metrics"),
  adminLedger: () => j("GET", "/api/admin/ledger?limit=40"),
  review: (appId, approve, reason = "") =>
    j("POST", `/api/admin/review/${appId}`, { approve, reason }),
};
