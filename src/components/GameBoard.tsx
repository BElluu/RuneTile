import React, { useState, useEffect } from 'react';
import type { GameState, Tile, TileState, Task, TaskCategory } from '@/types/game';
import { loadGameState, saveGameState, updatePlayerStats } from '@/utils/gameStorage';
import { generateVisibleTiles, isTileVisible, canUnlockTile, unlockTile } from '@/utils/gameLogic';

interface GameBoardProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
}

export function GameBoard({ playerName, onPlayerNameChange }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);

  // Załaduj stan gry przy starcie tylko jeśli gracz jest już zapisany
  useEffect(() => {
    const savedGame = loadGameState();
    if (savedGame && savedGame.playerName === playerName.toLowerCase()) {
      // Automatycznie załaduj zapisanego gracza
      loadGame();
    }
  }, []);

  const loadGame = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Sprawdź czy istnieje zapisany stan gry
      const savedState = loadGameState();
      
      if (savedState && savedState.playerName === playerName.toLowerCase()) {
        // Aktualizuj statystyki gracza używając proxy endpointu
        const response = await fetch(`/api/hiscores/${encodeURIComponent(playerName)}`);
        if (response.ok) {
          const freshStats = await response.json();
          updatePlayerStats(freshStats);
          setGameState({ ...savedState, playerStats: freshStats });
        } else {
          console.error('Błąd podczas pobierania statystyk');
          setGameState(savedState);
        }
      } else {
        // Nowa gra - pobierz statystyki i stwórz nowy stan
        const response = await fetch(`/api/hiscores/${encodeURIComponent(playerName)}`);
        if (response.ok) {
          const playerStats = await response.json();
          const newGameState = {
            playerName: playerName.toLowerCase(),
            playerStats,
            keys: 1,
            unlockedTiles: [],
            completedTiles: [],
            visibleTiles: ['0,0'],
            keySources: [
              {
                id: 'slayer_master',
                name: 'Slayer Tasks',
                description: 'Wykonaj zadania od Slayer Mastera',
                category: 'slayer' as TaskCategory,
                keysRewarded: 1,
                completed: false,
                currentCount: 0,
                requiredCount: 5,
                icon: '💀'
              },
              {
                id: 'dungeon_clear',
                name: 'Dungeons',
                description: 'Wykonaj dungeons',
                category: 'dungeon' as TaskCategory,
                keysRewarded: 2,
                completed: false,
                currentCount: 0,
                requiredCount: 3,
                icon: '🏰'
              },
              {
                id: 'boss_kill',
                name: 'Barrows',
                description: 'Zabij bossów Barrows',
                category: 'boss' as TaskCategory,
                keysRewarded: 3,
                completed: false,
                currentCount: 0,
                requiredCount: 5,
                icon: '⚔️'
              },
              {
                id: 'collection_log',
                name: 'Collection Log',
                description: 'Wypełnij wpisy w Collection Log',
                category: 'collection_log' as TaskCategory,
                keysRewarded: 1,
                completed: false,
                currentCount: 0,
                requiredCount: 10,
                icon: '📋'
              }
            ],
            lastUpdated: Date.now()
          };
          saveGameState(newGameState);
          setGameState(newGameState);
        } else {
          throw new Error('Gracz nie został znaleziony w systemie OSRS. Sprawdź czy nazwa jest poprawna.');
        }
      }
    } catch (error: unknown) {
      console.error('Błąd podczas ładowania gry:', error);
      setError(error instanceof Error ? error.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTileClick = (tileId: string) => {
    if (!gameState) return;
    
    if (canUnlockTile(tileId, gameState)) {
      try {
        const newGameState = unlockTile(tileId, gameState);
        setGameState(newGameState);
        saveGameState(newGameState);
      } catch (error: unknown) {
        alert(error instanceof Error ? error.message : 'Nieznany błąd');
      }
    } else {
      setSelectedTile(tileId);
    }
  };

  const handleKeySourceIncrement = (sourceId: string) => {
    if (!gameState) return;
    
    const source = gameState.keySources.find(s => s.id === sourceId);
    if (source && !source.completed) {
      const newCount = source.currentCount + 1;
      const isCompleted = newCount >= source.requiredCount;
      
      const newGameState = {
        ...gameState,
        keys: isCompleted ? gameState.keys + source.keysRewarded : gameState.keys,
        keySources: gameState.keySources.map(s => 
          s.id === sourceId 
            ? { 
                ...s, 
                currentCount: newCount,
                completed: isCompleted
              } 
            : s
        )
      };
      setGameState(newGameState);
      saveGameState(newGameState);
    }
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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(delta);
  };


  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg border-2 border-red-700 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-400 text-center mb-4">Błąd</h1>
          <p className="text-gray-300 text-center mb-6">{error}</p>
          <div className="space-y-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => onPlayerNameChange(e.target.value)}
              placeholder="Wprowadź poprawną nazwę gracza"
              disabled={isLoading}
              className={`w-full px-4 py-2 bg-gray-800 text-white border rounded focus:outline-none ${
                isLoading 
                  ? 'border-gray-500 cursor-not-allowed opacity-50' 
                  : 'border-gray-600 focus:border-blue-500'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && loadGame()}
            />
            <button
              onClick={() => loadGame()}
              disabled={isLoading}
              className={`w-full px-6 py-2 rounded ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isLoading ? 'Sprawdzanie gracza...' : 'Spróbuj ponownie'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg border-2 border-gray-700 max-w-md w-full">
          <h1 className="text-3xl font-bold text-white text-center mb-6">RuneTile</h1>
          <p className="text-gray-300 text-center mb-6">
            Companion aplikacja dla RuneScape Old School
          </p>
          
          <div className="space-y-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => onPlayerNameChange(e.target.value)}
              placeholder="Wprowadź nazwę gracza"
              disabled={isLoading}
              className={`w-full px-4 py-2 bg-gray-800 text-white border rounded focus:outline-none ${
                isLoading 
                  ? 'border-gray-500 cursor-not-allowed opacity-50' 
                  : 'border-gray-600 focus:border-blue-500'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && loadGame()}
            />
            <button
              onClick={() => loadGame()}
              disabled={!playerName.trim() || isLoading}
              className={`w-full px-6 py-2 rounded ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } ${
                !playerName.trim() && !isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : ''
              } text-white`}
            >
              {isLoading ? 'Sprawdzanie gracza...' : 'Rozpocznij grę'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-board bg-black min-h-screen text-white w-full">
      <div className="flex h-screen w-full">
        {/* Lewy panel - Liczniki kluczy */}
        <div className="w-96 bg-gray-900 border-r-2 border-gray-700 p-6">
          {/* HUD */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gray-800 p-3 rounded border-2 border-gray-600">
                <div className="text-yellow-400 text-2xl">💰</div>
                <div className="text-white font-bold text-lg">0</div>
              </div>
              <div className="bg-gray-800 p-3 rounded border-2 border-gray-600">
                <div className="text-yellow-400 text-2xl">🔑</div>
                <div className="text-white font-bold text-lg">{gameState.keys}</div>
              </div>
            </div>
            <div className="text-sm text-gray-300">
              Gracz: <span className="font-bold">{gameState.playerName}</span>
            </div>
            <div className="text-sm text-gray-300">
              Odblokowane: {gameState.unlockedTiles.length}
            </div>
          </div>

          {/* Liczniki kluczy */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold mb-4 text-yellow-400">Źródła kluczy</h3>
            {gameState.keySources.map((source) => (
              <div
                key={source.id}
                className={`p-3 rounded border-2 ${
                  source.completed 
                    ? 'bg-green-800 border-green-600' 
                    : 'bg-gray-800 border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{source.icon}</span>
                  <div className="font-medium text-sm">{source.name}</div>
                </div>
                <div className="text-xs text-gray-300 mb-2">{source.description}</div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-yellow-400">{source.currentCount}</span>
                    <span className="text-gray-400">/{source.requiredCount}</span>
                  </div>
                  {!source.completed && (
                    <button
                      onClick={() => handleKeySourceIncrement(source.id)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-500 border border-blue-500"
                    >
                      +1
                    </button>
                  )}
                </div>
                {source.completed && (
                  <div className="text-xs text-green-400 mt-1">✅ Ukończone!</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Główna plansza */}
        <div className="flex-1 flex flex-col relative">
          {/* Kontrolki zoom */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button
              onClick={() => handleZoom(0.1)}
              className="w-10 h-10 bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
            >
              +
            </button>
            <button
              onClick={() => handleZoom(-0.1)}
              className="w-10 h-10 bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
            >
              -
            </button>
            <div className="w-10 h-10 bg-gray-800 text-white border border-gray-600 rounded flex items-center justify-center text-xs">
              {Math.round(zoom * 100)}%
            </div>
          </div>

          {/* Siatka kafelków z zoom i pan */}
          <div 
            className="flex-1 flex items-center justify-center p-8 w-full overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
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
                const canUnlock = canUnlockTile(tileId, gameState);
                
                console.log('Rendering tile:', tileId, 'unlocked:', isUnlocked, 'canUnlock:', canUnlock);
                
                return (
                  <div
                    key={tileId}
                    className={`
                      absolute w-20 h-20 border-2 cursor-pointer flex items-center justify-center text-2xl
                      ${isUnlocked 
                        ? 'bg-green-600 border-green-400' 
                        : canUnlock 
                          ? 'bg-blue-600 border-blue-400 hover:bg-blue-500' 
                          : 'bg-gray-600 border-gray-400'
                      }
                    `}
                    style={{
                      left: `${(x + 10) * 88}px`, // 88px = 80px (width) + 8px (gap)
                      top: `${(y + 10) * 88}px`,
                      imageRendering: 'pixelated',
                      fontFamily: 'monospace'
                    }}
                    onClick={() => handleTileClick(tileId)}
                  >
                    {isUnlocked ? '✅' : '🔒'}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Szczegóły wybranego kafelka */}
          {selectedTile && (
            <div className="bg-gray-800 p-4 border-t-2 border-gray-700">
              <h3 className="font-bold mb-2">Kafelek {selectedTile}</h3>
              <div className="text-sm text-gray-300">
                {canUnlockTile(selectedTile, gameState) 
                  ? 'Możesz odblokować ten kafelek!' 
                  : 'Ten kafelek nie może być odblokowany'
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
