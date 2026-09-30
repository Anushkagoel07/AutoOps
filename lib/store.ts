import fs from "fs";
import path from "path";

export type RequestRecord = {
  id: string;
  name: string;
  email: string;
  message: string;
  type: "support" | "sales";
  category?: string;
  priority?: string;
  confidence?: number;
  decision?: string;
  reason?: string;
  action?: string;
  draft_content?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type AgentActivity = {
  id: string;
  request_id: string;
  category?: string;
  priority?: string;
  confidence?: number;
  decision: string;
  reason: string;
  action: string;
  status: string;
  created_at: string;
};

export type Escalation = {
  id: string;
  request_id: string;
  summary: string;
  reason: string;
  suggested_action: string;
  status: "pending" | "in_progress" | "resolved";
  created_at: string;
};

export type Lead = {
  id: string;
  request_id: string;
  lead_score: number;
  follow_up_status: string;
  created_at: string;
};

type StoreData = {
  requests: RequestRecord[];
  agent_activity: AgentActivity[];
  escalations: Escalation[];
  leads: Lead[];
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "autoops.json");

const emptyStore: StoreData = {
  requests: [],
  agent_activity: [],
  escalations: [],
  leads: [],
};

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(emptyStore, null, 2));
  }
}

function readStore(): StoreData {
  ensureStore();

  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    fs.writeFileSync(dataFile, JSON.stringify(emptyStore, null, 2));
    return structuredClone(emptyStore);
  }
}

function writeStore(data: StoreData) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

export function getRequests() {
  return readStore().requests.sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );
}

export function getRequest(id: string) {
  return readStore().requests.find((request) => request.id === id) ?? null;
}

export function createRequest(
  request: Omit<RequestRecord, "created_at" | "updated_at">
) {
  const store = readStore();

  const now = new Date().toISOString();

  const record: RequestRecord = {
    ...request,
    created_at: now,
    updated_at: now,
  };

  store.requests.push(record);
  writeStore(store);

  return record;
}

export function updateRequest(
  id: string,
  updates: Partial<RequestRecord>
) {
  const store = readStore();

  const index = store.requests.findIndex(
    (request) => request.id === id
  );

  if (index === -1) return null;

  store.requests[index] = {
    ...store.requests[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  writeStore(store);

  return store.requests[index];
}

export function addAgentActivity(activity: AgentActivity) {
  const store = readStore();

  store.agent_activity.push(activity);

  writeStore(store);

  return activity;
}

export function getAgentActivity() {
  return readStore().agent_activity.sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );
}

export function addEscalation(escalation: Escalation) {
  const store = readStore();

  store.escalations.push(escalation);

  writeStore(store);

  return escalation;
}

export function getEscalations() {
  return readStore().escalations.sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );
}

export function updateEscalation(
  id: string,
  status: Escalation["status"]
) {
  const store = readStore();

  const index = store.escalations.findIndex(
    (item) => item.id === id
  );

  if (index === -1) return null;

  store.escalations[index].status = status;

  writeStore(store);

  return store.escalations[index];
}

export function addLead(lead: Lead) {
  const store = readStore();

  store.leads.push(lead);

  writeStore(store);

  return lead;
}

export function getLeads() {
  return readStore().leads.sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );
}

export function getAnalyticsSummary() {
  const store = readStore();

  const requests = store.requests;

  const total = requests.length;

  const autoResolved = requests.filter(
    (r) => r.decision === "auto_resolve"
  ).length;

  const followUps = requests.filter(
    (r) => r.decision === "follow_up"
  ).length;

  const escalations = requests.filter(
    (r) => r.decision === "escalate"
  ).length;

  const rejected = requests.filter(
    (r) => r.decision === "reject"
  ).length;

  const resolved = requests.filter(
    (r) => r.status === "resolved"
  ).length;

  const resolutionRate =
    total > 0 ? Math.round((resolved / total) * 100) : 0;

  return {
    total,
    autoResolved,
    followUps,
    escalations,
    rejected,
    resolutionRate,
    spamFiltered: rejected,
    activityCount: store.agent_activity.length,
    leads: store.leads.length,
  };
}

export function getFullStore() {
  return readStore();
}