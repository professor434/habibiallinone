import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Zap, CheckCircle, ExternalLink, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { solanaAPI, SolanaWallet, SolanaNFTMetadata } from '@/lib/solana';

interface SolanaMintDialogProps {
  wallet: SolanaWallet | null;
}

export default function SolanaMintDialog({ wallet }: SolanaMintDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mintType, setMintType] = useState<'camel' | 'collectible'>('camel');
  const [formData, setFormData] = useState<SolanaNFTMetadata>({
    name: '',
    description: '',
    collection: '',
    attributes: [],
    image: ''
  });
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<{mintAddress: string; signature: string} | null>(null);
  const { toast } = useToast();

  const addAttribute = () => {
    setFormData({
      ...formData,
      attributes: [...(formData.attributes || []), { trait_type: '', value: '' }]
    });
  };

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    const newAttributes = [...(formData.attributes || [])];
    newAttributes[index][field] = value;
    setFormData({ ...formData, attributes: newAttributes });
  };

  const removeAttribute = (index: number) => {
    const newAttributes = (formData.attributes || []).filter((_, i) => i !== index);
    setFormData({ ...formData, attributes: newAttributes });
  };

  const handleSolanaMint = async () => {
    if (!wallet?.connected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your Solana wallet first",
        variant: "destructive"
      });
      return;
    }

    setIsMinting(true);
    try {
      // Step 1: Pay marketplace fee (10 HABIBI or equivalent SOL)
      toast({
        title: "Processing Fee Payment",
        description: "Please approve the marketplace fee transaction",
      });

      const feeResult = await solanaAPI.transferHabibi(
        wallet,
        10, // 10 HABIBI tokens
        'HABIBI marketplace minting fee'
      );

      if (!feeResult.success) {
        // If no HABIBI tokens, charge SOL equivalent
        toast({
          title: "Fee Payment",
          description: "Charging 0.01 SOL as minting fee (HABIBI tokens preferred)",
        });
      }

      // Step 2: Mint NFT with metadata
      const nftMetadata: SolanaNFTMetadata = {
        ...formData,
        image: `/assets/camel${Math.floor(Math.random() * 4) + 1}.png`,
        mintType,
        timestamp: Date.now(),
        minter: wallet.publicKey?.toString()
      };

      toast({
        title: "Minting NFT",
        description: "Please approve the NFT minting transaction",
      });

      const mintResult = await solanaAPI.mintNFT(wallet, nftMetadata);
      
      if (mintResult.success) {
        setMintedNFT({
          mintAddress: mintResult.mintAddress,
          signature: mintResult.signature
        });
        
        toast({
          title: "NFT Minted Successfully! ⚡",
          description: `${formData.name} has been minted on Solana`,
        });
      } else {
        throw new Error('Minting failed');
      }

    } catch (error: any) {
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint NFT on Solana",
        variant: "destructive"
      });
    } finally {
      setIsMinting(false);
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
        <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
          <Plus className="mr-2" size={16} />
          Mint on Solana
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap size={20} className="text-purple-500" />
            Mint NFT on Solana
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
                  <span className="font-medium">Mint Address:</span>
                  <Badge variant="outline" className="font-mono">{mintedNFT.mintAddress.slice(0, 12)}...</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Transaction:</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="font-mono">
                      {mintedNFT.signature.slice(0, 12)}...
                    </Badge>
                    <ExternalLink 
                      size={16} 
                      className="cursor-pointer text-purple-500"
                      onClick={() => window.open(`https://explorer.solana.com/tx/${mintedNFT.signature}?cluster=${solanaAPI.NETWORK}`, '_blank')}
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
            <Card className={wallet?.connected ? 'bg-green-50' : 'bg-orange-50'}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Solana Wallet Status</h3>
                    <p className="text-sm text-gray-600">
                      {wallet?.connected ? 'Ready to mint on Solana' : 'Wallet connection required'}
                    </p>
                  </div>
                  {wallet?.connected ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <Badge variant="outline" className="text-orange-600">
                      Not Connected
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* NFT Type Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">NFT Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <Card 
                  className={`cursor-pointer transition-all ${mintType === 'camel' ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={() => setMintType('camel')}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🐪</div>
                    <h3 className="font-medium">Racing Camel</h3>
                    <p className="text-xs text-gray-600">Compete in races</p>
                  </CardContent>
                </Card>
                <Card 
                  className={`cursor-pointer transition-all ${mintType === 'collectible' ? 'ring-2 ring-purple-500' : ''}`}
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
                {formData.attributes?.map((attr, index) => (
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
            <Card className="bg-purple-50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Minting Fee:</span>
                    <Badge variant="outline">10 HABIBI or 0.01 SOL</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Network Fee:</span>
                    <Badge variant="outline">~0.001 SOL</Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    Fees are paid to: {solanaAPI.FEE_WALLET.slice(0, 12)}...
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mint Button */}
            <Button 
              onClick={handleSolanaMint}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              disabled={!formData.name || isMinting || !wallet?.connected}
            >
              {isMinting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Minting on Solana...
                </>
              ) : (
                <>
                  <Zap className="mr-2" size={16} />
                  Mint on Solana
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}