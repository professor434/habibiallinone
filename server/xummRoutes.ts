import express from 'express'
import { XummSdk } from 'xumm-sdk'
import { convertStringToHex } from 'xrpl'

const router = express.Router()
const sdk = new XummSdk(process.env.XUMM_API_KEY!, process.env.XUMM_API_SECRET!)

const HABIBI_ISSUER = process.env.XRPL_HABIBI_ISSUER!
const HABIBI_CODE   = process.env.XRPL_HABIBI_CURRENCY || 'HBI'

// TrustSet
router.post('/xrpl/payload/trustset', async (req, res) => {
  const { account, limit = '1000000000' } = req.body
  const p = await sdk.payload.create({ txjson: { TransactionType: 'TrustSet', Account: account, LimitAmount: { currency: HABIBI_CODE, issuer: HABIBI_ISSUER, value: String(limit) } } })
  res.json(p)
})

// Payment
router.post('/xrpl/payload/payment', async (req, res) => {
  const { account, destination, amount } = req.body
  const p = await sdk.payload.create({ txjson: { TransactionType: 'Payment', Account: account, Destination: destination, Amount: { currency: HABIBI_CODE, issuer: HABIBI_ISSUER, value: String(amount) } } })
  res.json(p)
})

// NFTokenMint (URI/Memo -> hex)
router.post('/xrpl/payload/nftmint', async (req, res) => {
  const { account, ipfsUri, solanaMintAddr, transferFee = 0 } = req.body
  const p = await sdk.payload.create({
    txjson: {
      TransactionType: 'NFTokenMint',
      Account: account,
      URI: convertStringToHex(ipfsUri),
      NFTokenTaxon: 0,
      Flags: 8,
      TransferFee: transferFee,
      Memos: [{ Memo: { MemoType: convertStringToHex('solana_mint'), MemoData: convertStringToHex(String(solanaMintAddr || '')) } }]
    }
  })
  res.json(p)
})

// (Dev) status για polling (σε prod: webhooks/WS)
router.get('/xrpl/payload/:uuid', async (req, res) => {
  try { const s = await sdk.payload.get(req.params.uuid, true); res.json(s) }
  catch (e: any) { res.status(500).send(e?.message || 'xumm get failed') }
})

export default router
