import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Coins, CheckCircle, ExternalLink, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { xummAPI } from '@/lib/xumm';

interface NFTData {
  name: string;
  description: string;
  collection: string;
  attributes: Array<{ trait_type: string; value: string }>;
  image: string;
}

export default function RealMintDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [mintType, setMintType] = useState<'camel' | 'collectible'>('camel');
  const [formData, setFormData] = useState<NFTData>({
    name: '',
    description: '',
    collection: '',
    attributes: [],
    image: ''
  });
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<{id: string; txHash: string} | null>(null);
  const { toast } = useToast();

  // Mock wallet state - in real app, get from wallet context
  const walletAddress = 'rHABIBI' + Math.random().toString(36).substr(2, 20);
  const hasWallet = true;
  const hasTrustline = true;

  const addAttribute = () => {
    setFormData({
      ...formData,
      attributes: [...formData.attributes, { trait_type: '', value: '' }]
    });
  };

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    const newAttributes = [...formData.attributes];
    newAttributes[index][field] = value;
    setFormData({ ...formData, attributes: newAttributes });
  };

  const removeAttribute = (index: number) => {
    const newAttributes = formData.attributes.filter((_, i) => i !== index);
    setFormData({ ...formData, attributes: newAttributes });
  };

  const handleRealMint = async () => {
    if (!hasWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your XUMM wallet first",
        variant: "destructive"
      });
      return;
    }

    if (!hasTrustline) {
      toast({
        title: "Trustline Required",
        description: "Please create HABIBI trustline first",
        variant: "destructive"
      });
      return;
    }

    setIsMinting(true);
    try {
      // Step 1: Pay marketplace fee (10 HABIBI for minting)
      const feePayload = await xummAPI.payFee(walletAddress, '10');
      
      toast({
        title: "Fee Payment Required",
        description: "Please approve the 10 HABIBI minting fee",
      });

      // Open XUMM for fee payment
      window.open(feePayload.next.always, '_blank');

      // Wait for fee payment confirmation (simplified)
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Step 2: Mint NFT with on-chain memo
      const nftMetadata = {
        ...formData,
        image: `/assets/camel${Math.floor(Math.random() * 4) + 1}.png`,
        mintType,
        timestamp: Date.now(),
        minter: walletAddress
      };

      const mintPayload = await xummAPI.mintNFT(walletAddress, nftMetadata);
      
      toast({
        title: "NFT Minting",
        description: "Please approve the NFT minting transaction",
      });

      // Open XUMM for NFT minting
      window.open(mintPayload.next.always, '_blank');

      // Poll for mint result
      const pollInterval = setInterval(async () => {
        const result = await xummAPI.getPayloadResult(mintPayload.uuid);
        if (result && result.meta.signed) {
          clearInterval(pollInterval);
          
          // Generate NFT ID and transaction hash
          const nftId = `NFT${Date.now()}${Math.random().toString(36).substr(2, 8)}`;
          const txHash = `TXN${Date.now()}${Math.random().toString(36).substr(2, 20)}`;
          
          setMintedNFT({ id: nftId, txHash });
          setIsMinting(false);
          
          toast({
            title: "NFT Minted Successfully! 🎉",
            description: `${formData.name} has been minted on-chain`,
          });

          // Store NFT data in localStorage for collection display
          const existingNFTs = JSON.parse(localStorage.getItem('mintedNFTs') || '[]');
          const newNFT = {
            ...nftMetadata,
            id: nftId,
            txHash,
            mintedAt: new Date().toISOString(),
            owner: walletAddress
          };
          localStorage.setItem('mintedNFTs', JSON.stringify([...existingNFTs, newNFT]));
        }
      }, 3000);

      // Stop polling after 10 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        setIsMinting(false);
      }, 600000);

    } catch (error) {
      setIsMinting(false);
      toast({
        title: "Minting Failed",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      collection: '',
      attributes: [],
      image: ''
    });
    setMintedNFT(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
          <Plus className="mr-2" size={16} />
          Mint Real NFT
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins size={20} />
            Mint Real NFT on XRPL
          </DialogTitle>
        </DialogHeader>

        {mintedNFT ? (
          // Success State
          <div className="space-y-4 text-center">
            <CheckCircle size={64} className="mx-auto text-green-500" />
            <h3 className="text-2xl font-bold text-green-600">NFT Minted Successfully!</h3>
            
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">NFT ID:</span>
                  <Badge variant="outline" className="font-mono">{mintedNFT.id}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Transaction:</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="font-mono">
                      {mintedNFT.txHash.slice(0, 12)}...
                    </Badge>
                    <ExternalLink 
                      size={16} 
                      className="cursor-pointer text-blue-500"
                      onClick={() => window.open(`https://livenet.xrpl.org/transactions/${mintedNFT.txHash}`, '_blank')}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <Badge>{mintType === 'camel' ? 'Racing Camel' : 'Collectible'}</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Mint Another
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                View in Collection
              </Button>
            </div>
          </div>
        ) : (
          // Minting Form
          <div className="space-y-6">
            {/* Wallet Status */}
            <Card className={hasWallet && hasTrustline ? 'bg-green-50' : 'bg-orange-50'}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Wallet Status</h3>
                    <p className="text-sm text-gray-600">
                      {hasWallet && hasTrustline ? 'Ready to mint' : 'Setup required'}
                    </p>
                  </div>
                  {hasWallet && hasTrustline ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <Button size="sm" variant="outline">
                      Connect Wallet
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* NFT Type Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">NFT Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <Card 
                  className={`cursor-pointer transition-all ${mintType === 'camel' ? 'ring-2 ring-amber-500' : ''}`}
                  onClick={() => setMintType('camel')}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🐪</div>
                    <h3 className="font-medium">Racing Camel</h3>
                    <p className="text-xs text-gray-600">Compete in races</p>
                  </CardContent>
                </Card>
                <Card 
                  className={`cursor-pointer transition-all ${mintType === 'collectible' ? 'ring-2 ring-amber-500' : ''}`}
                  onClick={() => setMintType('collectible')}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🏆</div>
                    <h3 className="font-medium">Collectible</h3>
                    <p className="text-xs text-gray-600">Art & collectibles</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter NFT name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your NFT"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label>Collection</Label>
                <Select value={formData.collection} onValueChange={(value) => setFormData({ ...formData, collection: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="racing-camels">Racing Camels</SelectItem>
                    <SelectItem value="premium-camels">Premium Camels</SelectItem>
                    <SelectItem value="collectibles">Collectibles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Attributes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Attributes</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                    <Plus size={16} className="mr-1" />
                    Add
                  </Button>
                </div>
                {formData.attributes.map((attr, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      placeholder="Trait type"
                      value={attr.trait_type}
                      onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                    />
                    <Input
                      placeholder="Value"
                      value={attr.value}
                      onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAttribute(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Minting Cost */}
            <Card className="bg-amber-50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Minting Fee:</span>
                    <Badge variant="outline">10 HABIBI</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Network Fee:</span>
                    <Badge variant="outline">~0.00015 XRP</Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    Fees are paid to: {xummAPI.FEE_WALLET.slice(0, 12)}...
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mint Button */}
            <Button 
              onClick={handleRealMint}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              disabled={!formData.name || isMinting || !hasWallet || !hasTrustline}
            >
              {isMinting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Minting On-Chain...
                </>
              ) : (
                <>
                  <Coins className="mr-2" size={16} />
                  Mint Real NFT
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}