"""Blockchain bridge (SDD §4.3).
Connects to the local Hardhat chain using addresses/ABIs exported by
chain/scripts/deploy.js into backend/chain_artifacts.json.

If the chain is unreachable (or not deployed yet) the bridge switches to
LEDGER SIMULATION mode: the same lifecycle is recorded with simulated tx
hashes so the whole platform keeps working. Every event — real or simulated —
is mirrored into the wc_ledger table, which is what the admin UI renders.
"""
import json
import os
import secrets

ART_PATH = os.path.join(os.path.dirname(__file__), "..", "chain_artifacts.json")


def _sim_hash():
    return "0x" + secrets.token_hex(32)


class ChainBridge:
    def __init__(self):
        self.live = False
        self.w3 = None
        self.controller = None
        self.users = None
        self.scheme_ids = {}
        self._connect()

    # ---------------- connection ----------------
    def _connect(self):
        try:
            if not os.path.exists(ART_PATH):
                print("[chain] chain_artifacts.json not found -> SIMULATION mode "
                      "(run `npm run deploy` in chain/ for real on-chain mode)")
                return
            with open(ART_PATH) as f:
                art = json.load(f)

            from web3 import Web3
            rpc = os.getenv("CHAIN_RPC", art.get("rpc", "http://127.0.0.1:8545"))
            w3 = Web3(Web3.HTTPProvider(rpc, request_kwargs={"timeout": 4}))
            if not w3.is_connected():
                print(f"[chain] RPC {rpc} unreachable -> SIMULATION mode")
                return

            self.w3 = w3
            self.admin = art["adminAddress"]
            w3.eth.default_account = self.admin  # hardhat unlocked account
            self.controller = w3.eth.contract(
                address=art["addresses"]["DisbursementController"],
                abi=art["abis"]["DisbursementController"])
            self.users = w3.eth.contract(
                address=art["addresses"]["UserRegistry"],
                abi=art["abis"]["UserRegistry"])
            self.scheme_ids = art["schemeIds"]
            self.live = True
            print(f"[chain] LIVE on {rpc} | controller={self.controller.address}")
        except Exception as e:  # noqa: BLE001
            print(f"[chain] init failed ({e}) -> SIMULATION mode")
            self.live = False

    def _send(self, fn):
        """Send a tx via the unlocked hardhat admin account; return (tx_hash, block)."""
        tx_hash = fn.transact({"from": self.admin})
        rcpt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return self.w3.to_hex(tx_hash), rcpt.blockNumber

    def _keccak_id(self, app_id: str):
        from web3 import Web3
        return Web3.keccak(text=app_id)

    # ---------------- operations (each returns a list of ledger events) ----------------
    def register_user(self, user_id: str, aadhaar_mock: str):
        """Register identity commitment; returns (wallet_address, commitment_hex, events)."""
        if self.live:
            from web3 import Web3
            commitment = Web3.keccak(text=f"{aadhaar_mock}:{user_id}:salt")
            acct = self.w3.eth.account.create()
            wallet = acct.address
            txh, blk = self._send(self.users.functions.register(commitment, wallet))
            ev = [("UserRegistered", {"wallet": wallet[:10] + "…"}, txh, blk, True)]
            return wallet, commitment.hex(), ev
        wallet = "0x" + secrets.token_hex(20)
        commitment = "0x" + secrets.token_hex(32)
        return wallet, commitment, [("UserRegistered", {"wallet": wallet[:10] + "…"}, _sim_hash(), 0, False)]

    def record_verification(self, app_id, citizen_wallet, scheme_key, confidence, passed, reason):
        events = []
        conf_bps = max(0, min(10000, int(confidence * 10000)))
        if self.live:
            sid = self.scheme_ids.get(scheme_key, 1)
            txh, blk = self._send(self.controller.functions.recordVerifiedApplication(
                self._keccak_id(app_id), citizen_wallet, sid, conf_bps, passed, reason or ""))
            events.append(("ApplicationRecorded",
                           {"scheme": scheme_key, "conf": f"{confidence*100:.1f}%"}, txh, blk, True))
            if not passed:
                events.append(("FlaggedForReview", {"reason": reason}, txh, blk, True))
            return events
        events.append(("ApplicationRecorded",
                       {"scheme": scheme_key, "conf": f"{confidence*100:.1f}%"}, _sim_hash(), 0, False))
        if not passed:
            events.append(("FlaggedForReview", {"reason": reason}, _sim_hash(), 0, False))
        return events

    def approve_and_disburse(self, app_id, scheme_key, amount):
        """approve -> disburse (mint, convert/burn, Disbursed). Returns events."""
        if self.live:
            events = []
            txh, blk = self._send(self.controller.functions.approveAndAuthorize(self._keccak_id(app_id)))
            events.append(("ApplicationApproved", {"amount": f"₹{amount:,}"}, txh, blk, True))
            txh, blk = self._send(self.controller.functions.disburse(self._keccak_id(app_id)))
            events += [
                ("TokenMinted", {"amount": f"{amount} WLFR"}, txh, blk, True),
                ("TokenConverted", {"amount": f"{amount} WLFR → ₹{amount:,}"}, txh, blk, True),
                ("Disbursed", {"amount": f"₹{amount:,}", "scheme": scheme_key}, txh, blk, True),
            ]
            return events
        h = _sim_hash()
        return [
            ("ApplicationApproved", {"amount": f"₹{amount:,}"}, _sim_hash(), 0, False),
            ("TokenMinted", {"amount": f"{amount} WLFR"}, h, 0, False),
            ("TokenConverted", {"amount": f"{amount} WLFR → ₹{amount:,}"}, h, 0, False),
            ("Disbursed", {"amount": f"₹{amount:,}", "scheme": scheme_key}, _sim_hash(), 0, False),
        ]

    def resolve_review(self, app_id, approve: bool, reason: str):
        if self.live:
            txh, blk = self._send(self.controller.functions.resolveReview(
                self._keccak_id(app_id), approve, reason or ""))
            action = "ApplicationRecorded" if approve else "Rejected"
            return [(action, {"via": "human_review", "reason": reason}, txh, blk, True)]
        action = "ApplicationRecorded" if approve else "Rejected"
        return [(action, {"via": "human_review", "reason": reason}, _sim_hash(), 0, False)]


bridge = ChainBridge()
