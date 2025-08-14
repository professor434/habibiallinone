import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Users, Bot, Trophy, Timer, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Camel {
  id: string;
  name: string;
  image: string;
  speed: number;
  stamina: number;
  luck: number;
  owner: string;
  position: number;
  isBot?: boolean;
}

interface RaceState {
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  players: Camel[];
  countdown: number;
  raceProgress: number;
  winner: Camel | null;
}

export default function EnhancedRaceTrack() {
  const [selectedCamel, setSelectedCamel] = useState<Camel | null>(null);
  const [raceState, setRaceState] = useState<RaceState>({
    status: 'waiting',
    players: [],
    countdown: 0,
    raceProgress: 0,
    winner: null
  });
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [matchmakingTime, setMatchmakingTime] = useState(0);
  const { toast } = useToast();
  const raceInterval = useRef<NodeJS.Timeout>();
  const matchmakingInterval = useRef<NodeJS.Timeout>();

  // Available camels
  const availableCamels: Camel[] = [
    {
      id: '1',
      name: 'Lightning Bolt',
      image: '/images/LightningBolt.jpg',
      speed: 95,
      stamina: 85,
      luck: 90,
      owner: 'You',
      position: 0
    },
    {
      id: '2',
      name: 'Desert Wind',
      image: '/images/DesertCamel.jpg',
      speed: 80,
      stamina: 90,
      luck: 75,
      owner: 'You',
      position: 0
    },
    {
      id: '3',
      name: 'Swift Runner',
      image: '/images/SwiftRunner.jpg',
      speed: 70,
      stamina: 85,
      luck: 80,
      owner: 'You',
      position: 0
    },
    {
      id: '4',
      name: 'Storm Chaser',
      image: '/images/StormChaser.jpg',
      speed: 75,
      stamina: 80,
      luck: 85,
      owner: 'You',
      position: 0
    }
  ];

  // Generate bot camels
  const generateBotCamels = (count: number): Camel[] => {
    const botNames = ['Sand Racer', 'Dune Master', 'Oasis Runner', 'Mirage Sprint', 'Desert King'];
    const bots: Camel[] = [];
    
    for (let i = 0; i < count; i++) {
      bots.push({
        id: `bot-${i}`,
        name: botNames[i] || `Bot Camel ${i + 1}`,
        image: `/assets/camel${(i % 4) + 1}.jpg`,
        speed: 60 + Math.random() * 30,
        stamina: 70 + Math.random() * 25,
        luck: 65 + Math.random() * 30,
        owner: `Player${i + 2}`,
        position: 0,
        isBot: true
      });
    }
    
    return bots;
  };

  const startMatchmaking = () => {
    if (!selectedCamel) {
      toast({
        title: "Select a Camel",
        description: "Please select a camel to race with",
        variant: "destructive"
      });
      return;
    }

    setShowMatchmaking(true);
    setMatchmakingTime(0);
    
    // Start matchmaking timer
    matchmakingInterval.current = setInterval(() => {
      setMatchmakingTime(prev => prev + 1);
    }, 1000);

    // Simulate finding players (30% chance every 3 seconds)
    const findPlayersInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        // Found real players (simulate)
        clearInterval(findPlayersInterval);
        clearInterval(matchmakingInterval.current!);
        setShowMatchmaking(false);
        
        const realPlayers = generateBotCamels(2).map(bot => ({
          ...bot,
          isBot: false,
          owner: `Player${Math.floor(Math.random() * 100)}`
        }));
        
        startRaceWithPlayers([selectedCamel, ...realPlayers]);
        
        toast({
          title: "Players Found!",
          description: "Match found with 2 other racers",
        });
      } else if (matchmakingTime >= 15) {
        // Timeout - use bots
        clearInterval(findPlayersInterval);
        clearInterval(matchmakingInterval.current!);
        setShowMatchmaking(false);
        
        const botCamels = generateBotCamels(3);
        startRaceWithPlayers([selectedCamel, ...botCamels]);
        
        toast({
          title: "Racing with Bots",
          description: "No players found, racing against AI opponents",
        });
      }
    }, 3000);
  };

  const startRaceWithPlayers = (racers: Camel[]) => {
    // Reset positions
    const resetRacers = racers.map(camel => ({ ...camel, position: 0 }));
    
    setRaceState({
      status: 'countdown',
      players: resetRacers,
      countdown: 3,
      raceProgress: 0,
      winner: null
    });

    // Countdown
    const countdownInterval = setInterval(() => {
      setRaceState(prev => {
        if (prev.countdown <= 1) {
          clearInterval(countdownInterval);
          startActualRace(resetRacers);
          return { ...prev, status: 'racing', countdown: 0 };
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);
  };

  const startActualRace = (racers: Camel[]) => {
    let raceTime = 0;
    const totalDistance = 600; // 600 meters
    
    raceInterval.current = setInterval(() => {
      raceTime += 100; // 100ms intervals
      
      setRaceState(prev => {
        const updatedPlayers = prev.players.map(camel => {
          // Calculate movement based on stats and random factors
          const baseSpeed = camel.speed / 100;
          const staminaFactor = Math.max(0.5, camel.stamina / 100 - (raceTime / 30000)); // Stamina decreases over time
          const luckFactor = 0.8 + (camel.luck / 100) * 0.4 + (Math.random() - 0.5) * 0.3;
          
          // Random events (obstacles, power-ups)
          let eventBonus = 1;
          if (Math.random() < 0.05) { // 5% chance per update
            const eventType = Math.random();
            if (eventType < 0.3) {
              eventBonus = 0.7; // Hit obstacle
            } else if (eventType < 0.6) {
              eventBonus = 1.3; // Found oasis (speed boost)
            } else {
              eventBonus = 1.5; // Lucky wind
            }
          }
          
          const movement = baseSpeed * staminaFactor * luckFactor * eventBonus * 8;
          const newPosition = Math.min(totalDistance, camel.position + movement);
          
          return { ...camel, position: newPosition };
        });

        // Check for winner
        const winner = updatedPlayers.find(camel => camel.position >= totalDistance);
        if (winner) {
          clearInterval(raceInterval.current!);
          
          // Sort by position for final rankings
          const sortedPlayers = [...updatedPlayers].sort((a, b) => b.position - a.position);
          
          toast({
            title: winner.owner === 'You' ? "Victory! 🏆" : "Race Finished!",
            description: `${winner.name} wins the race!`,
          });
          
          return {
            ...prev,
            status: 'finished',
            players: sortedPlayers,
            winner,
            raceProgress: 100
          };
        }

        return {
          ...prev,
          players: updatedPlayers,
          raceProgress: Math.max(...updatedPlayers.map(c => c.position)) / totalDistance * 100
        };
      });
    }, 100);
  };

  const resetRace = () => {
    if (raceInterval.current) clearInterval(raceInterval.current);
    if (matchmakingInterval.current) clearInterval(matchmakingInterval.current);
    
    setRaceState({
      status: 'waiting',
      players: [],
      countdown: 0,
      raceProgress: 0,
      winner: null
    });
    setShowMatchmaking(false);
    setMatchmakingTime(0);
  };

  useEffect(() => {
    return () => {
      if (raceInterval.current) clearInterval(raceInterval.current);
      if (matchmakingInterval.current) clearInterval(matchmakingInterval.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Camel Selection */}
      {raceState.status === 'waiting' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy size={20} />
              Select Your Racing Camel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableCamels.map((camel) => (
                <Card
                  key={camel.id}
                  className={`cursor-pointer transition-all ${
                    selectedCamel?.id === camel.id ? 'ring-2 ring-amber-500 bg-amber-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedCamel(camel)}
                >
                  <CardContent className="p-4 text-center">
                    <img
                      src={camel.image}
                      alt={camel.name}
                      className="w-16 h-16 mx-auto mb-2 rounded-lg"
                    />
                    <h3 className="font-medium text-sm">{camel.name}</h3>
                    <div className="text-xs text-gray-600 mt-1">
                      Speed: {camel.speed} | Stamina: {camel.stamina}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button
                onClick={startMatchmaking}
                disabled={!selectedCamel}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              >
                <Users className="mr-2" size={16} />
                Find Race
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matchmaking Dialog */}
      <Dialog open={showMatchmaking} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users size={20} />
              Finding Players...
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-500 mx-auto"></div>
            <p>Searching for other racers...</p>
            <p className="text-sm text-gray-600">Time: {matchmakingTime}s</p>
            <div className="bg-amber-50 p-3 rounded-lg text-sm">
              <p className="font-medium">Matchmaking Tips:</p>
              <p>• Matching with players who have similar level camels</p>
              <p>• Will use AI opponents if no players found after 15s</p>
            </div>
            <Button variant="outline" onClick={resetRace}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Countdown */}
      {raceState.status === 'countdown' && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl font-bold text-amber-600 mb-4">
              {raceState.countdown || 'GO!'}
            </div>
            <p className="text-lg">Get ready to race!</p>
          </CardContent>
        </Card>
      )}

      {/* Race Track */}
      {(raceState.status === 'racing' || raceState.status === 'finished') && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Timer size={20} />
                600m Desert Racing
              </CardTitle>
              <Badge variant="outline">
                {raceState.status === 'racing' ? 'Racing...' : 'Finished!'}
              </Badge>
            </div>
            <Progress value={raceState.raceProgress} className="w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {raceState.players.map((camel, index) => (
                <div key={camel.id} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant={index === 0 && raceState.status === 'finished' ? 'default' : 'outline'}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{camel.name}</span>
                      <span className="text-sm text-gray-600">({camel.owner})</span>
                      {camel.isBot && <Bot size={16} className="text-gray-400" />}
                    </div>
                    <span className="text-sm">
                      {Math.round(camel.position)}m / 600m
                    </span>
                  </div>
                  
                  <div className="relative bg-gray-200 h-8 rounded-lg overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-200 ${
                        camel.owner === 'You' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(camel.position / 600) * 100}%` }}
                    />
                    <img
                      src={camel.image}
                      alt={camel.name}
                      className="absolute top-0 left-0 w-8 h-8 transition-all duration-200"
                      style={{ 
                        left: `${Math.max(0, (camel.position / 600) * 100 - 4)}%`,
                        transform: raceState.status === 'racing' ? 'scaleX(-1)' : 'none'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {raceState.status === 'finished' && (
              <div className="mt-6 text-center">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg mb-4">
                  <h3 className="text-xl font-bold text-amber-600 mb-2">
                    🏆 {raceState.winner?.name} Wins!
                  </h3>
                  <p className="text-gray-600">
                    Owned by: {raceState.winner?.owner}
                  </p>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button onClick={resetRace} variant="outline">
                    Race Again
                  </Button>
                  <Button 
                    onClick={startMatchmaking}
                    className="bg-gradient-to-r from-amber-500 to-orange-600"
                  >
                    <Users className="mr-2" size={16} />
                    Find New Race
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}