import { useCallback, useMemo } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token'

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { mplTokenMetadata, createV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { some } from '@metaplex-foundation/umi'

const HABIBI_MINT = new PublicKey(import.meta.env.VITE_HABIBI_MINT!)
const HABIBI_DECIMALS = Number(import.meta.env.VITE_HABIBI_DECIMALS || 6)
const FEE_TREASURY = new PublicKey(import.meta.env.VITE_HABIBI_TREASURY!)
const RPC = import.meta.env.VITE_SOLANA_RPC!

function toUnits(v: number | string, decimals = 6) {
  const s = String(v); const [i, f = ''] = s.split('.')
  const frac = (f + '0'.repeat(decimals)).slice(0, decimals)
  return BigInt(i + frac)
}

export function useSolanaFeeAndMint() {
  const { connection } = useConnection()
  const { wallet, publicKey, signTransaction } = useWallet()

  const umi = useMemo(() => {
    if (!wallet?.adapter) return null
    return createUmi(RPC).use(walletAdapterIdentity(wallet.adapter)).use(mplTokenMetadata())
  }, [wallet])

  const mintNftWithFee = useCallback(async (args: {
    feeAmount: string | number
    name: string
    symbol: string
    uri: string
    sellerFeeBps?: number
  }) => {
    if (!publicKey || !signTransaction) throw new Error('Wallet not connected')
    if (!umi) throw new Error('UMI not ready')

    // 1) HABIBI app-level fee (SPL transfer)
    const fromAta = await getAssociatedTokenAddress(HABIBI_MINT, publicKey)
    const toAta   = await getAssociatedTokenAddress(HABIBI_MINT, FEE_TREASURY)
    const feeUnits = Number(toUnits(args.feeAmount, HABIBI_DECIMALS))
    const feeIx = createTransferInstruction(fromAta, toAta, publicKey, feeUnits)
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
    const feeTx = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight }).add(feeIx)
    const stx = await signTransaction(feeTx)
    const feeSig = await connection.sendRawTransaction(stx.serialize(), { skipPreflight: false })
    await connection.confirmTransaction({ signature: feeSig, blockhash, lastValidBlockHeight }, 'confirmed')

    // 2) NFT mint (Metaplex Token Metadata – Create V1)
    await createV1(umi, {
      name: args.name,
      symbol: args.symbol,
      uri: args.uri,
      sellerFeeBasisPoints: args.sellerFeeBps ?? 0,
      tokenStandard: TokenStandard.NonFungible,
      isMutable: some(true),
    }).sendAndConfirm(umi)

    return { feeSig }
  }, [publicKey, signTransaction, connection, umi])

  return { mintNftWithFee }
}
