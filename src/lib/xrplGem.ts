// GemWallet SDK (frontend)
import { isInstalled, submitTransaction } from '@gemwallet/api';

const toHex = (s: string) => Buffer.from(s, 'utf8').toString('hex');

// παραδείγματα για HABIBI IOU & XLS-20

export async function xrplTrustSetHABIBI(issuer: string, code = 'HBI', limit = '1000000000') {
  await requireGem();
  const tx = {
    TransactionType: 'TrustSet',
    LimitAmount: { currency: code, issuer, value: String(limit) },
  };
  const r = await submitTransaction({ transaction: tx });
  if (r.type !== 'response') throw new Error('User rejected');
  return r.result?.hash;
}

export async function xrplPaymentHABIBI(issuer: string, dest: string, amount: string, code = 'HBI') {
  await requireGem();
  const tx = {
    TransactionType: 'Payment',
    Destination: dest,
    Amount: { currency: code, issuer, value: String(amount) },
  };
  const r = await submitTransaction({ transaction: tx });
  if (r.type !== 'response') throw new Error('User rejected');
  return r.result?.hash;
}

export async function xrplNftMint(ipfsUri: string, solanaMint: string, transferFee = 0) {
  await requireGem();
  const tx = {
    TransactionType: 'NFTokenMint',
    URI: toHex(ipfsUri),              // <- υποχρεωτικά hex
    NFTokenTaxon: 0,
    Flags: 8,                         // tfTransferable
    TransferFee: transferFee,         // 0..50000 (0..50%)
    Memos: [{ Memo: { MemoType: toHex('solana_mint'), MemoData: toHex(solanaMint) } }],
  };
  const r = await submitTransaction({ transaction: tx });
  if (r.type !== 'response') throw new Error('User rejected');
  return r.result?.hash;              // tx hash
}

async function requireGem() {
  const check = await isInstalled();
  if (!check?.result?.isInstalled) throw new Error('GemWallet not installed');
}
