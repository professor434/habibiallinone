// Mock Solana implementation for build compatibility
export interface SolanaWallet {
  publicKey: any;
  connected: boolean;
  signTransaction?: (transaction: any) => Promise<any>;
  signAllTransactions?: (transactions: any[]) => Promise<any[]>;
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
}

export interface SolanaNFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  collection?: string;
  mintType?: string;
  timestamp?: number;
  minter?: string;
}

class SolanaAPI {
  public readonly NETWORK = 'devnet';
  public readonly FEE_WALLET = '2WPrEmPFTWfG9WfMDd3W6SGYUvFeTgLbNpAwbJ5nvX4c';
  public readonly HABIBI_MINT = 'HabibiBR8zKdyKrytWcJpqR8VQ7NfCxZ5UbP2JkEemct';
  public readonly HABIBI_DECIMALS = 6;
  public connection = null;

  detectWallets() {
    return [
      { name: 'Phantom', installed: false, wallet: null },
      { name: 'Solflare', installed: false, wallet: null }
    ];
  }

  async connectWallet(walletName: string): Promise<SolanaWallet | null> {
    return null;
  }

  async getBalance(publicKey: any): Promise<number> {
    return 0;
  }

  async getHabibiBalance(publicKey: any): Promise<number> {
    return 0;
  }

  async transferHabibi(wallet: SolanaWallet, amount: number, memo?: string) {
    return { signature: '', success: false };
  }

  async mintNFT(wallet: SolanaWallet, metadata: SolanaNFTMetadata) {
    return { mintAddress: '', signature: '', success: false };
  }

  async getUserNFTs(publicKey: any): Promise<any[]> {
    return [];
  }
}

export const solanaAPI = new SolanaAPI();