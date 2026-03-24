// Globals provided by React UMD builds loaded in index.html
const { useState, useEffect, useCallback, useMemo } = React;

// ── Cloudflare API helper ────────────────────────────────────────────
// Auth is injected server-side by the Worker using CF_API_KEY secret.
const cfFetch = async (path, opts = {}) => {
  const res = await fetch(`/api${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.errors?.[0]?.message || "API error");
  return data;
};

// ── Icons ────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    kv: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="2" y="3" width="20" height="5" rx="1" /><rect x="2" y="10" width="20" height="5" rx="1" /><rect x="2" y="17" width="20" height="5" rx="1" />
      </svg>
    ),
    d1: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5" /><path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6" />
      </svg>
    ),
    sort_asc: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 6h18M3 12h12M3 18h6" /><path d="M19 8l3-3-3-3" /><path d="M22 5h-6" />
      </svg>
    ),
    sort_desc: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 6h18M3 12h12M3 18h6" /><path d="M19 16l3 3-3 3" /><path d="M22 19h-6" />
      </svg>
    ),
    copy: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
    refresh: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
      </svg>
    ),
    chevron: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="m9 18 6-6-6-6" />
      </svg>
    ),
    key: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" />
      </svg>
    ),
    table: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
    close: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
    ),
    run: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <polygon points="6 3 20 12 6 21 6 3" />
      </svg>
    ),
    warning: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4M12 17h.01" />
      </svg>
    ),
    sun: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
    moon: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
  };
  return icons[name] || null;
};

// ── Styles ───────────────────────────────────────────────────────────
const styles = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0a0b0d;
  --surface: #111318;
  --surface2: #181c23;
  --border: #1f2530;
  --border2: #2a3040;
  --accent: #f97316;
  --accent2: #fb923c;
  --accent-dim: rgba(249,115,22,0.12);
  --accent-glow: rgba(249,115,22,0.25);
  --blue: #38bdf8;
  --blue-dim: rgba(56,189,248,0.1);
  --green: #4ade80;
  --green-dim: rgba(74,222,128,0.1);
  --red: #f87171;
  --red-dim: rgba(248,113,113,0.1);
  --text: #e2e8f0;
  --text-dim: #64748b;
  --text-muted: #334155;
  --radius: 8px;
  --radius-lg: 12px;
  --mono: 'JetBrains Mono', monospace;
  --display: 'Syne', sans-serif;
}

html, body, #root { height: 100%; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--display);
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);
}

/* ── Header ── */
.header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--display);
  font-weight: 800;
  font-size: 16px;
  letter-spacing: -0.5px;
}
.logo-dot { color: var(--accent); }

.header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.header-credits {
  font-size: 12px;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.header-credits a {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}
.header-credits a:hover {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

/* ── Tab bar ── */
.tabs {
  display: flex;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  padding: 0 8px;
  gap: 4px;
}
.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  font-family: var(--display);
  font-weight: 600;
  font-size: 13px;
  color: var(--text-dim);
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.15s;
  white-space: nowrap;
}
.tab:hover { color: var(--text); }
.tab.active { color: var(--accent); border-bottom-color: var(--accent); }
.tab-kv.active { color: var(--blue); border-bottom-color: var(--blue); }

/* ── Content ── */
.content { flex: 1; overflow: hidden; display: flex; flex-direction: column; }

/* ── Panels ── */
.panel { display: none; flex: 1; overflow: hidden; flex-direction: column; }
.panel.active { display: flex; }

/* ── Inputs ── */
input, textarea, select {
  background: var(--bg);
  border: 1px solid var(--border2);
  border-radius: var(--radius);
  color: var(--text);
  font-family: var(--mono);
  font-size: 13px;
  padding: 10px 12px;
  width: 100%;
  outline: none;
  transition: border-color 0.15s;
  -webkit-appearance: none;
}
input:focus, textarea:focus, select:focus { border-color: var(--accent); }
input::placeholder, textarea::placeholder { color: var(--text-muted); }
textarea { resize: vertical; min-height: 80px; }

/* ── Buttons ── */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: var(--radius);
  border: none;
  font-family: var(--display);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  text-decoration: none;
}
.btn-primary { background: var(--accent); color: #000; }
.btn-primary:hover { background: var(--accent2); }
.btn-primary:active { transform: scale(0.97); }
.btn-ghost { background: transparent; color: var(--text-dim); border: 1px solid var(--border2); }
.btn-ghost:hover { background: var(--surface2); color: var(--text); border-color: var(--border2); }
.btn-icon { padding: 8px; border-radius: var(--radius); background: var(--surface2); border: 1px solid var(--border); color: var(--text-dim); cursor: pointer; display: flex; align-items: center; transition: all 0.15s; }
.btn-icon:hover { color: var(--text); border-color: var(--border2); }
.btn-sm { padding: 6px 10px; font-size: 12px; }

/* ── Sidebar + main layout ── */
.explorer-layout { display: flex; flex: 1; overflow: hidden; }
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
@media (max-width: 600px) {
  .sidebar { width: 100%; position: absolute; z-index: 10; top: 0; left: 0; right: 0; bottom: 0; transform: translateX(-100%); transition: transform 0.2s; }
  .sidebar.open { transform: translateX(0); }
}
.sidebar-header { padding: 12px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
.sidebar-title { font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-dim); flex: 1; }
.sidebar-list { flex: 1; overflow-y: auto; padding: 8px; }
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 13px;
  color: var(--text-dim);
  font-family: var(--mono);
  transition: all 0.1s;
  word-break: break-all;
}
.sidebar-item:hover { background: var(--surface2); color: var(--text); }
.sidebar-item.active { background: var(--accent-dim); color: var(--accent); }
.sidebar-item.active-blue { background: var(--blue-dim); color: var(--blue); }
.sidebar-empty { padding: 16px; color: var(--text-muted); font-size: 12px; text-align: center; }

/* ── Main area ── */
.main { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.main-header { padding: 12px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.main-title { font-weight: 700; font-size: 15px; letter-spacing: -0.3px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ── KV keys list ── */
.kv-list { flex: 1; overflow-y: auto; }
.kv-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.1s;
}
.kv-item:hover { background: var(--surface2); }
.kv-item.active { background: var(--accent-dim); }
.kv-key { font-family: var(--mono); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kv-meta { font-size: 11px; color: var(--text-dim); font-family: var(--mono); white-space: nowrap; }

/* ── Value viewer ── */
.value-pane {
  position: absolute;
  inset: 0;
  background: var(--surface);
  z-index: 20;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateX(100%);
  transition: transform 0.2s;
}
.value-pane.open { transform: translateX(0); }
.value-body { flex: 1; overflow-y: auto; padding: 16px; }
.value-code {
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--green);
}

/* ── D1 ── */
.d1-query-bar { padding: 12px 16px; border-bottom: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px; }
.d1-table-area { flex: 1; overflow: auto; }
.d1-table { width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 12px; }
.d1-table th {
  background: var(--surface2);
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border2);
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 2;
  font-family: var(--display);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
}
.sort-header { cursor: pointer; user-select: none; display: flex; align-items: center; gap: 6px; }
.sort-header:hover { color: var(--text); }
.sort-active { color: var(--accent); }
.d1-table td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text);
}
.d1-table tr:hover td { background: var(--surface2); }
.cell-null { color: var(--text-muted); font-style: italic; }
.cell-num { color: var(--blue); }
.cell-bool { color: var(--accent); }

/* ── Toolbar ── */
.toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; min-width: 120px; }
.search-wrap input { padding-left: 32px; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-dim); pointer-events: none; }

/* ── Badges ── */
.badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; font-family: var(--display); }
.badge-orange { background: var(--accent-dim); color: var(--accent); }
.badge-blue { background: var(--blue-dim); color: var(--blue); }
.badge-green { background: var(--green-dim); color: var(--green); }

/* ── Toast ── */
.toast-wrap { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 100; display: flex; flex-direction: column; gap: 8px; align-items: center; }
.toast {
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-radius: var(--radius);
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  animation: slideUp 0.2s ease;
  white-space: nowrap;
}
@keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* ── Loading / empty ── */
.spinner { width: 20px; height: 20px; border: 2px solid var(--border2); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.6s linear infinite; margin: auto; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; height: 160px; color: var(--text-dim); font-size: 13px; }

/* ── Error ── */
.error-bar { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: var(--red-dim); border-bottom: 1px solid var(--red); color: var(--red); font-size: 12px; font-family: var(--mono); }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

/* ── Mobile nav toggle ── */
.mobile-nav-btn { display: none; }
@media (max-width: 600px) { .mobile-nav-btn { display: flex; } }

/* ── Relative position wrapper ── */
.pos-rel { position: relative; overflow: hidden; flex: 1; display: flex; flex-direction: column; }

/* ── Pagination ── */
.pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 12px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text-dim); flex-shrink: 0; }

/* ── Light mode ── */
.app.light {
  --bg: #f8f9fb;
  --surface: #ffffff;
  --surface2: #f1f3f6;
  --border: #e2e8f0;
  --border2: #cbd5e1;
  --blue: #0284c7;
  --blue-dim: rgba(2,132,199,0.1);
  --green: #16a34a;
  --green-dim: rgba(22,163,74,0.1);
  --red: #dc2626;
  --red-dim: rgba(220,38,38,0.1);
  --text: #0f172a;
  --text-dim: #64748b;
  --text-muted: #94a3b8;
}
`;

// ── Toast ────────────────────────────────────────────────────────────
let _toastSetter = null;
const toast = (msg) => _toastSetter?.((t) => [...t, { id: Date.now(), msg }]);

function Toasts() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => { _toastSetter = setToasts; }, []);
  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => setToasts((tt) => tt.slice(1)), 2500);
    return () => clearTimeout(t);
  }, [toasts]);
  return (
    <div className="toast-wrap">
      {toasts.map((t) => <div key={t.id} className="toast">{t.msg}</div>)}
    </div>
  );
}

