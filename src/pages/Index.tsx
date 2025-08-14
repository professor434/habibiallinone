import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Marketplace from '@/components/Marketplace';
import CamelRacing from '@/components/CamelRacing';
import RealCollection from '@/components/RealCollection';

export default function Index() {
  const [activeTab, setActiveTab] = useState('marketplace');

  const renderContent = () => {
    switch (activeTab) {
      case 'marketplace':
        return <Marketplace />;
      case 'racing':
        return <CamelRacing />;
      case 'collection':
        return <RealCollection />;
      default:
        return <Marketplace />;
    }
  };

  return (
    <div className="min-h-screen" 
         style={{
           backgroundImage: activeTab === 'marketplace' 
             ? 'url(/assets/habibi-bg-1.jpg)' 
             : 'url(/assets/habibi-bg-2.jpg)',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      <div className="min-h-screen bg-black/20 backdrop-blur-[2px]">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="bg-white/95 backdrop-blur-sm min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
