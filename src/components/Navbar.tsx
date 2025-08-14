import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Trophy, Store, Gamepad2 } from 'lucide-react';
import RealWalletConnect from './RealWalletConnect';
import SolanaWalletConnect from './SolanaWalletConnect';
import DualChainToggle from './DualChainToggle';
import { SolanaWallet } from '@/lib/solana';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeChain: 'xrpl' | 'solana';
  onChainChange: (chain: 'xrpl' | 'solana') => void;
  xrplWallet: any;
  solanaWallet: SolanaWallet | null;
  onXrplWalletChange: (wallet: any) => void;
  onSolanaWalletChange: (wallet: SolanaWallet | null) => void;
}

export default function Navbar({ 
  activeTab, 
  setActiveTab,
  activeChain,
  onChainChange,
  xrplWallet,
  solanaWallet,
  onXrplWalletChange,
  onSolanaWalletChange
}: NavbarProps) {



  return (
    <nav className="border-b bg-gradient-to-r from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              HABIBI
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'marketplace' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('marketplace')}
              className="flex items-center space-x-2"
            >
              <Store size={16} />
              <span>Marketplace</span>
            </Button>
            <Button
              variant={activeTab === 'racing' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('racing')}
              className="flex items-center space-x-2"
            >
              <Gamepad2 size={16} />
              <span>Camel Racing</span>
            </Button>
            <Button
              variant={activeTab === 'collection' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('collection')}
              className="flex items-center space-x-2"
            >
              <Trophy size={16} />
              <span>My Collection</span>
            </Button>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-3">
            <DualChainToggle
              activeChain={activeChain}
              onChainChange={onChainChange}
              xrplConnected={!!xrplWallet}
              solanaConnected={!!solanaWallet?.connected}
            />
            {activeChain === 'xrpl' ? (
              <RealWalletConnect onWalletChange={onXrplWalletChange} />
            ) : (
              <SolanaWalletConnect onWalletChange={onSolanaWalletChange} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}