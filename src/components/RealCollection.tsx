import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Search, Filter, Trophy, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NFTMetadata {
  id: string;
  name: string;
  description: string;
  image: string;
  collection: string;
  attributes: Array<{ trait_type: string; value: string }>;
  mintType: 'camel' | 'collectible';
  txHash: string;
  mintedAt: string;
  owner: string;
  timestamp: number;
}

export default function RealCollection() {
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'camel' | 'collectible'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const { toast } = useToast();

  // Load NFTs from localStorage on component mount
  useEffect(() => {
    const loadNFTs = () => {
      try {
        const storedNFTs = localStorage.getItem('mintedNFTs');
        if (storedNFTs) {
          const parsedNFTs: NFTMetadata[] = JSON.parse(storedNFTs);
          setNfts(parsedNFTs);
          setFilteredNfts(parsedNFTs);
        }
      } catch (error) {
        console.error('Error loading NFTs:', error);
        toast({
          title: "Loading Error",
          description: "Failed to load your NFT collection",
          variant: "destructive"
        });
      }
    };

    loadNFTs();
    
    // Set up periodic refresh to check for new NFTs
    const interval = setInterval(loadNFTs, 5000);
    return () => clearInterval(interval);
  }, [toast]);

  // Filter and sort NFTs
  useEffect(() => {
    let filtered = [...nfts];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.collection.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(nft => nft.mintType === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.mintedAt).getTime() - new Date(a.mintedAt).getTime();
        case 'oldest':
          return new Date(a.mintedAt).getTime() - new Date(b.mintedAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredNfts(filtered);
  }, [nfts, searchQuery, filterType, sortBy]);

  const viewOnExplorer = (txHash: string) => {
    window.open(`https://livenet.xrpl.org/transactions/${txHash}`, '_blank');
  };

  const refreshCollection = () => {
    const storedNFTs = localStorage.getItem('mintedNFTs');
    if (storedNFTs) {
      const parsedNFTs: NFTMetadata[] = JSON.parse(storedNFTs);
      setNfts(parsedNFTs);
      toast({
        title: "Collection Refreshed",
        description: `Found ${parsedNFTs.length} NFTs in your collection`,
      });
    }
  };

  if (nfts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-bold mb-2">No NFTs Yet</h3>
          <p className="text-gray-600 mb-4">
            Start minting your first NFT to build your collection
          </p>
          <Button 
            onClick={refreshCollection}
            variant="outline"
          >
            Refresh Collection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collection Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy size={20} />
              My NFT Collection ({nfts.length})
            </CardTitle>
            <Button onClick={refreshCollection} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search your NFTs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter */}
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-48">
                <Filter size={16} className="mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="camel">Racing Camels</SelectItem>
                <SelectItem value="collectible">Collectibles</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNfts.map((nft) => (
          <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={nft.mintType === 'camel' ? 'default' : 'secondary'}>
                  {nft.mintType === 'camel' ? '🐪' : '🏆'}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-lg">{nft.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {nft.description || 'No description'}
                  </p>
                </div>

                {/* Collection */}
                {nft.collection && (
                  <Badge variant="outline" className="text-xs">
                    {nft.collection}
                  </Badge>
                )}

                {/* Attributes */}
                {nft.attributes.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-gray-700">Attributes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {nft.attributes.slice(0, 3).map((attr, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {attr.trait_type}: {attr.value}
                        </Badge>
                      ))}
                      {nft.attributes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{nft.attributes.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Blockchain Info */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">NFT ID:</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {nft.id.slice(0, 12)}...
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Minted:</span>
                    <span>{new Date(nft.mintedAt).toLocaleDateString()}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => viewOnExplorer(nft.txHash)}
                  >
                    <ExternalLink size={12} className="mr-1" />
                    View on XRPL
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNfts.length === 0 && nfts.length > 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">No NFTs Found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}