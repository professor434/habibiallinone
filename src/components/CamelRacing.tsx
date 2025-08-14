import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Zap, Users, Bot, Play, Coins, Wrench } from 'lucide-react';
import EnhancedRaceTrack from './EnhancedRaceTrack';
import NFTMerging from './NFTMerging';

interface Camel {
  id: string;
  name: string;
  image: string;
  speed: number;
  stamina: number;
  luck: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owner: string;
}

export default function CamelRacing() {
  const [selectedCamel, setSelectedCamel] = useState<string>('');
  const [raceType, setRaceType] = useState<'player' | 'bot'>('player');
  const [entryFee, setEntryFee] = useState<number>(5);
  const [isRacing, setIsRacing] = useState(false);

  // Mock camel data
  const camels: Camel[] = [
    {
      id: '1',
      name: 'Lightning Bolt',
      image: '/api/placeholder/200/200',
      speed: 95,
      stamina: 85,
      luck: 90,
      rarity: 'legendary',
      owner: 'You'
    },
    {
      id: '2',
      name: 'Desert Wind',
      image: '/api/placeholder/200/200',
      speed: 80,
      stamina: 90,
      luck: 75,
      rarity: 'epic',
      owner: 'You'
    },
    {
      id: '3',
      name: 'Swift Runner',
      image: '/api/placeholder/200/200',
      speed: 70,
      stamina: 85,
      luck: 80,
      rarity: 'rare',
      owner: 'You'
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

  const startRace = async () => {
    if (!selectedCamel) {
      alert("Please select a camel first!");
      return;
    }

    // Show entry fee confirmation
    const confirmEntry = window.confirm(`Pay ${entryFee} HABIBI tokens to enter the race?`);
    
    if (!confirmEntry) {
      alert("Race entry cancelled");
      return;
    }

    setIsRacing(true);
    
    // Show race starting notification
    alert("Entry confirmed! Race starting in 3... 2... 1... GO!");
    
    // Simulate race duration with realistic timing
    setTimeout(() => {
      setIsRacing(false);
      
      // Determine if player won (based on camel stats)
      const selectedCamelData = camels.find(c => c.id === selectedCamel);
      const winChance = selectedCamelData ? (selectedCamelData.speed + selectedCamelData.stamina + selectedCamelData.luck) / 300 : 0.5;
      const playerWins = Math.random() < winChance;
      
      if (playerWins) {
        const winnings = entryFee * (raceType === 'player' ? 3 : 5);
        alert(`🏆 Congratulations! ${selectedCamelData?.name} won the race! You earned ${winnings} ${raceType === 'player' ? 'XRP' : 'SOL'}!`);
      } else {
        alert(`Better luck next time! ${selectedCamelData?.name} didn't win this race.`);
      }
    }, 8000);
  };

  const prizes = {
    player: {
      first: `${entryFee * 3} XRP`,
      second: `${entryFee * 2} XRP`,
      third: `${entryFee} XRP`
    },
    bot: {
      first: `${entryFee * 5} SOL`,
      second: `${entryFee * 3} SOL`,
      third: `${entryFee * 2} SOL`
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
         style={{
           backgroundImage: 'url(/assets/habibi-bg-2.jpg)',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
            🐪 Camel Racing Arena
          </h1>
          <p className="text-gray-600 text-lg">Select your camel and race for glory!</p>
        </div>

        {/* Racing Tabs */}
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Race Setup</TabsTrigger>
            <TabsTrigger value="track">Live Racing</TabsTrigger>
            <TabsTrigger value="enhance">Enhance Camels</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Camel Selection */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy size={20} />
                      Your Racing Camels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {camels.map((camel) => (
                        <Card 
                          key={camel.id} 
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedCamel === camel.id 
                              ? 'ring-2 ring-amber-500 shadow-lg' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setSelectedCamel(camel.id)}
                        >
                          <CardContent className="p-4">
                            <div className="relative mb-3">
                              <img
                                src={camel.image}
                                alt={camel.name}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div className={`absolute top-2 right-2 px-2 py-1 rounded text-white text-xs font-medium bg-gradient-to-r ${getRarityColor(camel.rarity)}`}>
                                {camel.rarity}
                              </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{camel.name}</h3>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Speed</span>
                                  <span>{camel.speed}/100</span>
                                </div>
                                <Progress value={camel.speed} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Stamina</span>
                                  <span>{camel.stamina}/100</span>
                                </div>
                                <Progress value={camel.stamina} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Luck</span>
                                  <span>{camel.luck}/100</span>
                                </div>
                                <Progress value={camel.luck} className="h-2" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Race Setup */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap size={20} />
                      Race Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Race Type */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Race Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={raceType === 'player' ? 'default' : 'outline'}
                          onClick={() => setRaceType('player')}
                          className="flex items-center gap-2"
                        >
                          <Users size={16} />
                          vs Players
                        </Button>
                        <Button
                          variant={raceType === 'bot' ? 'default' : 'outline'}
                          onClick={() => setRaceType('bot')}
                          className="flex items-center gap-2"
                        >
                          <Bot size={16} />
                          vs Bots
                        </Button>
                      </div>
                    </div>

                    {/* Entry Fee */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Entry Fee</label>
                      <Select value={entryFee.toString()} onValueChange={(value) => setEntryFee(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 HABIBI</SelectItem>
                          <SelectItem value="10">10 HABIBI</SelectItem>
                          <SelectItem value="25">25 HABIBI</SelectItem>
                          <SelectItem value="50">50 HABIBI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Prizes */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Prize Pool</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Trophy size={12} className="text-yellow-500" />
                            1st Place
                          </span>
                          <span className="font-medium">{prizes[raceType].first}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Trophy size={12} className="text-gray-400" />
                            2nd Place
                          </span>
                          <span className="font-medium">{prizes[raceType].second}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Trophy size={12} className="text-amber-600" />
                            3rd Place
                          </span>
                          <span className="font-medium">{prizes[raceType].third}</span>
                        </div>
                      </div>
                    </div>

                    {/* Start Race Button */}
                    <Button
                      onClick={startRace}
                      disabled={!selectedCamel || isRacing}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    >
                      {isRacing ? (
                        <>
                          <Zap className="mr-2 animate-spin" size={16} />
                          Racing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2" size={16} />
                          Start Race
                        </>
                      )}
                    </Button>

                    {!selectedCamel && (
                      <p className="text-sm text-gray-500 text-center">
                        Select a camel to start racing
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Mint New Camel */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins size={20} />
                      Mint Racing Camel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Mint a new racing camel NFT with random stats and rarity
                    </p>
                    <Button className="w-full" variant="outline">
                      Mint for 100 HABIBI
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="track" className="mt-6">
            <EnhancedRaceTrack />
          </TabsContent>
          
          <TabsContent value="enhance" className="mt-6">
            <NFTMerging />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}