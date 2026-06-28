import React, { useEffect, useState } from "react";
import { X, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { api } from "../api.js";

export default function TxModal({ txHash, onClose, t }) {
  const [tx, setTx] = useState(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    setBusy(true);
    api.chainTx(txHash).then(setTx).finally(() => setBusy(false));
  }, [txHash]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal card pad" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>{t("tx_detail")}</h2>
          <button type="button" className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        {busy && <Loader2 size={24} className="spin" />}
        {!busy && tx && (
          <>
            <p className="mono tx-full">{txHash}</p>
            {!tx.found ? (
              <p className="note">{t("tx_not_found")}</p>
            ) : (
              <div className="tx-grid">
                <div><span className="sub">{t("block_num")}</span><strong>#{tx.block}</strong></div>
                <div><span className="sub">Status</span>
                  <strong className={tx.status === "success" ? "live-text" : "alert-text"}>
                    {tx.status === "success" ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {tx.status}
                  </strong>
                </div>
                <div><span className="sub">From</span><code className="mono">{tx.from?.slice(0, 14)}…</code></div>
                <div><span className="sub">To</span><code className="mono">{tx.to?.slice(0, 14)}…</code></div>
                <div><span className="sub">Gas used</span><strong>{tx.gas_used?.toLocaleString()}</strong></div>
                <div><span className="sub">Logs</span><strong>{tx.log_count}</strong></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
