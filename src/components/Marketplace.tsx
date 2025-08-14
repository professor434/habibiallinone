import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, ShoppingCart, Heart } from 'lucide-react';
import RealMintDialog from './RealMintDialog';

interface NFT {
  id: string;
  name: string;
  image: string;
  price: number;
  chain: 'xrpl' | 'solana';
  collection: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChain, setFilterChain] = useState<string>('all');
  const [filterRarity, setFilterRarity] = useState<string>('all');

  // Mock NFT data
  const nfts: NFT[] = [
    {
      id: '1',
      name: 'Desert Storm Camel',
      image: '/api/placeholder/300/300',
      price: 50,
      chain: 'xrpl',
      collection: 'Racing Camels',
      rarity: 'legendary'
    },
    {
      id: '2',
      name: 'Swift Runner',
      image: '/api/placeholder/300/300',
      price: 25,
      chain: 'solana',
      collection: 'Racing Camels',
      rarity: 'rare'
    },
    {
      id: '3',
      name: 'Golden Nomad',
      image: '/api/placeholder/300/300',
      price: 75,
      chain: 'xrpl',
      collection: 'Premium Camels',
      rarity: 'epic'
    },
    {
      id: '4',
      name: 'Sand Walker',
      image: '/api/placeholder/300/300',
      price: 15,
      chain: 'solana',
      collection: 'Basic Camels',
      rarity: 'common'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'epic': return 'bg-gradient-to-r from-indigo-500 to-purple-500';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChain = filterChain === 'all' || nft.chain === filterChain;
    const matchesRarity = filterRarity === 'all' || nft.rarity === filterRarity;
    return matchesSearch && matchesChain && matchesRarity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HABIBI Marketplace</h1>
          <p className="text-gray-600 mt-2">Discover, mint, and trade unique NFTs</p>
        </div>
        <RealMintDialog />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-lg border">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterChain} onValueChange={setFilterChain}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chains</SelectItem>
            <SelectItem value="xrpl">XRPL</SelectItem>
            <SelectItem value="solana">Solana</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterRarity} onValueChange={setFilterRarity}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rarities</SelectItem>
            <SelectItem value="common">Common</SelectItem>
            <SelectItem value="rare">Rare</SelectItem>
            <SelectItem value="epic">Epic</SelectItem>
            <SelectItem value="legendary">Legendary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNFTs.map((nft) => (
          <Card key={nft.id} className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-white/90">
                    {nft.chain.toUpperCase()}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <div className={`px-2 py-1 rounded text-white text-xs font-medium ${getRarityColor(nft.rarity)}`}>
                    {nft.rarity}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute bottom-2 right-2 bg-white/90 hover:bg-white"
                >
                  <Heart size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-1">{nft.name}</CardTitle>
              <p className="text-sm text-gray-600 mb-2">{nft.collection}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-amber-600">
                  {nft.price} HABIBI
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                <ShoppingCart className="mr-2" size={16} />
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredNFTs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No NFTs found matching your criteria</p>
        </div>
      )}
    </div>
  );
}