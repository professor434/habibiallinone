import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Zap, Waves, Trophy, Timer } from 'lucide-react';
import { SolanaWallet } from '@/lib/solana';

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  collection?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  mintedAt: string;
  blockchain: 'xrpl' | 'solana';
  mintAddress?: string;
  txHash?: string;
  signature?: string;
}

interface DualChainCollectionProps {
  xrplWallet: any;
  solanaWallet: SolanaWallet | null;
  activeChain: 'xrpl' | 'solana';
}

export default function DualChainCollection({ 
  xrplWallet, 
  solanaWallet, 
  activeChain 
}: DualChainCollectionProps) {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNFTs();
  }, [xrplWallet, solanaWallet]);

  const loadNFTs = async () => {
    setLoading(true);
    try {
      const allNFTs: NFT[] = [];

      // Load XRPL NFTs
      const xrplNFTs = JSON.parse(localStorage.getItem('mintedNFTs') || '[]');
      allNFTs.push(...xrplNFTs.map((nft: any) => ({
        ...nft,
        blockchain: 'xrpl' as const
      })));

      // Load Solana NFTs
      const solanaNFTs = JSON.parse(localStorage.getItem('solanaNFTs') || '[]');
      allNFTs.push(...solanaNFTs.map((nft: any) => ({
        ...nft,
        blockchain: 'solana' as const
      })));

      setNFTs(allNFTs);
    } catch (error) {
      console.error('Failed to load NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChainIcon = (blockchain: 'xrpl' | 'solana') => {
    return blockchain === 'xrpl' ? <Waves size={16} /> : <Zap size={16} />;
  };

  const getChainColor = (blockchain: 'xrpl' | 'solana') => {
    return blockchain === 'xrpl' ? 'bg-amber-500' : 'bg-purple-500';
  };

  const openTransaction = (nft: NFT) => {
    if (nft.blockchain === 'xrpl' && nft.txHash) {
      window.open(`https://livenet.xrpl.org/transactions/${nft.txHash}`, '_blank');
    } else if (nft.blockchain === 'solana' && nft.signature) {
      window.open(`https://explorer.solana.com/tx/${nft.signature}?cluster=devnet`, '_blank');
    }
  };

  const filterNFTs = (blockchain?: 'xrpl' | 'solana') => {
    return blockchain ? nfts.filter(nft => nft.blockchain === blockchain) : nfts;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Collection...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy size={20} />
          Multi-Chain NFT Collection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All Chains ({nfts.length})
            </TabsTrigger>
            <TabsTrigger value="xrpl" className="flex items-center gap-1">
              <Waves size={14} />
              XRPL ({filterNFTs('xrpl').length})
            </TabsTrigger>
            <TabsTrigger value="solana" className="flex items-center gap-1">
              <Zap size={14} />
              Solana ({filterNFTs('solana').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <NFTGrid nfts={nfts} onTransactionClick={openTransaction} />
          </TabsContent>

          <TabsContent value="xrpl" className="mt-6">
            <NFTGrid nfts={filterNFTs('xrpl')} onTransactionClick={openTransaction} />
          </TabsContent>

          <TabsContent value="solana" className="mt-6">
            <NFTGrid nfts={filterNFTs('solana')} onTransactionClick={openTransaction} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface NFTGridProps {
  nfts: NFT[];
  onTransactionClick: (nft: NFT) => void;
}

function NFTGrid({ nfts, onTransactionClick }: NFTGridProps) {
  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-2">No NFTs found</p>
        <p className="text-sm text-gray-500">Start minting to build your collection</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {nfts.map((nft) => (
        <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg';
              }}
            />
            <Badge 
              className={`absolute top-2 right-2 ${getChainColor(nft.blockchain)} text-white`}
            >
              {getChainIcon(nft.blockchain)}
              <span className="ml-1">{nft.blockchain.toUpperCase()}</span>
            </Badge>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-bold text-lg">{nft.name}</h3>
              
              {nft.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {nft.description}
                </p>
              )}

              {nft.collection && (
                <Badge variant="outline" className="text-xs">
                  {nft.collection}
                </Badge>
              )}

              {/* Attributes */}
              {nft.attributes && nft.attributes.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">Attributes:</p>
                  <div className="flex flex-wrap gap-1">
                    {nft.attributes.slice(0, 3).map((attr, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {attr.trait_type}: {attr.value}
                      </Badge>
                    ))}
                    {nft.attributes.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{nft.attributes.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Mint Date */}
              <div className="flex items-center text-xs text-gray-500">
                <Timer size={12} className="mr-1" />
                Minted {new Date(nft.mintedAt).toLocaleDateString()}
              </div>

              {/* Transaction Link */}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onTransactionClick(nft)}
              >
                <ExternalLink size={14} className="mr-1" />
                View Transaction
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}