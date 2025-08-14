import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Trophy, Zap } from 'lucide-react';

interface RacingCamel {
  id: string;
  name: string;
  position: number;
  speed: number;
  stamina: number;
  luck: number;
  currentStamina: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owner: string;
  color: string;
  utilities: string[];
}

interface Obstacle {
  position: number;
  type: 'jump' | 'water' | 'sand';
  difficulty: number;
}

export default function RaceTrack() {
  const [camels, setCamels] = useState<RacingCamel[]>([]);
  const [isRacing, setIsRacing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [winner, setWinner] = useState<RacingCamel | null>(null);
  const [raceTime, setRaceTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const trackLength = 600; // 600 meters
  const obstacles: Obstacle[] = [
    { position: 100, type: 'jump', difficulty: 15 },
    { position: 250, type: 'water', difficulty: 20 },
    { position: 400, type: 'sand', difficulty: 10 },
    { position: 520, type: 'jump', difficulty: 25 }
  ];

  // Initialize racing camels
  useEffect(() => {
    const initialCamels: RacingCamel[] = [
      {
        id: '1',
        name: 'Lightning Bolt',
        position: 0,
        speed: 95,
        stamina: 85,
        luck: 90,
        currentStamina: 85,
        rarity: 'legendary',
        owner: 'You',
        color: '#8B5CF6',
        utilities: ['Speed Boost', 'Jump Master']
      },
      {
        id: '2',
        name: 'Desert Wind',
        position: 0,
        speed: 80,
        stamina: 90,
        luck: 75,
        currentStamina: 90,
        rarity: 'epic',
        owner: 'Player 2',
        color: '#F59E0B',
        utilities: ['Stamina Shield', 'Sand Walker']
      },
      {
        id: '3',
        name: 'Swift Runner',
        position: 0,
        speed: 70,
        stamina: 85,
        luck: 80,
        currentStamina: 85,
        rarity: 'rare',
        owner: 'Player 3',
        color: '#EF4444',
        utilities: ['Lucky Charm']
      },
      {
        id: '4',
        name: 'Storm Chaser',
        position: 0,
        speed: 75,
        stamina: 80,
        luck: 85,
        currentStamina: 80,
        rarity: 'rare',
        owner: 'Bot',
        color: '#10B981',
        utilities: ['Water Walker']
      }
    ];
    setCamels(initialCamels);
  }, []);

  const startRace = () => {
    if (raceFinished) {
      resetRace();
      return;
    }
    
    setIsRacing(true);
    setIsPaused(false);
    
    intervalRef.current = setInterval(() => {
      setRaceTime(prev => prev + 0.1);
      
      setCamels(prevCamels => {
        const updatedCamels = prevCamels.map(camel => {
          if (camel.position >= trackLength) return camel;

          // Calculate movement based on stats and current conditions
          let moveDistance = (camel.speed / 100) * (Math.random() * 3 + 1);
          
          // Check for obstacles
          const nearbyObstacle = obstacles.find(obs => 
            Math.abs(obs.position - camel.position) < 10 && 
            camel.position < obs.position
          );

          if (nearbyObstacle) {
            // Apply obstacle effects
            const hasUtility = camel.utilities.some(util => {
              if (nearbyObstacle.type === 'jump' && util === 'Jump Master') return true;
              if (nearbyObstacle.type === 'water' && util === 'Water Walker') return true;
              if (nearbyObstacle.type === 'sand' && util === 'Sand Walker') return true;
              return false;
            });

            if (!hasUtility) {
              moveDistance *= (100 - nearbyObstacle.difficulty) / 100;
              camel.currentStamina -= nearbyObstacle.difficulty / 5;
            }
          }

          // Apply stamina effects
          if (camel.currentStamina < 30) {
            moveDistance *= 0.7; // Tired camel moves slower
          }

          // Apply luck factor
          if (Math.random() < camel.luck / 1000) {
            moveDistance *= 1.5; // Lucky boost
          }

          // Apply utilities
          if (camel.utilities.includes('Speed Boost') && Math.random() < 0.1) {
            moveDistance *= 1.3;
          }

          if (camel.utilities.includes('Stamina Shield')) {
            camel.currentStamina = Math.max(camel.currentStamina, 40);
          }

          return {
            ...camel,
            position: Math.min(camel.position + moveDistance, trackLength),
            currentStamina: Math.max(camel.currentStamina - 0.1, 0)
          };
        });

        // Check for winner
        const finishedCamel = updatedCamels.find(camel => camel.position >= trackLength);
        if (finishedCamel && !raceFinished) {
          setRaceFinished(true);
          setWinner(finishedCamel);
          setIsRacing(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }

        return updatedCamels;
      });
    }, 100);
  };

  const pauseRace = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      startRace();
    } else {
      setIsRacing(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const resetRace = () => {
    setIsRacing(false);
    setIsPaused(false);
    setRaceFinished(false);
    setWinner(null);
    setRaceTime(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setCamels(prevCamels => prevCamels.map(camel => ({
      ...camel,
      position: 0,
      currentStamina: camel.stamina
    })));
  };

  const getObstacleIcon = (type: string) => {
    switch (type) {
      case 'jump': return '🪨';
      case 'water': return '💧';
      case 'sand': return '🏜️';
      default: return '⚡';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-amber-500" />
              600m Camel Racing Championship
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">
                Time: {raceTime.toFixed(1)}s
              </Badge>
              {winner && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600">
                  Winner: {winner.name}!
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Race Controls */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={startRace}
              disabled={isRacing && !isPaused}
              className="bg-gradient-to-r from-green-500 to-green-600"
            >
              <Play className="mr-2" size={16} />
              {raceFinished ? 'New Race' : 'Start'}
            </Button>
            
            <Button
              onClick={pauseRace}
              disabled={!isRacing && !isPaused}
              variant="outline"
            >
              <Pause className="mr-2" size={16} />
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            
            <Button onClick={resetRace} variant="outline">
              <RotateCcw className="mr-2" size={16} />
              Reset
            </Button>
          </div>

          {/* Race Track */}
          <div className="relative bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 mb-6 min-h-[400px]">
            {/* Track markers */}
            <div className="absolute top-2 left-4 right-4 flex justify-between text-xs text-gray-600">
              <span>0m</span>
              <span>150m</span>
              <span>300m</span>
              <span>450m</span>
              <span>600m 🏁</span>
            </div>

            {/* Obstacles */}
            {obstacles.map((obstacle, index) => (
              <div
                key={index}
                className="absolute top-8"
                style={{ left: `${(obstacle.position / trackLength) * 100}%` }}
              >
                <div className="text-2xl" title={`${obstacle.type} - Difficulty: ${obstacle.difficulty}`}>
                  {getObstacleIcon(obstacle.type)}
                </div>
              </div>
            ))}

            {/* Racing lanes */}
            {camels.map((camel, index) => (
              <div key={camel.id} className="relative mb-8 mt-12">
                {/* Lane */}
                <div className="h-12 bg-white/50 rounded-full relative border-2 border-gray-300">
                  {/* Camel */}
                  <div
                    className="absolute top-1 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-100"
                    style={{
                      left: `${(camel.position / trackLength) * 92}%`,
                      backgroundColor: camel.color
                    }}
                  >
                    🐪
                  </div>
                  
                  {/* Progress bar */}
                  <Progress
                    value={(camel.position / trackLength) * 100}
                    className="absolute top-0 h-full opacity-30"
                  />
                </div>

                {/* Camel info */}
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{camel.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {camel.owner}
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className={`text-xs ${
                        camel.rarity === 'legendary' ? 'bg-purple-100 text-purple-700' :
                        camel.rarity === 'epic' ? 'bg-indigo-100 text-indigo-700' :
                        camel.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {camel.rarity}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Stamina:</span>
                      <Progress value={(camel.currentStamina / camel.stamina) * 100} className="w-16 h-2 ml-1" />
                    </div>
                    <span>{camel.position.toFixed(0)}m</span>
                  </div>
                </div>

                {/* Utilities */}
                <div className="flex gap-1 mt-1">
                  {camel.utilities.map((utility, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      <Zap size={10} className="mr-1" />
                      {utility}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Race Results */}
          {raceFinished && winner && (
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-amber-700 mb-2">
                    🏆 {winner.name} Wins! 🏆
                  </h3>
                  <p className="text-amber-600">
                    Finished in {raceTime.toFixed(1)} seconds
                  </p>
                  <div className="mt-4 flex justify-center gap-4">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600">
                      +150 HABIBI Prize
                    </Badge>
                    <Badge variant="outline">
                      +1 Race Win
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}