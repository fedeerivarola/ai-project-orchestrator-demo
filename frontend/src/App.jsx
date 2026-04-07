import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { DecisionPanel } from "./components/DecisionPanel";
import { DemoControls } from "./components/DemoControls";
import { ExecutionMonitor } from "./components/ExecutionMonitor";
import { EventDetail } from "./components/EventDetail";
import { EventTimeline } from "./components/EventTimeline";
import { GlobalContextPanel } from "./components/GlobalContextPanel";
import { Header } from "./components/Header";
import { ImpactSummary } from "./components/ImpactSummary";
import { RoleBoard } from "./components/RoleBoard";
import { ToastContainer } from "./components/ToastContainer";
import { t } from "./i18n";
import { fetchProjectState, resetDemo, triggerEvent } from "./services/api";

const TOAST_LIFETIME_MS = 5200;
const TOAST_EXIT_MS = 320;
const ROLE_HIGHLIGHT_MS = 2400;
const PANEL_HIGHLIGHT_MS = 1800;

function App() {
  const [state, setState] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toasts, setToasts] = useState([]);
  const [highlightedRoles, setHighlightedRoles] = useState([]);
  const [highlightDecision, setHighlightDecision] = useState(false);
  const [highlightImpact, setHighlightImpact] = useState(false);
  const [lang, setLang] = useState("es");

  useEffect(() => {
    loadState();
  }, []);

  async function loadState() {
    try {
      setIsLoading(true);
      const projectState = await fetchProjectState();
      setState(projectState);
      const firstEvent = projectState.timeline?.[0];
      setSelectedEventId(firstEvent ? firstEvent.instanceId : null);
      setError("");
    } catch (err) {
      setError(t(lang, "loadError"));
    } finally {
      setIsLoading(false);
    }
  }

  async function onTriggerEvent(eventTemplateId) {
    try {
      const response = await triggerEvent(eventTemplateId, lang);
      setState(response.state);
      setSelectedEventId(response.event.instanceId);
      pushToasts(response.notifications || []);
      setHighlightedRoles(response.affectedRoles || []);
      setTimeout(() => setHighlightedRoles([]), ROLE_HIGHLIGHT_MS);
      setHighlightDecision(true);
      setHighlightImpact(true);
      setTimeout(() => setHighlightDecision(false), PANEL_HIGHLIGHT_MS);
      setTimeout(() => setHighlightImpact(false), PANEL_HIGHLIGHT_MS);
    } catch (err) {
      setError(t(lang, "triggerError"));
    }
  }

  async function onReset() {
    try {
      const response = await resetDemo();
      setState(response.state);
      setSelectedEventId(null);
      setError("");
      setToasts([]);
      setHighlightedRoles([]);
      setHighlightDecision(false);
      setHighlightImpact(false);
    } catch (err) {
      setError(t(lang, "resetError"));
    }
  }

  function pushToasts(notifications) {
    const createdAt = Date.now();
    const prepared = notifications.map((notification, index) => ({
      ...notification,
      id: `${notification.id}-${Date.now()}-${index}`,
      leaving: false,
      createdAt,
      ttlMs: TOAST_LIFETIME_MS,
    }));

    setToasts((prev) => [...prepared, ...prev].slice(0, 8));

    prepared.forEach((toast) => {
      setTimeout(() => closeToast(toast.id), TOAST_LIFETIME_MS);
    });
  }

  function closeToast(toastId) {
    setToasts((prev) => prev.map((toast) => (toast.id === toastId ? { ...toast, leaving: true } : toast)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
    }, TOAST_EXIT_MS);
  }

  const selectedEvent = useMemo(
    () => state?.timeline?.find((event) => event.instanceId === selectedEventId),
    [state, selectedEventId]
  );

  const latestDecision = state?.decisions?.[0];
  const latestTrace = state?.traces?.[0];

  if (isLoading) {
    return <div className="p-10 text-center text-slate-200">{t(lang, "loadingDemo")}</div>;
  }

  if (!state) {
    return <div className="p-10 text-center text-rose-200">{t(lang, "noState")}</div>;
  }

  return (
    <AppShell>
      <Header project={state.project} onReset={onReset} lang={lang} onLangChange={setLang}>
        <DemoControls eventCatalog={state.eventCatalog} onTrigger={onTriggerEvent} lang={lang} />
      </Header>
      {error && (
        <div className="rounded-xl border border-rose-500/50 bg-rose-900/30 p-3 text-sm text-rose-100">
          {error}
        </div>
      )}
      <section className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <GlobalContextPanel context={state.globalContext} lang={lang} />
          <ExecutionMonitor roleContexts={state.roleContexts} lang={lang} />
        </div>
        <div className="space-y-4">
          <EventTimeline
            timeline={state.timeline}
            selectedEventId={selectedEventId}
            onSelect={setSelectedEventId}
            lang={lang}
          />
          <EventDetail event={selectedEvent} lang={lang} />
          <DecisionPanel decision={latestDecision} highlight={highlightDecision} lang={lang} />
          <ImpactSummary trace={latestTrace} highlight={highlightImpact} lang={lang} />
        </div>
      </section>
      <RoleBoard roleContexts={state.roleContexts} highlightedRoles={highlightedRoles} lang={lang} />
      <ToastContainer toasts={toasts} onClose={closeToast} lang={lang} />
    </AppShell>
  );
}

export default App;
