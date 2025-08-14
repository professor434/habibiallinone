import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Waves } from 'lucide-react';

interface DualChainToggleProps {
  activeChain: 'xrpl' | 'solana';
  onChainChange: (chain: 'xrpl' | 'solana') => void;
  xrplConnected: boolean;
  solanaConnected: boolean;
}

export default function DualChainToggle({ 
  activeChain, 
  onChainChange, 
  xrplConnected, 
  solanaConnected 
}: DualChainToggleProps) {
  return (
    <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-700">Active Blockchain</h3>
          <Badge 
            variant={activeChain === 'xrpl' ? 'default' : 'outline'}
            className={activeChain === 'xrpl' ? 'bg-amber-500' : 'bg-purple-500'}
          >
            {activeChain === 'xrpl' ? 'XRPL' : 'Solana'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* XRPL Chain */}
          <Button
            variant={activeChain === 'xrpl' ? 'default' : 'outline'}
            className={`flex flex-col items-center space-y-2 h-auto py-3 ${
              activeChain === 'xrpl' 
                ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                : 'hover:bg-amber-50'
            }`}
            onClick={() => onChainChange('xrpl')}
            disabled={!xrplConnected}
          >
            <Waves size={20} />
            <div className="text-center">
              <div className="font-medium">XRPL</div>
              <div className="text-xs opacity-75">
                {xrplConnected ? 'Connected' : 'Not Connected'}
              </div>
            </div>
          </Button>

          {/* Solana Chain */}
          <Button
            variant={activeChain === 'solana' ? 'default' : 'outline'}
            className={`flex flex-col items-center space-y-2 h-auto py-3 ${
              activeChain === 'solana' 
                ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                : 'hover:bg-purple-50'
            }`}
            onClick={() => onChainChange('solana')}
            disabled={!solanaConnected}
          >
            <Zap size={20} />
            <div className="text-center">
              <div className="font-medium">Solana</div>
              <div className="text-xs opacity-75">
                {solanaConnected ? 'Connected' : 'Not Connected'}
              </div>
            </div>
          </Button>
        </div>

        {/* Chain Benefits */}
        <div className="mt-4 text-xs text-gray-600">
          {activeChain === 'xrpl' ? (
            <div className="space-y-1">
              <p>• Enterprise-grade blockchain</p>
              <p>• Low energy consumption</p>
              <p>• Built-in DEX functionality</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p>• Lightning-fast transactions</p>
              <p>• Ultra-low fees (~$0.001)</p>
              <p>• Rich NFT ecosystem</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}