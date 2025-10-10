import React, { useState, useEffect } from 'react';
import type { GameState } from '@/types/game';
import { loadGameState, saveGameState, updatePlayerStats, saveSlayerMasters, loadSlayerMasters, shouldRefreshStats, getLastSeenVersion, saveLastSeenVersion } from '@/utils/gameStorage';
import { generateVisibleTiles, canUnlockTile, unlockTile, generateInitialGameState, generateTasksForVisibleTiles } from '@/utils/gameLogic';
import { getTaskIcon } from '@/utils/taskGenerator';
import { SkillsPanel } from './SkillsPanel';
import { SlayerMastersPanel } from './SlayerMastersPanel';
import { SettingsModal } from './SettingsModal';
import { ChangelogModal } from './ChangelogModal';
import { ShopModal } from './ShopModal';
import { DailyTasksModal } from './DailyTasksModal';
import { SLAYER_REWARDS } from '@/config/rewards';
import { APP_VERSION, CURRENT_CHANGELOG } from '@/config/version';
import { generateAllDailyTasks, getTodayDateString } from '@/utils/generators/dailyTaskGenerator';
import { resetDailyTasksIfNewDay, saveDailyTasks, type DailyTasksState } from '@/utils/gameStorage';

interface GameBoardProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
}

export function GameBoard({ playerName, onPlayerNameChange }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(2); // 200% zoom na start
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showSlayerModal, setShowSlayerModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [dailyTasks, setDailyTasks] = useState(generateAllDailyTasks());
  const [dailyTasksState, setDailyTasksState] = useState<DailyTasksState>(() => 
    resetDailyTasksIfNewDay(getTodayDateString())
  );
  const [useRunescapeFont, setUseRunescapeFont] = useState(() => {
    const saved = localStorage.getItem('useRunescapeFont');
    return saved !== null ? saved === 'true' : true;
  });
  const [popupTile, setPopupTile] = useState<string | null>(null);
  const [hoverTile, setHoverTile] = useState<string | null>(null);
  const [clickedTile, setClickedTile] = useState<string | null>(null);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const gameBoardRef = React.useRef<HTMLDivElement>(null);
  const wheelListenerRef = React.useRef<((e: Event) => void) | null>(null);
  const [slayerMasters, setSlayerMasters] = useState([
    { name: 'Turael', image: '/src/assets/slayer_masters/Turael_head.png', tasksCompleted: 0, requiredTasks: SLAYER_REWARDS.tasksRequired.turael },
    { name: 'Spria', image: '/src/assets/slayer_masters/Spria_head.png', tasksCompleted: 0, requiredTasks: SLAYER_REWARDS.tasksRequired.spria },
    { name: 'Mazchna', image: '/src/assets/slayer_masters/Mazchna_head.png', tasksCompleted: 0, requiredTasks: SLAYER_REWARDS.tasksRequired.mazchna },
    { name: 'Vannaka', image: '/src/assets/slayer_masters/Vannaka_head.png', tasksCompleted: 0, requiredTasks: SLAYER_REWARDS.tasksRequired.vannaka },
    { name: 'Chaeldar', image: '/src/assets/slayer_masters/Chaeldar_head.png', tasksCompleted: 0, requiredTasks: SLAYER_REWARDS.tasksRequired.chaeldar },
    { name: 'Duradel', image: '/src/assets/slayer_masters/Duradel_head.png', tasksCompleted: 0, requiredTasks: SLAYER_REWARDS.tasksRequired.duradel },
    { name: 'Nieve', image: '/src/assets/slayer_masters/Nieve_head.png', tasksCompleted: 0, requiredTasks: SLAYER_REWARDS.tasksRequired.nieve },
    { name: 'Konar', image: '/src/assets/slayer_masters/Konar_head.png', tasksCompleted: 0, requiredTasks: SLAYER_REWARDS.tasksRequired.konar },
    { name: 'Krystilia', image: '/src/assets/slayer_masters/Krystilia_head.png', tasksCompleted: 0, requiredTasks: SLAYER_REWARDS.tasksRequired.krystilia },
  ]);

  useEffect(() => {
    const savedGame = loadGameState();
    if (savedGame && savedGame.playerName === playerName) {
      loadGame();
    }

    const savedSlayerMasters = loadSlayerMasters();
    if (savedSlayerMasters) {
      setSlayerMasters(savedSlayerMasters);
    }

    // Check version and show changelog if needed
    const lastSeenVersion = getLastSeenVersion();
    if (lastSeenVersion !== APP_VERSION) {
      setShowChangelogModal(true);
      saveLastSeenVersion(APP_VERSION);
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (useRunescapeFont) {
      document.body.classList.add('runescape-font');
      document.body.classList.remove('default-font');
    } else {
      document.body.classList.add('default-font');
      document.body.classList.remove('runescape-font');
    }
    localStorage.setItem('useRunescapeFont', String(useRunescapeFont));
  }, [useRunescapeFont]);

  // Check for new day and reset daily tasks
  useEffect(() => {
    const checkDailyReset = () => {
      const today = getTodayDateString();
      if (dailyTasksState.date !== today) {
        const newState = resetDailyTasksIfNewDay(today);
        setDailyTasksState(newState);
        setDailyTasks(generateAllDailyTasks());
      }
    };

    // Check on mount and every minute
    checkDailyReset();
    const interval = setInterval(checkDailyReset, 60000);
    return () => clearInterval(interval);
  }, [dailyTasksState.date]);

  useEffect(() => {
    if (!gameState) return;
    if (wheelListenerRef.current) return;
    
    const handleWheelEvent = (e: Event) => {
      const wheelEvent = e as WheelEvent;
      wheelEvent.preventDefault();
      const delta = wheelEvent.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
    };

    const gameContainer = gameBoardRef.current;
    if (gameContainer) {
      wheelListenerRef.current = handleWheelEvent;
      gameContainer.addEventListener('wheel', handleWheelEvent, { passive: false });
    }
  }, [gameState]);
  
  useEffect(() => {
    return () => {
      const gameContainer = gameBoardRef.current;
      if (gameContainer && wheelListenerRef.current) {
        gameContainer.removeEventListener('wheel', wheelListenerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameState) {
      generateTasksForVisibleTiles(gameState, gameState.playerName).then(updatedGameState => {
        if (JSON.stringify(updatedGameState.tileTasks) !== JSON.stringify(gameState.tileTasks)) {
          setGameState(updatedGameState);
          saveGameState(updatedGameState);
        }
      });
    }
  }, [gameState?.visibleTiles?.join(',')]);

  const loadGame = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const savedState = loadGameState();
      
      if (savedState && savedState.playerName === playerName) {
        if (shouldRefreshStats(savedState)) {
          try {
            const response = await fetch(`/api/hiscores/${encodeURIComponent(playerName)}`);
            if (response.ok) {
              const freshStats = await response.json();
              updatePlayerStats(freshStats);
              setGameState({ ...savedState, playerStats: freshStats, statsLastFetched: Date.now() });
              setTimeout(() => centerOnLastUnlockedTile(), 100);
            } else {
              console.warn('Failed to refresh stats, using cached data');
              setGameState(savedState);
              setTimeout(() => centerOnLastUnlockedTile(), 100);
            }
          } catch (fetchError) {
            console.warn('Error refreshing stats, using cached data:', fetchError);
            setGameState(savedState);
            setTimeout(() => centerOnLastUnlockedTile(), 100);
          }
        } else {
          setGameState(savedState);
          setTimeout(() => centerOnLastUnlockedTile(), 100);
        }
      } else {
        const response = await fetch(`/api/hiscores/${encodeURIComponent(playerName)}`);
        if (response.ok) {
          const playerStats = await response.json();
          const newGameState = await generateInitialGameState(playerName, playerStats);
          saveGameState(newGameState);
          setGameState(newGameState);
          setTimeout(() => centerOnLastUnlockedTile(), 100);
        } else {
          throw new Error('Character not found in OSRS. Check if the name is correct.');
        }
      }
    } catch (error: unknown) {
      console.error('Error loading game:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTileClick = async (tileId: string) => {
    if (!gameState) return;
    
    const isCompleted = gameState.completedTiles.includes(tileId);
    
    if (isCompleted) return;
    
    if (clickedTile === tileId) {
      setClickedTile(null);
    } else {
      setClickedTile(tileId);
    }
  };


  const handleUnlockTile = async (tileId: string) => {
    if (!gameState) return;
    
    try {
      const newGameState = unlockTile(tileId, gameState);
      
      setGameState(newGameState);
      saveGameState(newGameState);
      setPopupTile(null);
      setClickedTile(null);
      setHoverTile(null);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleCompleteTile = (tileId: string) => {
    if (!gameState) return;
    
    const task = gameState.tileTasks[tileId];
    if (!task) return;
    
    // Calculate rewards from task
    let goldReward = 0;
    let keysReward = 0;
    
    task.rewards.forEach(reward => {
      if (reward.type === 'gold') {
        goldReward += reward.amount;
      } else if (reward.type === 'keys') {
        keysReward += reward.amount;
      }
    });
    
    const newGameState = {
      ...gameState,
      completedTiles: [...gameState.completedTiles, tileId],
      gold: gameState.gold + goldReward,
      keys: gameState.keys + keysReward
    };
    
    setGameState(newGameState);
    saveGameState(newGameState);
    setPopupTile(null);
    setClickedTile(null);
    setHoverTile(null);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSlayerTaskComplete = (masterName: string) => {
    if (!gameState) return;
    
    setSlayerMasters(prev => {
      const updated = prev.map(master => {
        if (master.name === masterName) {
          const newCount = master.tasksCompleted + 1;
          const isCompleted = newCount >= master.requiredTasks;
          
          if (isCompleted) {
            // Calculate rewards from config
            const keysReward = SLAYER_REWARDS.keysPerMilestone;
            const goldReward = SLAYER_REWARDS.goldBonus;
            
            const newGameState = {
              ...gameState,
              keys: gameState.keys + keysReward,
              gold: gameState.gold + goldReward
            };
            setGameState(newGameState);
            saveGameState(newGameState);
            
            return {
              ...master,
              tasksCompleted: 0
            };
          } else {
            return {
              ...master,
              tasksCompleted: newCount
            };
          }
        }
        return master;
      });
      
      saveSlayerMasters(updated);
      return updated;
    });
  };

  const centerOnLastUnlockedTile = () => {
    if (!gameState || gameState.unlockedTiles.length === 0) {
      setPan({ x: 0, y: 0 });
      return;
    }

    const lastUnlockedTile = gameState.unlockedTiles[gameState.unlockedTiles.length - 1];
    if (!lastUnlockedTile) return;
    
    const [x, y] = lastUnlockedTile.split(',').map(Number);
    if (x === undefined || y === undefined) return;
    
    // Tile has size 88px (80px + 8px gap), so center is x * 88 + 44
    const tileCenterX = x * 88 + 44;
    const tileCenterY = y * 88 + 44;
    
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;
    
    const offsetX = screenCenterX - tileCenterX;
    const offsetY = screenCenterY - tileCenterY;
    
    setPan({ x: offsetX, y: offsetY });
  };

  const handleResetProgress = () => {
    const currentFontPreference = useRunescapeFont;
    localStorage.clear();
    localStorage.setItem('useRunescapeFont', String(currentFontPreference));
    window.location.reload();
  };

  const handlePurchase = (itemType: 'key', amount: number, cost: number) => {
    if (!gameState) return;
    
    if (gameState.gold >= cost) {
      const updatedState = {
        ...gameState,
        gold: gameState.gold - cost,
        keys: gameState.keys + amount
      };
      setGameState(updatedState);
      saveGameState(updatedState);
      setShowShopModal(false);
    }
  };

  const handleCompleteDailyTask = (difficulty: 'easy' | 'medium' | 'hard' | 'elite') => {
    if (!gameState || dailyTasksState.completedTasks[difficulty]) return;

    const task = dailyTasks[difficulty];
    
    let goldReward = 0;
    let keysReward = 0;
    
    task.rewards.forEach(reward => {
      if (reward.type === 'gold') {
        goldReward += reward.amount;
      } else if (reward.type === 'keys') {
        keysReward += reward.amount;
      }
    });

    const updatedGameState = {
      ...gameState,
      gold: gameState.gold + goldReward,
      keys: gameState.keys + keysReward
    };
    setGameState(updatedGameState);
    saveGameState(updatedGameState);

    const updatedDailyState = {
      ...dailyTasksState,
      completedTasks: {
        ...dailyTasksState.completedTasks,
        [difficulty]: true
      }
    };
    setDailyTasksState(updatedDailyState);
    saveDailyTasks(updatedDailyState);
  };


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center w-full max-w-md">
          <div 
            className="p-8 rounded-lg border-2 w-full"
            style={{
              backgroundColor: '#2d2925',
              borderColor: '#8B4545'
            }}
          >
            <h1 className="text-2xl font-bold text-red-400 text-center mb-4">Opps...</h1>
            <p className="text-gray-300 text-center mb-6">{error}</p>
            <div className="space-y-4">
              <input
                type="text"
                value={playerName}
                onChange={(e) => onPlayerNameChange(e.target.value)}
                placeholder="Enter a valid character name"
                disabled={isLoading}
                className="w-full px-4 py-2 text-white border rounded focus:outline-none"
                style={{
                  backgroundColor: '#1e1812',
                  borderColor: isLoading ? '#4a443f' : '#574f47'
                }}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && loadGame()}
              />
              <button
                onClick={() => loadGame()}
                disabled={isLoading}
                className="w-full px-6 py-2 rounded text-white transition-colors border"
                style={{
                  background: isLoading ? '#4a443f' : 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)',
                  borderColor: '#3D2F24',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#6a5344')}
                onMouseLeave={(e) => !isLoading && (e.currentTarget.style.background = 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)')}
              >
                {isLoading ? 'Checking character...' : 'Try again'}
              </button>
            </div>
          </div>
          
          {/* Copyright Notice */}
          <div className="mt-6 text-center text-xs text-gray-300 px-4 max-w-lg">
            <p>
              RuneScape® and all related content are the property of Jagex Ltd. 
              Used here under fair use/fan content purposes. 
              This site is not affiliated with or endorsed by Jagex.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center w-full max-w-md">
          <div 
            className="p-8 rounded-lg border-2 w-full"
            style={{
              backgroundColor: '#2d2925',
              borderColor: '#4a443f'
            }}
          >
            <h1 className="text-3xl font-bold text-white text-center mb-6">RuneTile</h1>
            
            <div className="space-y-4">
              <input
                type="text"
                value={playerName}
                onChange={(e) => onPlayerNameChange(e.target.value)}
                placeholder="Enter your OSRS name"
                disabled={isLoading}
                className="w-full px-4 py-2 text-white border rounded focus:outline-none"
                style={{
                  backgroundColor: '#1e1812',
                  borderColor: isLoading ? '#4a443f' : '#574f47',
                  cursor: isLoading ? 'not-allowed' : 'text',
                  opacity: isLoading ? 0.5 : 1
                }}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && loadGame()}
              />
              <button
                onClick={() => loadGame()}
                disabled={!playerName.trim() || isLoading}
                className="w-full px-6 py-2 rounded text-white transition-colors border"
                style={{
                  background: (!playerName.trim() || isLoading) ? '#4a443f' : 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)',
                  borderColor: '#3D2F24',
                  cursor: (!playerName.trim() || isLoading) ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && playerName.trim()) {
                    e.currentTarget.style.backgroundColor = '#6a5344';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && playerName.trim()) {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)';
                  }
                }}
              >
                {isLoading ? 'Checking player...' : 'Start game'}
              </button>
            </div>
          </div>
          
          {/* Copyright Notice */}
          <div className="mt-6 text-center text-xs text-gray-300 px-4 max-w-lg">
            <p>
              RuneScape® and all related content are the property of Jagex Ltd. 
              Used here under fair use/fan content purposes. 
              This site is not affiliated with or endorsed by Jagex.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={gameBoardRef} className="game-board min-h-screen text-white w-full">
      <div className="flex h-screen w-full">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <div 
            className="p-3 rounded border-2 flex flex-col items-center"
            style={{
              backgroundColor: '#3a3530',
              borderColor: '#574f47'
            }}
          >
            <img 
              src="/src/assets/menu/key_icon.png" 
              alt="Key" 
              className="w-6 h-6 mb-1"
            />
            <div className="text-white font-bold text-lg">{gameState.keys}</div>
          </div>
          <button
            onClick={() => setShowShopModal(true)}
            className="p-3 rounded border-2 flex flex-col items-center transition-colors cursor-pointer"
            style={{
              backgroundColor: '#3a3530',
              borderColor: '#574f47'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a443f'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3a3530'}
            title="Open Shop"
          >
            <img 
              src="/src/assets/menu/gold_icon.png" 
              alt="Gold" 
              className="w-6 h-6 mb-1"
            />
            <div className="text-white font-bold text-lg">{gameState.gold.toLocaleString()}</div>
          </button>
          <button
            onClick={() => setShowSkillsModal(!showSkillsModal)}
            className="p-3 rounded border-2 flex flex-col items-center transition-colors"
            style={{
              backgroundColor: '#3a3530',
              borderColor: '#574f47'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a443f'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3a3530'}
            title="Skills"
          >
            <img 
              src="/src/assets/menu/Stats_icon.png" 
              alt="Stats" 
              className="w-6 h-6 mb-1"
            />
            <div className="text-white font-bold text-sm">Stats</div>
          </button>
        </div>


        {/* Left panel */}
        <div className="absolute left-4 top-32 z-10 flex flex-col gap-2">
          {/* Daily */}
          <button 
            onClick={() => setShowDailyModal(true)}
            className="p-3 rounded border-2 flex flex-col items-center transition-colors"
            style={{
              backgroundColor: '#3a3530',
              borderColor: '#574f47'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a443f'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3a3530'}
          >
            <img 
              src="/src/assets/menu/Daily_icon.png" 
              alt="Daily" 
              className="w-6 h-6 mb-1"
            />
            <div className="text-white font-bold text-sm">Daily</div>
          </button>

          {/* Slayer */}
          <button 
            onClick={() => setShowSlayerModal(!showSlayerModal)}
            className="p-3 rounded border-2 flex flex-col items-center transition-colors"
            style={{
              backgroundColor: '#3a3530',
              borderColor: '#574f47'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a443f'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3a3530'}
          >
            <img 
              src="/src/assets/menu/SlayerMasters_icon.png" 
              alt="Slayer" 
              className="w-6 h-6 mb-1"
            />
            <div className="text-white font-bold text-sm">Slayer</div>
          </button>

          {/* Bosses */}
          <button 
            className="p-3 rounded border-2 flex flex-col items-center transition-colors"
            style={{
              backgroundColor: '#3a3530',
              borderColor: '#574f47',
              display: 'none' // Hidden for now
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a443f'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3a3530'}
          >
            <img 
              src="/src/assets/tasks/Bosses_icon.png" 
              alt="Bosses" 
              className="w-6 h-6 mb-1"
            />
            <div className="text-white font-bold text-sm">Bosses</div>
          </button>
        </div>

        {/* Main board */}
        <div className="flex-1 flex flex-col relative">
          {/* Zoom controls and Settings */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-10 h-10 text-white border-2 rounded transition-colors flex items-center justify-center"
              style={{
                backgroundColor: '#3a3530',
                borderColor: '#574f47'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a443f'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3a3530'}
            >
              <img 
                src="/src/assets/menu/Settings_icon.png" 
                alt="Settings" 
                className="w-6 h-6"
              />
            </button>
            <button
              onClick={() => handleZoom(0.1)}
              className="w-10 h-10 text-white border-2 rounded transition-colors"
              style={{
                backgroundColor: '#3a3530',
                borderColor: '#574f47'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a443f'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3a3530'}
            >
              +
            </button>
            <button
              onClick={() => handleZoom(-0.1)}
              className="w-10 h-10 text-white border-2 rounded transition-colors"
              style={{
                backgroundColor: '#3a3530',
                borderColor: '#574f47'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a443f'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3a3530'}
            >
              -
            </button>
            <div 
              className="w-10 h-10 text-white border-2 rounded flex items-center justify-center text-xs"
              style={{
                backgroundColor: '#3a3530',
                borderColor: '#574f47'
              }}
            >
              {Math.round(zoom * 100)}%
            </div>
          </div>

           {/* Grid of tiles with zoom and pan */}
          <div 
            className="flex-1 flex items-center justify-center p-8 w-full overflow-hidden"
            onMouseDown={(e) => {
              handleMouseDown(e);
              if ((e.target as HTMLElement).closest('.tile-element') === null) {
                setClickedTile(null);
              }
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div 
              className="relative"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center'
              }}
            >
                      {generateVisibleTiles(gameState).map(({ x, y }) => {
                        const tileId = `${x},${y}`;
                        const isUnlocked = gameState.unlockedTiles.includes(tileId);
                        const isCompleted = gameState.completedTiles.includes(tileId);
                        const canUnlock = canUnlockTile(tileId, gameState);
                        const task = gameState.tileTasks[tileId];
                        
                        // Determine tile state
                        let tileState: 'locked' | 'unlocked' | 'completed';
                        if (isCompleted) {
                          tileState = 'completed';
                        } else if (isUnlocked) {
                          tileState = 'unlocked';
                        } else {
                          tileState = 'locked';
                        }
                        
                        //console.log('Rendering tile:', tileId, 'state:', tileState, 'canUnlock:', canUnlock);
                        
                        return (
                          <div
                            key={tileId}
                            className={`
                              tile-element
                              absolute w-20 h-20 cursor-pointer
                              ${tileState === 'completed' 
                                ? 'opacity-60' 
                                : tileState === 'unlocked'
                                  ? 'hover:scale-105 transition-transform'
                                  : canUnlock
                                    ? 'hover:scale-105 transition-transform'
                                    : 'opacity-50'
                              }
                            `}
                            style={{
                              left: `${x * 88}px`, // 88px = 80px (width) + 8px (gap)
                              top: `${y * 88}px`,
                              imageRendering: 'pixelated',
                              fontFamily: 'monospace'
                            }}
                            onClick={(e) => {
                              if (e.target !== e.currentTarget && (e.target as HTMLElement).closest('.hover-panel')) {
                                return;
                              }
                              handleTileClick(tileId);
                            }}
                            onMouseEnter={() => {
                              if (hoverTimeoutRef.current) {
                                clearTimeout(hoverTimeoutRef.current);
                                hoverTimeoutRef.current = null;
                              }
                              setHoverTile(tileId);
                            }}
                            onMouseLeave={() => {
                              hoverTimeoutRef.current = setTimeout(() => {
                                setHoverTile(null);
                                hoverTimeoutRef.current = null;
                              }, 100);
                            }}
                            title={task ? `${task.title}\n${task.description}` : undefined}
                          >
                            {/* Background */}
                            <div 
                              className="absolute inset-0 border-2 rounded-sm"
                              style={{
                                backgroundColor: tileState === 'completed' ? '#3a3530' : '#3a3530',
                                borderColor: tileState === 'completed' ? '#574f47' : '#574f47',
                                boxShadow: tileState === 'unlocked' ? '0 0 8px rgba(87, 79, 71, 0.3)' : 'none'
                              }}
                            />
                            
                            {/* Pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-sm" />
                            
                            {/* Inner frame */}
                            <div className="absolute inset-1 border border-black/20 rounded-sm" />
                            {/* Task icon */}
                            {task && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <img 
                                  src={getTaskIcon(task.category, task.skillName)} 
                                  alt={task.category}
                                  className={`
                                    w-10 h-10
                                    ${tileState === 'locked' ? 'opacity-40' : 'opacity-100'}
                                    ${tileState === 'completed' ? 'opacity-60' : ''}
                                  `}
                                  style={{ imageRendering: 'pixelated' }}
                                />
                              </div>
                            )}
                            
                            {tileState === 'completed' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-green-400 text-4xl font-bold drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                  ✓
                                </div>
                              </div>
                            )}
                            
                            {tileState === 'locked' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-yellow-400 text-3xl font-bold drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                  🔒
                                </div>
                              </div>
                            )}
                            
                            {tileState !== 'completed' && (
                              <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity rounded-sm" />
                            )}
                          </div>
                        );
                      })}
                      
                      {hoverTile && !popupTile && (() => {
                        const task = gameState.tileTasks[hoverTile];
                        const parts = hoverTile.split(',');
                        const x = parseInt(parts[0] || '0', 10);
                        const y = parseInt(parts[1] || '0', 10);
                        const tileLeft = x * 88;
                        const tileTop = y * 88;
                        const tileWidth = 80;
                        
                        return (
                          <div 
                            className="hover-panel absolute z-20 pointer-events-auto animate-in fade-in duration-500"
                            style={{
                              left: `${tileLeft + tileWidth + 8}px`,
                              top: `${tileTop}px`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            onMouseEnter={() => {
                              if (hoverTimeoutRef.current) {
                                clearTimeout(hoverTimeoutRef.current);
                                hoverTimeoutRef.current = null;
                              }
                              setHoverTile(hoverTile);
                            }}
                            onMouseLeave={(e) => {
                              const relatedTarget = e.relatedTarget as Node | null;
                              if (relatedTarget && relatedTarget instanceof Node && e.currentTarget.contains(relatedTarget)) {
                                return;
                              }
                              setHoverTile(null);
                            }}
                          >
                            <div 
                              className="p-3 rounded border-2 shadow-lg flex items-center gap-3 min-w-[200px] transition-all duration-300"
                              style={{
                                backgroundColor: 'rgba(58, 53, 48, 0.95)',
                                borderColor: '#574f47'
                              }}
                            >
                              {task && (
                                <img 
                                  src={getTaskIcon(task.category, task.skillName)} 
                                  alt={task.category}
                                  className="w-8 h-8 opacity-40"
                                  style={{ imageRendering: 'pixelated' }}
                                />
                              )}
                              <div className="text-sm text-white font-semibold">
                                {task?.title || 'Unknown task'}
                              </div>
                            </div>
                            
                            {clickedTile === hoverTile && (() => {
                              const isUnlocked = gameState.unlockedTiles.includes(hoverTile);
                              const isCompleted = gameState.completedTiles.includes(hoverTile);
                              const canUnlock = canUnlockTile(hoverTile, gameState);
                              
                              if (isCompleted) return null;
                              
                              return (
                                <div 
                                  className="p-3 rounded border-2 shadow-lg mt-2 animate-in slide-in-from-top duration-300"
                                  style={{
                                    backgroundColor: 'rgba(58, 53, 48, 0.95)',
                                    borderColor: '#574f47'
                                  }}
                                >
                                  <div className="text-sm text-gray-300 mb-3">
                                    {task?.description}
                                  </div>
                                  
                                  {isUnlocked ? (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleCompleteTile(hoverTile);
                                      }}
                                      onMouseDown={(e) => {
                                        e.stopPropagation();
                                      }}
                                      className="w-full px-4 py-2 text-white rounded flex items-center justify-center gap-2 pixel-button"
                                      style={{
                                        background: 'linear-gradient(180deg, #6B9E4E 0%, #4A7A34 50%, #2F5522 100%)',
                                        border: '2px solid',
                                        borderColor: '#2F5522',
                                        borderTopColor: '#8FBF6F',
                                        borderLeftColor: '#8FBF6F',
                                        boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
                                        imageRendering: 'pixelated',
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <span className="text-lg">✓</span>
                                      <span>Complete</span>
                                    </button>
                                  ) : canUnlock ? (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleUnlockTile(hoverTile);
                                      }}
                                      onMouseDown={(e) => {
                                        e.stopPropagation();
                                      }}
                                      className="w-full px-4 py-2 text-white rounded flex items-center justify-center gap-2 pixel-button"
                                      style={{
                                        background: gameState.keys < 1 
                                          ? 'linear-gradient(180deg, #555 0%, #333 100%)' 
                                          : 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)',
                                        border: '2px solid',
                                        borderColor: gameState.keys < 1 ? '#666' : '#3D2F24',
                                        borderTopColor: gameState.keys < 1 ? '#888' : '#A89070',
                                        borderLeftColor: gameState.keys < 1 ? '#888' : '#A89070',
                                        boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
                                        imageRendering: 'pixelated',
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                                        cursor: gameState.keys < 1 ? 'not-allowed' : 'pointer'
                                      }}
                                      disabled={gameState.keys < 1}
                                    >
                                      <img 
                                        src="/src/assets/menu/key_icon.png" 
                                        alt="Key" 
                                        className="w-4 h-4"
                                        style={{ imageRendering: 'pixelated' }}
                                      />
                                      <span>Unlock</span>
                                    </button>
                                  ) : null}
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })()}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Popup */}
      {showSkillsModal && (
        <div className="absolute top-4 left-32 z-20">
          <div 
            className="p-3 rounded border-2"
            style={{
              backgroundColor: '#3a3530',
              borderColor: '#574f47'
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-white">Skills</h3>
              <button
                onClick={() => setShowSkillsModal(false)}
                className="text-white hover:text-gray-300 text-lg"
              >
                ×
              </button>
            </div>
            <SkillsPanel playerStats={gameState.playerStats} statsLastFetched={gameState.statsLastFetched} />
          </div>
        </div>
      )}

              {/* Slayer Masters Popup */}
              {showSlayerModal && (
                <div className="absolute top-32 left-32 z-20">
                  <div 
                    className="p-4 rounded border-2 max-w-2xl"
                    style={{
                      backgroundColor: '#3a3530',
                      borderColor: '#574f47'
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-white">Slayer Masters</h3>
                      <button
                        onClick={() => setShowSlayerModal(false)}
                        className="text-white hover:text-gray-300 text-lg"
                      >
                        ×
                      </button>
                    </div>
                    <SlayerMastersPanel 
                      slayerMasters={slayerMasters} 
                      onTaskComplete={handleSlayerTaskComplete}
                    />
                  </div>
                </div>
              )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        useRunescapeFont={useRunescapeFont}
        onFontChange={setUseRunescapeFont}
        onResetProgress={handleResetProgress}
        onViewChangelog={() => setShowChangelogModal(true)}
      />

      {/* Changelog Modal */}
      {showChangelogModal && (
        <ChangelogModal
          changelog={CURRENT_CHANGELOG}
          onClose={() => setShowChangelogModal(false)}
        />
      )}

      {/* Shop Modal */}
      <ShopModal
        isOpen={showShopModal}
        onClose={() => setShowShopModal(false)}
        currentGold={gameState.gold}
        currentKeys={gameState.keys}
        onPurchase={handlePurchase}
      />

      {/* Daily Tasks Modal */}
      <DailyTasksModal
        isOpen={showDailyModal}
        onClose={() => setShowDailyModal(false)}
        tasks={dailyTasks}
        completedTasks={dailyTasksState.completedTasks}
        onCompleteTask={handleCompleteDailyTask}
      />
            </div>
          );
        }
