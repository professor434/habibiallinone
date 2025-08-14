import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Download, CheckCircle2, AlertCircle } from 'lucide-react';

interface WalletStatus {
  name: string;
  installed: boolean;
  supported: boolean;
  downloadUrl: string;
  icon: string;
  network: string;
}

export default function WalletDetection() {
  const [wallets, setWallets] = useState<WalletStatus[]>([]);

  useEffect(() => {
    const detectWallets = () => {
      const walletStatuses: WalletStatus[] = [
        {
          name: 'XUMM',
          installed: typeof window !== 'undefined' && !!window.xumm,
          supported: true,
          downloadUrl: 'https://xumm.app/download',
          icon: '🔥',
          network: 'XRPL'
        },
        {
          name: 'Phantom',
          installed: typeof window !== 'undefined' && (!!window.solana || !!window.phantom),
          supported: true,
          downloadUrl: 'https://phantom.app/download',
          icon: '👻',
          network: 'Solana'
        },
        {
          name: 'Crossmark',
          installed: typeof window !== 'undefined' && !!(window as any).crossmark,
          supported: true,
          downloadUrl: 'https://chrome.google.com/webstore/detail/crossmark/apjkkbkdakbdagpbocadcjjiempgjcef',
          icon: '❌',
          network: 'XRPL'
        },
        {
          name: 'Solflare',
          installed: typeof window !== 'undefined' && !!(window as any).solflare,
          supported: true,
          downloadUrl: 'https://solflare.com/download',
          icon: '☀️',
          network: 'Solana'
        }
      ];
      
      setWallets(walletStatuses);
    };

    detectWallets();
    
    // Re-check wallet status periodically
    const interval = setInterval(detectWallets, 2000);
    return () => clearInterval(interval);
  }, []);

  const installedWallets = wallets.filter(w => w.installed);
  const availableWallets = wallets.filter(w => !w.installed);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Wallet Detection</h2>
        <p className="text-gray-600">Connect your crypto wallets to access HABIBI Marketplace</p>
      </div>

      {/* Installed Wallets */}
      {installedWallets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={20} />
              Detected Wallets ({installedWallets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {installedWallets.map((wallet) => (
                <div
                  key={wallet.name}
                  className="flex items-center justify-between p-4 border rounded-lg bg-green-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wallet.icon}</span>
                    <div>
                      <h3 className="font-semibold">{wallet.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {wallet.network}
                      </Badge>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    Ready
                  </Badge>
                </div>
              ))}
            </div>
            
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Great! You can now connect to HABIBI Marketplace using your installed wallets.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Available Wallets to Install */}
      {availableWallets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle size={20} />
              Install Wallets ({availableWallets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableWallets.map((wallet) => (
                <div
                  key={wallet.name}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl opacity-50">{wallet.icon}</span>
                    <div>
                      <h3 className="font-semibold">{wallet.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {wallet.network}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(wallet.downloadUrl, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Download size={14} />
                    Install
                    <ExternalLink size={12} />
                  </Button>
                </div>
              ))}
            </div>
            
            <Alert className="mt-4 border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-700">
                Install these wallets to access all features of HABIBI Marketplace. After installation, refresh this page.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Connect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">For XRPL (XRP Ledger):</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Install XUMM mobile app or Crossmark browser extension</li>
              <li>• Create or import your XRPL account</li>
              <li>• Click connect and approve the connection</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">For Solana:</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Install Phantom or Solflare wallet</li>
              <li>• Create or import your Solana account</li>
              <li>• Click connect and approve the connection</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}