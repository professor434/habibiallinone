import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, TrendingUp, Edit3 } from 'lucide-react';

interface CollectionNFT {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  type: 'camel' | 'collectible';
  chain: 'xrpl' | 'solana';
  stats?: {
    speed: number;
    stamina: number;
    luck: number;
  };
  wins?: number;
  value: number;
}

export default function Collection() {
  const [selectedTab, setSelectedTab] = useState('all');

  // Mock collection data
  const collection: CollectionNFT[] = [
    {
      id: '1',
      name: 'Lightning Bolt',
      image: '/api/placeholder/200/200',
      rarity: 'legendary',
      type: 'camel',
      chain: 'xrpl',
      stats: { speed: 95, stamina: 85, luck: 90 },
      wins: 12,
      value: 150
    },
    {
      id: '2',
      name: 'Desert Wind',
      image: '/api/placeholder/200/200',
      rarity: 'epic',
      type: 'camel',
      chain: 'solana',
      stats: { speed: 80, stamina: 90, luck: 75 },
      wins: 8,
      value: 95
    },
    {
      id: '3',
      name: 'Golden Saddle',
      image: '/api/placeholder/200/200',
      rarity: 'rare',
      type: 'collectible',
      chain: 'xrpl',
      value: 45
    },
    {
      id: '4',
      name: 'Swift Runner',
      image: '/api/placeholder/200/200',
      rarity: 'rare',
      type: 'camel',
      chain: 'solana',
      stats: { speed: 70, stamina: 85, luck: 80 },
      wins: 5,
      value: 60
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-purple-500 to-pink-500';
      case 'epic': return 'from-indigo-500 to-purple-500';
      case 'rare': return 'from-blue-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredCollection = collection.filter(item => {
    if (selectedTab === 'all') return true;
    return item.type === selectedTab;
  });

  const totalValue = collection.reduce((sum, item) => sum + item.value, 0);
  const rarityCount = {
    legendary: collection.filter(item => item.rarity === 'legendary').length,
    epic: collection.filter(item => item.rarity === 'epic').length,
    rare: collection.filter(item => item.rarity === 'rare').length,
    common: collection.filter(item => item.rarity === 'common').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Collection</h1>
        <p className="text-gray-600">Manage your NFTs and track their performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{collection.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-amber-600">{totalValue} HABIBI</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Racing Wins</p>
                <p className="text-2xl font-bold text-green-600">
                  {collection.filter(item => item.wins).reduce((sum, item) => sum + (item.wins || 0), 0)}
                </p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Legendary Items</p>
                <p className="text-2xl font-bold text-purple-600">{rarityCount.legendary}</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collection Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="camel">Racing Camels</TabsTrigger>
          <TabsTrigger value="collectible">Collectibles</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCollection.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-white/90">
                        {item.chain.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div className={`px-2 py-1 rounded text-white text-xs font-medium bg-gradient-to-r ${getRarityColor(item.rarity)}`}>
                        {item.rarity}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  
                  {item.stats && (
                    <div className="space-y-2 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Speed</span>
                          <span>{item.stats.speed}/100</span>
                        </div>
                        <Progress value={item.stats.speed} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Stamina</span>
                          <span>{item.stats.stamina}/100</span>
                        </div>
                        <Progress value={item.stats.stamina} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Luck</span>
                          <span>{item.stats.luck}/100</span>
                        </div>
                        <Progress value={item.stats.luck} className="h-2" />
                      </div>
                    </div>
                  )}

                  {item.wins !== undefined && (
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy size={16} className="text-amber-500" />
                      <span className="text-sm font-medium">{item.wins} wins</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-amber-600">
                      {item.value} HABIBI
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Edit3 className="mr-2" size={16} />
                      Sell
                    </Button>
                    {item.type === 'camel' && (
                      <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600">
                        Race
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredCollection.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found in this category</p>
        </div>
      )}
    </div>
  );
}