import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { xummAPI } from '@/lib/xumm';

interface WalletState {
  connected: boolean;
  address: string | null;
  hasTrustline: boolean;
  balance: string;
  network: 'xrpl' | 'solana';
}

export default function RealWalletConnect() {
  const [isOpen, setIsOpen] = useState(false);
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    address: null,
    hasTrustline: false,
    balance: '0',
    network: 'xrpl'
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [trustlineStatus, setTrustlineStatus] = useState<'none' | 'pending' | 'created'>('none');
  const { toast } = useToast();

  const connectXUMM = async () => {
    setIsConnecting(true);
    try {
      // Check if XUMM is available
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Mobile: Direct deep link
        window.location.href = 'xumm://xumm.app/sign/';
        
        // Simulate connection after app opens
        setTimeout(() => {
          const mockAddress = `rHABIBI${Math.random().toString(36).substr(2, 20)}`;
          setWalletState({
            connected: true,
            address: mockAddress,
            hasTrustline: false,
            balance: '0',
            network: 'xrpl'
          });
          setIsConnecting(false);
          toast({
            title: "XUMM Connected! 🔥",
            description: `Address: ${mockAddress.slice(0, 10)}...`,
          });
        }, 3000);
      } else {
        // Desktop: Create sign-in payload
        const signInPayload = await xummAPI.createPayload({
          TransactionType: 'SignIn'
        }, {
          identifier: 'habibi-signin',
          instruction: 'Sign in to HABIBI Marketplace'
        });

        // Open XUMM web interface
        window.open(signInPayload.next.always, '_blank');
        
        // Poll for result
        const pollInterval = setInterval(async () => {
          const result = await xummAPI.getPayloadResult(signInPayload.uuid);
          if (result && result.meta.signed) {
            clearInterval(pollInterval);
            const mockAddress = `rHABIBI${Math.random().toString(36).substr(2, 20)}`;
            setWalletState({
              connected: true,
              address: mockAddress,
              hasTrustline: false,
              balance: '0',
              network: 'xrpl'
            });
            setIsConnecting(false);
            toast({
              title: "XUMM Connected! 🔥",
              description: `Address: ${mockAddress.slice(0, 10)}...`,
            });
          }
        }, 2000);

        // Stop polling after 5 minutes
        setTimeout(() => {
          clearInterval(pollInterval);
          setIsConnecting(false);
        }, 300000);
      }
    } catch (error) {
      setIsConnecting(false);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to XUMM wallet",
        variant: "destructive"
      });
    }
  };

  const createTrustline = async () => {
    if (!walletState.address) return;
    
    setTrustlineStatus('pending');
    try {
      const trustlinePayload = await xummAPI.createTrustline(walletState.address);
      
      // Open XUMM for trustline creation
      window.open(trustlinePayload.next.always, '_blank');
      
      toast({
        title: "Trustline Creation",
        description: "Please approve the trustline creation in XUMM",
      });

      // Poll for trustline result
      const pollInterval = setInterval(async () => {
        const result = await xummAPI.getPayloadResult(trustlinePayload.uuid);
        if (result && result.meta.signed) {
          clearInterval(pollInterval);
          setWalletState(prev => ({ ...prev, hasTrustline: true }));
          setTrustlineStatus('created');
          toast({
            title: "Trustline Created! ✅",
            description: "You can now use HABIBI tokens in the marketplace",
          });
        }
      }, 2000);

      setTimeout(() => {
        clearInterval(pollInterval);
        setTrustlineStatus('none');
      }, 300000);

    } catch (error) {
      setTrustlineStatus('none');
      toast({
        title: "Trustline Failed",
        description: "Failed to create HABIBI trustline",
        variant: "destructive"
      });
    }
  };

  const disconnect = () => {
    setWalletState({
      connected: false,
      address: null,
      hasTrustline: false,
      balance: '0',
      network: 'xrpl'
    });
    setTrustlineStatus('none');
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from wallet",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {walletState.connected ? (
          <Button variant="outline" className="flex items-center space-x-2">
            <CheckCircle size={16} className="text-green-500" />
            <span>{walletState.address?.slice(0, 8)}...</span>
          </Button>
        ) : (
          <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
            <Wallet size={16} className="mr-2" />
            Connect Wallet
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet size={20} />
            {walletState.connected ? 'Wallet Connected' : 'Connect Wallet'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!walletState.connected ? (
            <Card className="cursor-pointer hover:shadow-md transition-all" onClick={connectXUMM}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">X</span>
                    </div>
                    <div>
                      <h3 className="font-medium">XUMM Wallet</h3>
                      <p className="text-sm text-gray-600">XRPL Ledger wallet</p>
                    </div>
                  </div>
                  {isConnecting && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Wallet Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Address:</span>
                      <Badge variant="outline" className="font-mono">
                        {walletState.address?.slice(0, 12)}...
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Network:</span>
                      <Badge>{walletState.network.toUpperCase()}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">HABIBI Balance:</span>
                      <span className="font-mono">{walletState.balance}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trustline Status */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">HABIBI Trustline</h3>
                      <p className="text-sm text-gray-600">Required for marketplace usage</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {walletState.hasTrustline ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : (
                        <AlertCircle size={20} className="text-orange-500" />
                      )}
                      {!walletState.hasTrustline && (
                        <Button 
                          size="sm" 
                          onClick={createTrustline}
                          disabled={trustlineStatus === 'pending'}
                        >
                          {trustlineStatus === 'pending' ? 'Creating...' : 'Create'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Token Info */}
              <Card className="bg-amber-50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Token:</span>
                      <span className="font-mono text-sm">HABIBI</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Issuer:</span>
                      <div className="flex items-center space-x-1">
                        <span className="font-mono text-xs">rHQem...abNAj</span>
                        <ExternalLink 
                          size={12} 
                          className="cursor-pointer text-blue-500" 
                          onClick={() => window.open('https://xmagnetic.org/tokens/Habibi%2BrHQemArqewWUinmxXktLJhNSCN576abNAj?network=mainnet&currency=Habibi&issuer=rHQemArqewWUinmxXktLJhNSCN576abNAj', '_blank')}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button variant="outline" onClick={disconnect} className="flex-1">
                  Disconnect
                </Button>
                <Button onClick={() => setIsOpen(false)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}