// ── Sort hook ────────────────────────────────────────────────────────
function useSortedData(data, defaultKey) {
  const [sortKey, setSortKey] = useState(defaultKey);
  const [sortDir, setSortDir] = useState("asc");

  const sorted = useMemo(() => {
    if (!data || !sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const toggle = (key) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  return { sorted, sortKey, sortDir, toggle };
}

// ── SortHeader ────────────────────────────────────────────────────────
function SortHeader({ col, sortKey, sortDir, toggle }) {
  const active = sortKey === col;
  return (
    <th>
      <div className={`sort-header ${active ? "sort-active" : ""}`} onClick={() => toggle(col)}>
        {col}
        {active ? <Icon name={sortDir === "asc" ? "sort_asc" : "sort_desc"} size={12} /> : null}
      </div>
    </th>
  );
}

// ── D1 Table ─────────────────────────────────────────────────────────
function D1Table({ rows }) {
  const cols = useMemo(() => (rows.length ? Object.keys(rows[0]) : []), [rows]);
  const { sorted, sortKey, sortDir, toggle } = useSortedData(rows, cols[0]);

  if (!rows.length) return <div className="empty-state"><Icon name="table" size={32} /><span>No rows</span></div>;

  const renderCell = (v) => {
    if (v === null || v === undefined) return <span className="cell-null">null</span>;
    if (typeof v === "number") return <span className="cell-num">{v}</span>;
    if (typeof v === "boolean") return <span className="cell-bool">{String(v)}</span>;
    return String(v);
  };

  return (
    <table className="d1-table">
      <thead>
        <tr>{cols.map((c) => <SortHeader key={c} col={c} sortKey={sortKey} sortDir={sortDir} toggle={toggle} />)}</tr>
      </thead>
      <tbody>
        {sorted.map((row, i) => (
          <tr key={i}>{cols.map((c) => <td key={c} title={String(row[c] ?? "")}>{renderCell(row[c])}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

// ── KV Explorer ───────────────────────────────────────────────────────
function KVExplorer({ accountId }) {
  const [namespaces, setNamespaces] = useState([]);
  const [selectedNs, setSelectedNs] = useState(null);
  const [keys, setKeys] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [prevCursors, setPrevCursors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedKey, setSelectedKey] = useState(null);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingVal, setLoadingVal] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [valuePaneOpen, setValuePaneOpen] = useState(false);
  const { sorted: sortedKeys, sortKey, sortDir, toggle } = useSortedData(keys, "name");

  useEffect(() => { loadNamespaces(); }, []);

  const loadNamespaces = async () => {
    setLoading(true); setError("");
    try {
      const d = await cfFetch(`/accounts/${accountId}/storage/kv/namespaces?per_page=100`);
      setNamespaces(d.result || []);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const loadKeys = useCallback(async (ns, cur = null, prev = []) => {
    setLoading(true); setError("");
    try {
      const q = new URLSearchParams({ limit: "50", ...(cur ? { cursor: cur } : {}), ...(search ? { prefix: search } : {}) });
      const d = await cfFetch(`/accounts/${accountId}/storage/kv/namespaces/${ns.id}/keys?${q}`);
      setKeys(d.result || []);
      setCursor(d.result_info?.cursor || null);
      setPrevCursors(prev);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, [accountId, search]);

  const selectNs = (ns) => {
    setSelectedNs(ns); setSelectedKey(null); setValuePaneOpen(false);
    setPrevCursors([]); loadKeys(ns, null, []); setSidebarOpen(false);
  };

  const loadValue = async (key) => {
    setSelectedKey(key); setValuePaneOpen(true); setLoadingVal(true);
    try {
      const res = await fetch(
        `/api/accounts/${accountId}/storage/kv/namespaces/${selectedNs.id}/values/${encodeURIComponent(key.name)}`
      );
      const text = await res.text();
      try { setValue(JSON.stringify(JSON.parse(text), null, 2)); } catch { setValue(text); }
    } catch (e) { setValue(`Error: ${e.message}`); }
    setLoadingVal(false);
  };

  const copyValue = () => { navigator.clipboard.writeText(value); toast("Copied!"); };

  return (
    <div className="explorer-layout">
      {sidebarOpen && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9 }} onClick={() => setSidebarOpen(false)} />}

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Namespaces</span>
          <button className="btn-icon" onClick={loadNamespaces}><Icon name="refresh" size={14} /></button>
        </div>
        <div className="sidebar-list">
          {namespaces.length === 0 && !loading && <div className="sidebar-empty">No namespaces</div>}
          {namespaces.map(ns => (
            <div key={ns.id} className={`sidebar-item ${selectedNs?.id === ns.id ? "active-blue" : ""}`} onClick={() => selectNs(ns)}>
              <Icon name="kv" size={13} /> {ns.title}
            </div>
          ))}
        </div>
      </div>

      <div className="main">
        {error && <div className="error-bar"><Icon name="warning" size={14} />{error}</div>}
        <div className="main-header">
          <button className="btn-icon mobile-nav-btn" onClick={() => setSidebarOpen(true)}><Icon name="kv" size={16} /></button>
          {selectedNs
            ? <><span className="main-title">{selectedNs.title}</span><span className="badge badge-blue">{keys.length} keys</span></>
            : <span className="main-title" style={{ color: "var(--text-dim)" }}>Select a namespace</span>
          }
          {selectedNs && (
            <div style={{ display: "flex", gap: 6 }}>
              {["name", "expiration"].map(k => (
                <button key={k} className={`btn btn-ghost btn-sm ${sortKey === k ? "sort-active" : ""}`} onClick={() => toggle(k)}>
                  {k} <Icon name={sortKey === k ? (sortDir === "asc" ? "sort_asc" : "sort_desc") : "sort_asc"} size={11} />
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedNs && (
          <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <div className="search-wrap" style={{ flex: 1 }}>
              <span className="search-icon"><Icon name="search" size={14} /></span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter prefix…" onKeyDown={e => e.key === "Enter" && loadKeys(selectedNs)} />
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => loadKeys(selectedNs)}><Icon name="run" size={13} /></button>
          </div>
        )}

        <div className="pos-rel">
          {loading
            ? <div style={{ padding: 32 }}><div className="spinner" /></div>
            : selectedNs ? (
              <div className="kv-list">
                {sortedKeys.length === 0 && <div className="empty-state"><Icon name="key" size={28} /><span>No keys found</span></div>}
                {sortedKeys.map(k => (
                  <div key={k.name} className={`kv-item ${selectedKey?.name === k.name ? "active" : ""}`} onClick={() => loadValue(k)}>
                    <span className="kv-key">{k.name}</span>
                    {k.expiration && <span className="kv-meta">exp {new Date(k.expiration * 1000).toLocaleDateString()}</span>}
                  </div>
                ))}
              </div>
            ) : null
          }

          <div className={`value-pane ${valuePaneOpen ? "open" : ""}`}>
            <div className="main-header">
              <button className="btn-icon" onClick={() => setValuePaneOpen(false)}><Icon name="close" size={16} /></button>
              <span className="main-title" style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{selectedKey?.name}</span>
              <button className="btn-icon" onClick={copyValue}><Icon name="copy" size={15} /></button>
            </div>
            <div className="value-body">
              {loadingVal ? <div className="spinner" /> : <pre className="value-code">{value}</pre>}
            </div>
          </div>
        </div>

        {selectedNs && (keys.length > 0 || prevCursors.length > 0) && (
          <div className="pagination">
            <button className="btn btn-ghost btn-sm" disabled={prevCursors.length === 0} onClick={() => {
              const prev = [...prevCursors]; const cur = prev.pop();
              loadKeys(selectedNs, cur, prev);
            }}>← Prev</button>
            <span>Page {prevCursors.length + 1}</span>
            <button className="btn btn-ghost btn-sm" disabled={!cursor} onClick={() => {
              loadKeys(selectedNs, cursor, [...prevCursors, cursor]);
            }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── D1 Explorer ───────────────────────────────────────────────────────
function D1Explorer({ accountId }) {
  const [databases, setDatabases] = useState([]);
  const [selectedDb, setSelectedDb] = useState(null);
  const [tables, setTables] = useState([]);
  const [query, setQuery] = useState("SELECT * FROM sqlite_master WHERE type='table';");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { loadDatabases(); }, []);

  const loadDatabases = async () => {
    setLoading(true); setError("");
    try {
      const d = await cfFetch(`/accounts/${accountId}/d1/database?per_page=100`);
      setDatabases(d.result || []);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const selectDb = async (db) => {
    setSelectedDb(db); setResults(null); setSidebarOpen(false);
    setQuery("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
    try {
      const d = await cfFetch(`/accounts/${accountId}/d1/database/${db.uuid}/query`, {
        method: "POST",
        body: JSON.stringify({ sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;" })
      });
      const rows = d.result?.[0]?.results || [];
      setTables(rows.map(r => r.name));
    } catch (e) { /* ignore */ }
  };

  const runQuery = async () => {
    if (!selectedDb || !query.trim()) return;
    setLoading(true); setError(""); setResults(null);
    try {
      const d = await cfFetch(`/accounts/${accountId}/d1/database/${selectedDb.uuid}/query`, {
        method: "POST", body: JSON.stringify({ sql: query })
      });
      const res = d.result?.[0];
      setResults(res?.results || []);
      toast(`✓ ${res?.results?.length ?? 0} rows · ${res?.meta?.duration?.toFixed(1) ?? "?"}ms`);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const tableQuery = (t) => { setQuery(`SELECT * FROM "${t}" LIMIT 100;`); };

  return (
    <div className="explorer-layout">
      {sidebarOpen && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9 }} onClick={() => setSidebarOpen(false)} />}

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Databases</span>
          <button className="btn-icon" onClick={loadDatabases}><Icon name="refresh" size={14} /></button>
        </div>
        <div className="sidebar-list">
          {databases.map(db => (
            <div key={db.uuid} className={`sidebar-item ${selectedDb?.uuid === db.uuid ? "active" : ""}`} onClick={() => selectDb(db)}>
              <Icon name="d1" size={13} /> {db.name}
            </div>
          ))}
          {databases.length === 0 && <div className="sidebar-empty">No databases</div>}
        </div>
        {tables.length > 0 && (
          <>
            <div className="sidebar-header" style={{ marginTop: 0 }}>
              <span className="sidebar-title">Tables</span>
            </div>
            <div className="sidebar-list">
              {tables.map(t => (
                <div key={t} className="sidebar-item" onClick={() => tableQuery(t)}>
                  <Icon name="table" size={13} /> {t}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="main">
        {error && <div className="error-bar"><Icon name="warning" size={14} />{error}</div>}
        <div className="main-header">
          <button className="btn-icon mobile-nav-btn" onClick={() => setSidebarOpen(true)}><Icon name="d1" size={16} /></button>
          <span className="main-title">{selectedDb ? selectedDb.name : "Select a database"}</span>
          {selectedDb && <span className="badge badge-orange">{selectedDb.version || "D1"}</span>}
        </div>

        <div className="d1-query-bar">
          <textarea value={query} onChange={e => setQuery(e.target.value)} placeholder="SELECT * FROM …" rows={3}
            onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); runQuery(); } }} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", alignSelf: "center" }}>⌘↩ to run</span>
            <button className="btn btn-primary btn-sm" onClick={runQuery} disabled={!selectedDb || loading}>
              <Icon name="run" size={13} /> Run
            </button>
          </div>
        </div>

        <div className="d1-table-area">
          {loading
            ? <div style={{ padding: 32 }}><div className="spinner" /></div>
            : results
              ? <D1Table rows={results} />
              : <div className="empty-state"><Icon name="d1" size={32} /><span>Run a query to see results</span></div>
          }
        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────
function App() {
  const [tab, setTab] = useState("kv");
  const [accountId, setAccountId] = useState(null);
  const [configError, setConfigError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("cf-explorer-theme") || "dark");

  const toggleTheme = () => setTheme((t) => {
    const next = t === "dark" ? "light" : "dark";
    localStorage.setItem("cf-explorer-theme", next);
    return next;
  });

  useEffect(() => {
    fetch("/config")
      .then(async r => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then(d => {
        if (!d.accountId) throw new Error("CF_ACCOUNT_ID secret not set — run: wrangler secret put CF_ACCOUNT_ID");
        setAccountId(d.accountId);
      })
      .catch(e => setConfigError(e.message));
  }, []);

  const renderBody = () => {
    if (configError) {
      return (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24, maxWidth: 420, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Configuration Error</div>
            <pre style={{ background: "var(--bg)", border: "1px solid var(--red)", borderRadius: "var(--radius)", color: "var(--red)", fontFamily: "var(--mono)", fontSize: 12, padding: "10px 12px", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>{configError}</pre>
          </div>
        </div>
      );
    }
    if (!accountId) {
      return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><div className="spinner" /></div>;
    }
    return (
      <>
        <div className="tabs">
          <button className={`tab tab-kv ${tab === "kv" ? "active" : ""}`} onClick={() => setTab("kv")}>
            <Icon name="kv" size={14} /> KV
          </button>
          <button className={`tab ${tab === "d1" ? "active" : ""}`} onClick={() => setTab("d1")}>
            <Icon name="d1" size={14} /> D1
          </button>
        </div>
        <div className="content">
          <div className={`panel ${tab === "kv" ? "active" : ""}`}>
            <KVExplorer accountId={accountId} />
          </div>
          <div className={`panel ${tab === "d1" ? "active" : ""}`}>
            <D1Explorer accountId={accountId} />
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`app${theme === "light" ? " light" : ""}`}>
        <div className="header">
          <div className="logo">
            <Icon name={tab === "kv" ? "kv" : "d1"} size={18} />
            CF<span className="logo-dot">.</span>Explorer
          </div>
          <div className="header-right">
            <div className="header-credits">
              <span>Made by</span>
              <a href="https://www.jackpearce.co.uk/" target="_blank" rel="noopener noreferrer">Jack Pearce</a>
              <span aria-hidden="true">♥</span>
              <span style={{ color: "var(--text-muted)" }}>·</span>
              <a href="https://github.com/jkpe/cf-explorer" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
            <button className="btn-icon" onClick={toggleTheme} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
              <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
            </button>
          </div>
        </div>
        {renderBody()}
        <Toasts />
      </div>
    </>
  );
}

// Mount the app
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
