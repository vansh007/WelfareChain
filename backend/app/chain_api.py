"""Chain explorer helpers — live Hardhat reads for admin UI (SDD §4.3)."""
import json
import os

ART_PATH = os.path.join(os.path.dirname(__file__), "..", "chain_artifacts.json")

# Human-readable names for DisbursementController events
EVENT_LABELS = {
    "ApplicationRecorded": "Application recorded on-chain",
    "FlaggedForReview": "Flagged for human review",
    "ApplicationApproved": "Application approved",
    "TokenMinted": "Welfare token minted",
    "TokenConverted": "Token converted to fiat",
    "Disbursed": "Disbursement completed",
    "Rejected": "Application rejected",
    "UserRegistered": "Citizen wallet registered",
}


def _load_artifacts():
    if not os.path.exists(ART_PATH):
        return None
    with open(ART_PATH) as f:
        return json.load(f)


def chain_info(bridge) -> dict:
    art = _load_artifacts()
    base = {
        "live": bridge.live,
        "mode": "live" if bridge.live else "simulated",
        "rpc": art.get("rpc", "http://127.0.0.1:8545") if art else None,
        "contracts": art.get("addresses", {}) if art else {},
        "admin": art.get("adminAddress") if art else None,
        "block_number": None,
        "chain_id": None,
        "gas_price_gwei": None,
    }
    if not bridge.live or not bridge.w3:
        return base
    try:
        w3 = bridge.w3
        base["block_number"] = w3.eth.block_number
        base["chain_id"] = w3.eth.chain_id
        gp = w3.eth.gas_price
        base["gas_price_gwei"] = round(w3.from_wei(gp, "gwei"), 4)
    except Exception:  # noqa: BLE001
        pass
    return base


def get_transaction(bridge, tx_hash: str) -> dict:
    if not bridge.live or not bridge.w3:
        return {"found": False, "mode": "simulated", "tx_hash": tx_hash}
    w3 = bridge.w3
    try:
        tx = w3.eth.get_transaction(tx_hash)
        rcpt = w3.eth.get_transaction_receipt(tx_hash)
        if not tx:
            return {"found": False, "tx_hash": tx_hash}
        logs = []
        for log in rcpt.logs:
            entry = {
                "address": log.address,
                "topics": [w3.to_hex(t) for t in log.topics],
                "data": w3.to_hex(log.data),
            }
            logs.append(entry)
        return {
            "found": True,
            "tx_hash": tx_hash,
            "block": rcpt.blockNumber,
            "from": tx["from"],
            "to": tx.to,
            "gas_used": rcpt.gasUsed,
            "status": "success" if rcpt.status == 1 else "failed",
            "value_wei": str(tx.value),
            "logs": logs,
            "log_count": len(logs),
        }
    except Exception as e:  # noqa: BLE001
        return {"found": False, "tx_hash": tx_hash, "error": str(e)}


def get_recent_blocks(bridge, limit: int = 8) -> list:
    if not bridge.live or not bridge.w3:
        return []
    w3 = bridge.w3
    try:
        latest = w3.eth.block_number
        out = []
        for n in range(latest, max(latest - limit, -1), -1):
            blk = w3.eth.get_block(n, full_transactions=False)
            out.append({
                "number": n,
                "hash": w3.to_hex(blk.hash),
                "timestamp": blk.timestamp,
                "tx_count": len(blk.transactions),
                "gas_used": blk.gasUsed,
            })
        return out
    except Exception:  # noqa: BLE001
        return []


def get_controller_events(bridge, from_block: int | None = None, limit: int = 20) -> list:
    """Fetch recent DisbursementController + UserRegistry logs."""
    if not bridge.live or not bridge.w3 or not bridge.controller:
        return []
    w3 = bridge.w3
    try:
        latest = w3.eth.block_number
        start = from_block if from_block is not None else max(0, latest - 50)
        addresses = [bridge.controller.address]
        if bridge.users:
            addresses.append(bridge.users.address)
        logs = w3.eth.get_logs({
            "fromBlock": start,
            "toBlock": latest,
            "address": addresses,
        })
        events = []
        for log in reversed(logs[-limit:]):
            topic0 = w3.to_hex(log.topics[0]) if log.topics else ""
            # Try decode via contract ABI
            decoded_name = None
            decoded_args = {}
            for contract in (bridge.controller, bridge.users):
                if contract and log.address.lower() == contract.address.lower():
                    try:
                        evt = contract.events
                        for abi_entry in contract.abi:
                            if abi_entry.get("type") != "event":
                                continue
                            sig = w3.keccak(text=f"{abi_entry['name']}({','.join(i['type'] for i in abi_entry.get('inputs', []))})").hex()
                            if topic0.endswith(sig[2:]) or topic0 == "0x" + sig:
                                decoded_name = abi_entry["name"]
                                break
                    except Exception:  # noqa: BLE001
                        pass
            events.append({
                "block": log.blockNumber,
                "tx_hash": w3.to_hex(log.transactionHash),
                "event": decoded_name or EVENT_LABELS.get(topic0[:10], "Log"),
                "address": log.address,
                "topics": [w3.to_hex(t) for t in log.topics],
            })
        return events
    except Exception:  # noqa: BLE001
        return []
