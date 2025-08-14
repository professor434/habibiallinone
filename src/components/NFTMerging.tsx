import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Zap, Plus, ArrowRight, Sparkles, Trophy } from 'lucide-react';

interface MergeableItem {
  id: string;
  name: string;
  type: 'camel' | 'utility' | 'enhancement';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats?: {
    speed?: number;
    stamina?: number;
    luck?: number;
  };
  utilities?: string[];
  enhancementType?: string;
  enhancementValue?: number;
  price: number;
  image: string;
}

export default function NFTMerging() {
  const [selectedCamel, setSelectedCamel] = useState<MergeableItem | null>(null);
  const [selectedEnhancement, setSelectedEnhancement] = useState<MergeableItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Mock data for mergeable items
  const camels: MergeableItem[] = [
    {
      id: 'c1',
      name: 'Lightning Bolt',
      type: 'camel',
      rarity: 'legendary',
      stats: { speed: 95, stamina: 85, luck: 90 },
      utilities: ['Speed Boost', 'Jump Master'],
      price: 150,
      image: '/api/placeholder/200/200'
    },
    {
      id: 'c2',
      name: 'Desert Wind',
      type: 'camel',
      rarity: 'epic',
      stats: { speed: 80, stamina: 90, luck: 75 },
      utilities: ['Stamina Shield'],
      price: 95,
      image: '/api/placeholder/200/200'
    }
  ];

  const enhancements: MergeableItem[] = [
    {
      id: 'e1',
      name: 'Turbo Saddle',
      type: 'enhancement',
      rarity: 'rare',
      enhancementType: 'speed',
      enhancementValue: 10,
      price: 25,
      image: '/api/placeholder/150/150'
    },
    {
      id: 'e2',
      name: 'Endurance Blanket',
      type: 'enhancement',
      rarity: 'rare',
      enhancementType: 'stamina',
      enhancementValue: 15,
      price: 30,
      image: '/api/placeholder/150/150'
    },
    {
      id: 'e3',
      name: 'Lucky Horseshoe',
      type: 'enhancement',
      rarity: 'epic',
      enhancementType: 'luck',
      enhancementValue: 20,
      price: 45,
      image: '/api/placeholder/150/150'
    },
    {
      id: 'e4',
      name: 'Nitro Boost Kit',
      type: 'utility',
      rarity: 'legendary',
      utilities: ['Nitro Boost'],
      price: 75,
      image: '/api/placeholder/150/150'
    },
    {
      id: 'e5',
      name: 'Sand Storm Googles',
      type: 'utility',
      rarity: 'epic',
      utilities: ['Sand Immunity'],
      price: 50,
      image: '/api/placeholder/150/150'
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

  const calculateMergeCost = () => {
    if (!selectedCamel || !selectedEnhancement) return 0;
    return Math.floor((selectedCamel.price + selectedEnhancement.price) * 0.1);
  };

  const performMerge = () => {
    if (!selectedCamel || !selectedEnhancement) return;

    console.log('Merging:', selectedCamel.name, 'with', selectedEnhancement.name);
    
    // Simulate merge success
    setIsOpen(false);
    setSelectedCamel(null);
    setSelectedEnhancement(null);
    
    // In real implementation, this would update the NFT in the blockchain
    alert(`Successfully merged ${selectedEnhancement.name} with ${selectedCamel.name}!`);
  };

  const getEnhancedStats = () => {
    if (!selectedCamel || !selectedEnhancement) return selectedCamel?.stats;

    const enhanced = { ...selectedCamel.stats };
    if (selectedEnhancement.enhancementType && selectedEnhancement.enhancementValue) {
      const statKey = selectedEnhancement.enhancementType as keyof typeof enhanced;
      if (enhanced[statKey]) {
        enhanced[statKey] = Math.min((enhanced[statKey] || 0) + selectedEnhancement.enhancementValue, 100);
      }
    }
    return enhanced;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
          🔧 NFT Enhancement Lab
        </h1>
        <p className="text-gray-600 text-lg">Merge utilities and enhancements to upgrade your racing camels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Select Camel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy size={20} />
                Select Your Camel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {camels.map((camel) => (
                <Card
                  key={camel.id}
                  className={`cursor-pointer transition-all ${
                    selectedCamel?.id === camel.id ? 'ring-2 ring-amber-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedCamel(camel)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={camel.image}
                        alt={camel.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{camel.name}</h3>
                        <div className={`px-2 py-1 rounded text-white text-xs font-medium bg-gradient-to-r ${getRarityColor(camel.rarity)}`}>
                          {camel.rarity}
                        </div>
                      </div>
                    </div>
                    
                    {camel.stats && (
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Speed</span>
                            <span>{camel.stats.speed}/100</span>
                          </div>
                          <Progress value={camel.stats.speed} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Stamina</span>
                            <span>{camel.stats.stamina}/100</span>
                          </div>
                          <Progress value={camel.stats.stamina} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Luck</span>
                            <span>{camel.stats.luck}/100</span>
                          </div>
                          <Progress value={camel.stats.luck} className="h-2" />
                        </div>
                      </div>
                    )}

                    {camel.utilities && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {camel.utilities.map((utility, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Zap size={10} className="mr-1" />
                            {utility}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Select Enhancement */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles size={20} />
                Select Enhancement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {enhancements.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all ${
                    selectedEnhancement?.id === item.id ? 'ring-2 ring-amber-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedEnhancement(item)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <div className={`inline-block px-2 py-1 rounded text-white text-xs font-medium bg-gradient-to-r ${getRarityColor(item.rarity)}`}>
                          {item.rarity}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {item.price} HABIBI
                        </Badge>
                      </div>
                    </div>

                    {item.enhancementType && (
                      <div className="text-xs text-green-600">
                        +{item.enhancementValue} {item.enhancementType}
                      </div>
                    )}

                    {item.utilities && (
                      <div className="flex flex-wrap gap-1">
                        {item.utilities.map((utility, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Zap size={8} className="mr-1" />
                            {utility}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Merge Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus size={20} />
                Merge Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCamel && selectedEnhancement ? (
                <div className="space-y-4">
                  {/* Merge visualization */}
                  <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2">
                        🐪
                      </div>
                      <p className="text-sm font-medium">{selectedCamel.name}</p>
                    </div>
                    
                    <ArrowRight className="text-amber-600" size={24} />
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2">
                        ⚡
                      </div>
                      <p className="text-sm font-medium">{selectedEnhancement.name}</p>
                    </div>
                    
                    <ArrowRight className="text-amber-600" size={24} />
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mb-2">
                        <Sparkles className="text-white" size={24} />
                      </div>
                      <p className="text-sm font-medium">Enhanced!</p>
                    </div>
                  </div>

                  {/* Stats comparison */}
                  {selectedCamel.stats && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Stats After Merge:</h4>
                      {Object.entries(getEnhancedStats() || {}).map(([stat, value]) => (
                        <div key={stat}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{stat}</span>
                            <span>
                              {selectedCamel.stats?.[stat as keyof typeof selectedCamel.stats]} 
                              {value !== selectedCamel.stats?.[stat as keyof typeof selectedCamel.stats] && (
                                <span className="text-green-600 ml-1">
                                  → {value}
                                </span>
                              )}
                            </span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* New utilities */}
                  {selectedEnhancement.utilities && (
                    <div>
                      <h4 className="font-medium mb-2">New Utilities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedEnhancement.utilities.map((utility, idx) => (
                          <Badge key={idx} className="text-xs bg-green-100 text-green-700">
                            <Plus size={8} className="mr-1" />
                            {utility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Merge cost */}
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Merge Cost:</span>
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-600">
                        {calculateMergeCost()} HABIBI
                      </Badge>
                    </div>
                  </div>

                  {/* Merge button */}
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                        <Sparkles className="mr-2" size={16} />
                        Merge NFTs
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm NFT Merge</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>
                          Are you sure you want to merge <strong>{selectedEnhancement.name}</strong> with <strong>{selectedCamel.name}</strong>?
                        </p>
                        <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                          <p className="text-sm text-yellow-800">
                            ⚠️ This action is permanent and cannot be undone. The enhancement item will be consumed.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={performMerge}
                            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600"
                          >
                            Confirm Merge
                          </Button>
                          <Button
                            onClick={() => setIsOpen(false)}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select a camel and enhancement to preview the merge</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}