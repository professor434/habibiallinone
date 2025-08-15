import { xrplTrustSetHABIBI, xrplPaymentHABIBI, xrplNftMint } from '@/lib/xrplUnified'

async function openTrustline() {
  const hashOrUuid = await xrplTrustSetHABIBI('rHQemArqewWUinmxXktLJhNSCN576abNAj', 'HBI', '1000000000')
  console.log('submitted:', hashOrUuid)
}
async function payFeeToEscrow() {
  const hashOrUuid = await xrplPaymentHABIBI('rHQemArqewWUinmxXktLJhNSCN576abNAj', 'rE4LR4qzzYt8xjRuqQecszGsoLKjUDYu7f', '10')
  console.log('submitted:', hashOrUuid)
}
async function mintXrplNft(ipfsUri: string, solMint: string) {
  const hashOrUuid = await xrplNftMint(ipfsUri, solMint, 0)
  console.log('submitted:', hashOrUuid)
}
