// src/lib/xrplUnified.ts
import { isInstalled as isGemInstalled, submitTransaction as gemSubmit } from '@gemwallet/api'
import sdk from '@crossmarkio/sdk'

// Optional: δικός σου XUMM client (backend routes)
const API_BASE = (import.meta as any)?.env?.VITE_API_BASE?.replace(/\/+$/, '') || '/api'
async function xummPost<T>(path: string, body: any): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) })
  if (!r.ok) throw new Error(await r.text())
  return r.json() as Promise<T>
}
type XummCreate = { uuid: string; next: { always: string }, refs?: { qr_png?: string } }

// helpers
const toHex = (s: string) => Buffer.from(s, 'utf8').toString('hex')

async function tryGem(): Promise<boolean> {
  const check = await isGemInstalled()
  return Boolean(check?.result?.isInstalled)
}
async function tryCrossmark(): Promise<boolean> {
  try { return await sdk.methods.isInstalled() } catch { return false }
}

// ---------- PUBLIC API (ίδια signature και για τα 3 μονοπάτια) ----------
export async function xrplTrustSetHABIBI(issuer: string, code = 'HBI', limit = '1000000000') {
  if (await tryGem()) {
    const tx = { TransactionType: 'TrustSet', LimitAmount: { currency: code, issuer, value: String(limit) } }
    const r = await gemSubmit({ transaction: tx }); if (r.type !== 'response') throw new Error('User rejected'); return r.result?.hash
  }
  if (await tryCrossmark()) {
    const { response } = await sdk.methods.signAndSubmitAndWait({ TransactionType: 'TrustSet', LimitAmount: { currency: code, issuer, value: String(limit) } })
    return (response as any)?.data?.resp?.result?.hash
  }
  // Fallback: XUMM (backend)
  const p = await xummPost<XummCreate>('/xrpl/payload/trustset', { account: undefined, limit })
  window.open(p.next.always, '_blank', 'noopener,noreferrer'); return p.uuid // επιστρέφω uuid για tracking
}

export async function xrplPaymentHABIBI(issuer: string, dest: string, amount: string, code = 'HBI') {
  if (await tryGem()) {
    const tx = { TransactionType: 'Payment', Destination: dest, Amount: { currency: code, issuer, value: String(amount) } }
    const r = await gemSubmit({ transaction: tx }); if (r.type !== 'response') throw new Error('User rejected'); return r.result?.hash
  }
  if (await tryCrossmark()) {
    const { response } = await sdk.methods.signAndSubmitAndWait({ TransactionType: 'Payment', Destination: dest, Amount: { currency: code, issuer, value: String(amount) } })
    return (response as any)?.data?.resp?.result?.hash
  }
  const p = await xummPost<XummCreate>('/xrpl/payload/payment', { account: undefined, destination: dest, amount })
  window.open(p.next.always, '_blank', 'noopener,noreferrer'); return p.uuid
}

export async function xrplNftMint(ipfsUri: string, solanaMint: string, transferFee = 0) {
  const tx = {
    TransactionType: 'NFTokenMint',
    URI: toHex(ipfsUri), NFTokenTaxon: 0, Flags: 8, TransferFee: transferFee,
    Memos: [{ Memo: { MemoType: toHex('solana_mint'), MemoData: toHex(solanaMint) } }]
  }
  if (await tryGem()) {
    const r = await gemSubmit({ transaction: tx }); if (r.type !== 'response') throw new Error('User rejected'); return r.result?.hash
  }
  if (await tryCrossmark()) {
    const { response } = await sdk.methods.signAndSubmitAndWait(tx as any)
    return (response as any)?.data?.resp?.result?.hash
  }
  const p = await xummPost<XummCreate>('/xrpl/payload/nftmint', { account: undefined, ipfsUri, solanaMintAddr: solanaMint, transferFee })
  window.open(p.next.always, '_blank', 'noopener,noreferrer'); return p.uuid
}
