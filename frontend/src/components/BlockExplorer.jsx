import React, { useEffect, useState } from "react";
import { Blocks, ExternalLink, RefreshCw, Copy, Check, Landmark } from "lucide-react";
import { api } from "../api.js";
import TxModal from "./TxModal.jsx";

export default function BlockExplorer({ t, loc }) {
  const [info, setInfo] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [events, setEvents] = useState([]);
  const [txModal, setTxModal] = useState(null);
  const [copied, setCopied] = useState("");

  const load = async () => {
    try {
      const [inf, bl, ev] = await Promise.all([
        api.chainInfo(), api.chainBlocks(6), api.chainEvents(12),
      ]);
      setInfo(inf);
      setBlocks(bl.blocks || []);
      setEvents(ev.events || []);
    } catch { /* offline */ }
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 8000);
    return () => clearInterval(iv);
  }, []);

  const copy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  const live = info?.live;

  return (
    <div className="card pad block-explorer" style={{ marginBottom: 16 }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <div className="row">
          <Landmark size={20} />
          <div>
            <h2 style={{ margin: 0 }}>{t("explorer_h")}</h2>
            <p className="sub">{t("explorer_s")}</p>
          </div>
        </div>
        <button type="button" className="btn ghost" onClick={load}><RefreshCw size={14} /></button>
      </div>

      <div className="explorer-stats">
        <div className="ex-stat">
          <span className="sub">{t("chain_mode")}</span>
          <strong className={live ? "live-text" : ""}>{live ? t("chain_live") : t("chain_sim")}</strong>
        </div>
        {info?.block_number != null && (
          <div className="ex-stat">
            <span className="sub">{t("block_num")}</span>
            <strong>#{info.block_number}</strong>
          </div>
        )}
        {info?.chain_id != null && (
          <div className="ex-stat">
            <span className="sub">Chain ID</span>
            <strong>{info.chain_id}</strong>
          </div>
        )}
        {info?.gas_price_gwei != null && (
          <div className="ex-stat">
            <span className="sub">Gas</span>
            <strong>{info.gas_price_gwei} gwei</strong>
          </div>
        )}
      </div>

      {info?.contracts && (
        <div className="contracts-grid">
          {Object.entries(info.contracts).map(([name, addr]) => (
            <div key={name} className="contract-row">
              <span className="contract-name">{name}</span>
              <code className="mono contract-addr">{addr.slice(0, 10)}…{addr.slice(-6)}</code>
              <button type="button" className="icon-btn-sm" onClick={() => copy(addr)} title="Copy">
                {copied === addr ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          ))}
        </div>
      )}

      {live && blocks.length > 0 && (
        <>
          <h3 className="ex-section"><Blocks size={15} /> {t("recent_blocks")}</h3>
          <div className="block-list">
            {blocks.map((b) => (
              <div key={b.number} className="block-row">
                <strong>#{b.number}</strong>
                <span>{b.tx_count} tx</span>
                <span className="mono sub">{b.hash?.slice(0, 14)}…</span>
              </div>
            ))}
          </div>
        </>
      )}

      {live && events.length > 0 && (
        <>
          <h3 className="ex-section">{t("chain_events")}</h3>
          <div className="event-list">
            {events.map((e, i) => (
              <button key={i} type="button" className="event-row" onClick={() => setTxModal(e.tx_hash)}>
                <span className="pill g" style={{ fontSize: 10 }}>block #{e.block}</span>
                <span className="mono event-tx">{e.tx_hash?.slice(0, 18)}…</span>
                <ExternalLink size={12} />
              </button>
            ))}
          </div>
        </>
      )}

      {!live && (
        <p className="note">{t("explorer_sim_note")}</p>
      )}

      {txModal && <TxModal txHash={txModal} onClose={() => setTxModal(null)} t={t} loc={loc} />}
    </div>
  );
}
