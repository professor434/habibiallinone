import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageIcon, Shuffle, Info } from 'lucide-react';

interface NFTImageInfo {
  path: string;
  name: string;
  size: string;
  type: 'camel' | 'background' | 'utility';
  description: string;
}

export default function NFTImageGallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Available NFT images organized by category
  const nftImages: NFTImageInfo[] = [
    // Camel NFT Images (Assets)
    { path: '/assets/camel1.png', name: 'Camel #1', size: '542B', type: 'camel', description: 'Classic racing camel with traditional gear' },
    { path: '/assets/camel2.png', name: 'Camel #2', size: '538B', type: 'camel', description: 'Desert warrior camel with battle accessories' },
    { path: '/assets/camel3.png', name: 'Camel #3', size: '542B', type: 'camel', description: 'Royal camel with golden ornaments' },
    { path: '/images/SwiftRunner.jpg', name: 'Camel #4', size: '542B', type: 'camel', description: 'Swift runner camel with speed enhancements' },
    
    // High-Quality Camel Images (Images folder)
    { path: '/images/DesertCamel.jpg', name: 'Desert Camel', size: '101KB', type: 'camel', description: 'Majestic desert camel in natural habitat' },
    { path: '/images/StormChaser.jpg', name: 'Storm Chaser', size: '54KB', type: 'camel', description: 'Lightning-fast racing camel' },
    { path: '/images/SwiftRunner.jpg', name: 'Swift Runner', size: '185KB', type: 'camel', description: 'Champion racing camel with victory record' },
    { path: '/images/camel.jpg', name: 'Classic Camel', size: '54KB', type: 'camel', description: 'Traditional camel artwork' },
    
    // Utility Images
    { path: '/images/LightningBolt.jpg', name: 'Lightning Bolt', size: '45KB', type: 'utility', description: 'Speed enhancement effect' },
    { path: '/images/placeholder.jpg', name: 'Placeholder', size: '59KB', type: 'utility', description: 'Fallback image for broken links' },
    
    // Background Images
    { path: '/assets/camels-nfts-bg.png', name: 'NFT Background', size: '1.8MB', type: 'background', description: 'Desert scene background for NFT collections' },
    { path: '/assets/habibi-bg-1.jpg', name: 'HABIBI BG 1', size: '272KB', type: 'background', description: 'Arabian desert sunset theme' },
    { path: '/assets/habibi-bg-2.jpg', name: 'HABIBI BG 2', size: '132KB', type: 'background', description: 'Oasis landscape theme' }
  ];

  const getRandomCamelImage = () => {
    const camelImages = nftImages.filter(img => img.type === 'camel' && img.path.includes('/assets/'));
    const randomIndex = Math.floor(Math.random() * 4) + 1;
    return `/assets/camel${randomIndex}.png`;
  };

  const filterImages = (type?: string) => {
    return type ? nftImages.filter(img => img.type === type) : nftImages;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'camel': return 'bg-amber-500';
      case 'background': return 'bg-blue-500';
      case 'utility': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon size={24} />
          HABIBI NFT Image Gallery
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Info size={16} />
            <span>Images used for NFT minting</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => alert(`Random camel: ${getRandomCamelImage()}`)}>
            <Shuffle size={14} className="mr-1" />
            Preview Random Selection
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Images ({nftImages.length})</TabsTrigger>
            <TabsTrigger value="camel">Camels ({filterImages('camel').length})</TabsTrigger>
            <TabsTrigger value="background">Backgrounds ({filterImages('background').length})</TabsTrigger>
            <TabsTrigger value="utility">Utility ({filterImages('utility').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <ImageGrid images={nftImages} onImageSelect={setSelectedImage} getTypeColor={getTypeColor} />
          </TabsContent>

          <TabsContent value="camel" className="mt-6">
            <ImageGrid images={filterImages('camel')} onImageSelect={setSelectedImage} getTypeColor={getTypeColor} />
          </TabsContent>

          <TabsContent value="background" className="mt-6">
            <ImageGrid images={filterImages('background')} onImageSelect={setSelectedImage} getTypeColor={getTypeColor} />
          </TabsContent>

          <TabsContent value="utility" className="mt-6">
            <ImageGrid images={filterImages('utility')} onImageSelect={setSelectedImage} getTypeColor={getTypeColor} />
          </TabsContent>
        </Tabs>

        {/* Minting Logic Summary */}
        <Card className="mt-6 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-lg">NFT Minting Image Logic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-green-700">✅ MintDialog.tsx</h4>
                <p className="text-gray-600">Uses: <code>/assets/camel[1-4].png</code></p>
                <p className="text-xs">Random selection working correctly</p>
              </div>
              <div>
                <h4 className="font-medium text-green-700">✅ RealMintDialog.tsx</h4>
                <p className="text-gray-600">Uses: <code>/assets/camel[1-4].png</code></p>
                <p className="text-xs">Fixed: .jpg → .png extension</p>
              </div>
              <div>
                <h4 className="font-medium text-green-700">✅ SolanaMintDialog.tsx</h4>
                <p className="text-gray-600">Uses: <code>/assets/camel[1-4].png</code></p>
                <p className="text-xs">Fixed: broken path syntax</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium mb-2">Random Selection Formula:</h4>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {`/assets/camel\${Math.floor(Math.random() * 4) + 1}.png`}
              </code>
              <p className="text-xs text-gray-600 mt-1">
                Generates: camel1.png, camel2.png, camel3.png, or camel4.png
              </p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

interface ImageGridProps {
  images: NFTImageInfo[];
  onImageSelect: (path: string) => void;
  getTypeColor: (type: string) => string;
}

function ImageGrid({ images, onImageSelect, getTypeColor }: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No images found in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
          <div className="relative">
            <img
              src={image.path}
              alt={image.name}
              className="w-full h-32 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg';
              }}
              onClick={() => onImageSelect(image.path)}
            />
            <Badge 
              className={`absolute top-2 right-2 ${getTypeColor(image.type)} text-white text-xs`}
            >
              {image.type.toUpperCase()}
            </Badge>
          </div>
          
          <CardContent className="p-3">
            <div className="space-y-1">
              <h3 className="font-medium text-sm">{image.name}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">
                {image.description}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-xs">
                  {image.size}
                </Badge>
                <code className="text-xs bg-gray-100 px-1 rounded">
                  {image.path}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}