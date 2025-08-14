import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wallet, ExternalLink, Zap, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { solanaAPI, SolanaWallet } from '@/lib/solana';

interface SolanaWalletConnectProps {
  onWalletChange?: (wallet: SolanaWallet | null) => void;
}

export default function SolanaWalletConnect({ onWalletChange }: SolanaWalletConnectProps) {
  const [wallet, setWallet] = useState<SolanaWallet | null>(null);
  const [availableWallets, setAvailableWallets] = useState<any[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [balances, setBalances] = useState({ sol: 0, habibi: 0 });
  const { toast } = useToast();

  useEffect(() => {
    // Detect available Solana wallets
    const wallets = solanaAPI.detectWallets();
    setAvailableWallets(wallets);

    // Auto-connect if previously connected
    const savedWallet = localStorage.getItem('connectedSolanaWallet');
    if (savedWallet) {
      connectWallet(savedWallet);
    }
  }, []);

  useEffect(() => {
    if (wallet?.publicKey) {
      updateBalances();
      const interval = setInterval(updateBalances, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [wallet]);

  const updateBalances = async () => {
    if (!wallet?.publicKey) return;

    try {
      const [solBalance, habibiBalance] = await Promise.all([
        solanaAPI.getBalance(wallet.publicKey),
        solanaAPI.getHabibiBalance(wallet.publicKey)
      ]);

      setBalances({ sol: solBalance, habibi: habibiBalance });
    } catch (error) {
      console.error('Failed to update balances:', error);
    }
  };

  const connectWallet = async (walletName: string) => {
    setIsConnecting(true);
    try {
      const connectedWallet = await solanaAPI.connectWallet(walletName);
      
      if (connectedWallet) {
        setWallet(connectedWallet);
        localStorage.setItem('connectedSolanaWallet', walletName);
        setShowWalletDialog(false);
        
        toast({
          title: "Solana Wallet Connected! ⚡",
          description: `Connected to ${walletName} on ${solanaAPI.NETWORK}`,
        });

        onWalletChange?.(connectedWallet);
      } else {
        throw new Error('Failed to connect wallet');
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to Solana wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (wallet?.disconnect) {
        await wallet.disconnect();
      }
      
      setWallet(null);
      setBalances({ sol: 0, habibi: 0 });
      localStorage.removeItem('connectedSolanaWallet');
      
      toast({
        title: "Wallet Disconnected",
        description: "Solana wallet has been disconnected",
      });

      onWalletChange?.(null);
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const copyAddress = () => {
    if (wallet?.publicKey) {
      navigator.clipboard.writeText(wallet.publicKey.toString());
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const requestAirdrop = async () => {
    if (!wallet?.publicKey || solanaAPI.NETWORK !== 'devnet') return;

    try {
      // Request SOL airdrop on devnet
      const signature = await solanaAPI.connection.requestAirdrop(
        wallet.publicKey,
        1000000000 // 1 SOL
      );

      await solanaAPI.connection.confirmTransaction(signature, 'confirmed');
      
      toast({
        title: "Airdrop Successful! 💰",
        description: "1 SOL has been added to your devnet wallet",
      });

      updateBalances();
    } catch (error) {
      toast({
        title: "Airdrop Failed",
        description: "Failed to request SOL airdrop",
        variant: "destructive"
      });
    }
  };

  if (wallet?.connected) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-purple-600" />
              <span>Solana Wallet</span>
              <Badge variant="outline" className="bg-purple-100 text-purple-700">
                {solanaAPI.NETWORK}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={disconnectWallet}>
              Disconnect
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wallet Address */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-mono text-sm">
                {wallet.publicKey?.toString().slice(0, 8)}...{wallet.publicKey?.toString().slice(-8)}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={copyAddress}>
                <Copy size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://explorer.solana.com/address/${wallet.publicKey?.toString()}?cluster=${solanaAPI.NETWORK}`, '_blank')}
              >
                <ExternalLink size={16} />
              </Button>
            </div>
          </div>

          {/* Balances */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg text-center">
              <p className="text-sm text-gray-600">SOL Balance</p>
              <p className="text-lg font-bold text-purple-600">
                {balances.sol.toFixed(4)}
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg text-center">
              <p className="text-sm text-gray-600">HABIBI Balance</p>
              <p className="text-lg font-bold text-purple-600">
                {balances.habibi.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Devnet Airdrop */}
          {solanaAPI.NETWORK === 'devnet' && (
            <Button
              onClick={requestAirdrop}
              variant="outline"
              className="w-full"
            >
              <Zap className="mr-2" size={16} />
              Request SOL Airdrop (Devnet)
            </Button>
          )}

          {/* Network Status */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <CheckCircle size={16} className="text-green-500" />
            <span>Connected to Solana {solanaAPI.NETWORK}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
          <Zap className="mr-2" size={16} />
          Connect Solana Wallet
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap size={20} className="text-purple-600" />
            Connect Solana Wallet
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center mb-4">
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              {solanaAPI.NETWORK} Network
            </Badge>
          </div>

          {availableWallets.length === 0 ? (
            <div className="text-center p-6">
              <Wallet size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">No Solana wallets detected</p>
              <p className="text-sm text-gray-500 mb-4">
                Please install a Solana wallet like Phantom or Solflare
              </p>
              <Button
                variant="outline"
                onClick={() => window.open('https://phantom.app/', '_blank')}
              >
                Install Phantom Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {availableWallets.map((walletInfo) => (
                <Button
                  key={walletInfo.name}
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => connectWallet(walletInfo.name)}
                  disabled={!walletInfo.installed || isConnecting}
                >
                  <div className="flex items-center">
                    <Wallet className="mr-2" size={16} />
                    {walletInfo.name}
                  </div>
                  {walletInfo.installed ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Installed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-500">
                      Not Found
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          )}

          {isConnecting && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Connecting to wallet...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}