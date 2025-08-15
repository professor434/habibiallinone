// src/pages/Index.tsx
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Marketplace from '@/components/Marketplace';
import CamelRacing from '@/components/CamelRacing';
import RealCollection from '@/components/RealCollection';
import type { SolanaWallet } from '@/lib/solana';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'marketplace'|'racing'|'collection'>('marketplace');
  const [activeChain, setActiveChain] = useState<'xrpl' | 'solana'>('xrpl');
  const [xrplWallet, setXrplWallet] = useState<any>(null);
  const [solanaWallet, setSolanaWallet] = useState<SolanaWallet | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'marketplace': return <Marketplace />;
      case 'racing':      return <CamelRacing />;
      case 'collection':  return <RealCollection />;
      default:            return <Marketplace />;
    }
  };

  return (
    <div style={{
      backgroundImage: activeChain === 'xrpl'
        ? 'url(/assets/habibi-bg-1.jpg)'
        : 'url(/assets/habibi-bg-2.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="min-h-screen bg-black/20 backdrop-blur-[2px]">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeChain={activeChain}
          onChainChange={setActiveChain}
          xrplWallet={xrplWallet}
          solanaWallet={solanaWallet}
          onXrplWalletChange={setXrplWallet}
          onSolanaWalletChange={setSolanaWallet}
        />
        <div className="bg-white/95 backdrop-blur-sm min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
