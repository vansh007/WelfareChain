import React, { useEffect, useState } from "react";
import { History, ChevronRight } from "lucide-react";
import { api } from "../api.js";
import { fmt } from "../i18n.js";

const STATUS_CLASS = {
  Disbursed: "g", Flagged: "r", Verifying: "m", Draft: "m", Rejected: "r",
};

export default function ApplicationHistory({ t, loc, userId }) {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    if (!userId) return;
    api.userApplications(userId).then(setApps).catch(() => setApps([]));
    const iv = setInterval(() => {
      api.userApplications(userId).then(setApps).catch(() => {});
    }, 12000);
    return () => clearInterval(iv);
  }, [userId]);

  if (!userId || apps.length === 0) return null;

  return (
    <div className="card pad app-history">
      <div className="row" style={{ gap: 8, marginBottom: 12 }}>
        <History size={18} />
        <h2 style={{ margin: 0, fontSize: "1rem" }}>{t("app_history")}</h2>
      </div>
      <div className="history-list">
        {apps.map((a) => (
          <div key={a.app_id} className="history-row">
            <div>
              <b>{a.scheme_key.toUpperCase()}</b>
              <span className={"pill " + (STATUS_CLASS[a.status] || "m")} style={{ marginLeft: 8 }}>
                {a.status}
              </span>
              <p className="sub" style={{ margin: "4px 0 0" }}>
                {fmt(a.amount)} · {a.confidence ? `${(a.confidence * 100).toFixed(0)}% conf` : "—"}
              </p>
            </div>
            <ChevronRight size={16} color="var(--muted)" />
          </div>
        ))}
      </div>
    </div>
  );
}
