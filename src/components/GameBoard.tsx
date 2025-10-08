import React, { useState, useEffect } from 'react';
import type { GameState, Tile, TileState, Task, TaskCategory } from '@/types/game';
import { loadGameState, saveGameState, updatePlayerStats, saveSlayerMasters, loadSlayerMasters } from '@/utils/gameStorage';
import { generateVisibleTiles, isTileVisible, canUnlockTile, unlockTile, generateInitialGameState, generateTasksForVisibleTiles } from '@/utils/gameLogic';
import { getTaskIcon } from '@/utils/taskGenerator';
import { SkillsPanel } from './SkillsPanel';
import { SlayerMastersPanel } from './SlayerMastersPanel';

interface GameBoardProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
}

export function GameBoard({ playerName, onPlayerNameChange }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [zoom, setZoom] = useState(2); // 200% zoom na start
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showSlayerModal, setShowSlayerModal] = useState(false);
  const [popupTile, setPopupTile] = useState<string | null>(null); // State for popup tile
  const [hoverTile, setHoverTile] = useState<string | null>(null); // State for hover tile
  const [slayerMasters, setSlayerMasters] = useState([
    { name: 'Turael', image: '/src/assets/slayer_masters/Turael_head.png', tasksCompleted: 0, requiredTasks: 5 },
    { name: 'Spria', image: '/src/assets/slayer_masters/Spria_head.png', tasksCompleted: 0, requiredTasks: 5 },
    { name: 'Mazchna', image: '/src/assets/slayer_masters/Mazchna_head.png', tasksCompleted: 0, requiredTasks: 5 },
    { name: 'Vannaka', image: '/src/assets/slayer_masters/Vannaka_head.png', tasksCompleted: 0, requiredTasks: 5 },
    { name: 'Chaeldar', image: '/src/assets/slayer_masters/Chaeldar_head.png', tasksCompleted: 0, requiredTasks: 5 },
    { name: 'Duradel', image: '/src/assets/slayer_masters/Duradel_head.png', tasksCompleted: 0, requiredTasks: 5 },
    { name: 'Nieve', image: '/src/assets/slayer_masters/Nieve_head.png', tasksCompleted: 0, requiredTasks: 5 },
    { name: 'Konar', image: '/src/assets/slayer_masters/Konar_head.png', tasksCompleted: 0, requiredTasks: 5 },
    { name: 'Krystilia', image: '/src/assets/slayer_masters/Krystilia_head.png', tasksCompleted: 0, requiredTasks: 5 },
  ]);

  // Załaduj stan gry przy starcie tylko jeśli gracz jest już zapisany
  useEffect(() => {
    const savedGame = loadGameState();
    if (savedGame && savedGame.playerName === playerName.toLowerCase()) {
      // Automatycznie załaduj zapisanego gracza
      loadGame();
    }
    
    // Załaduj stan slayer masterów
    const savedSlayerMasters = loadSlayerMasters();
    if (savedSlayerMasters) {
      setSlayerMasters(savedSlayerMasters);
    }
  }, []);

  // Generuj zadania dla widocznych kafelków gdy stan gry się zmieni
  useEffect(() => {
    if (gameState) {
      generateTasksForVisibleTiles(gameState, gameState.playerName).then(updatedGameState => {
        if (JSON.stringify(updatedGameState.tileTasks) !== JSON.stringify(gameState.tileTasks)) {
          setGameState(updatedGameState);
          saveGameState(updatedGameState);
        }
      });
    }
  }, [gameState?.visibleTiles?.join(',')]); // Użyj stringa zamiast tablicy

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
          // Wycentruj na ostatnim odblokowanym kafelku po załadowaniu
          setTimeout(() => centerOnLastUnlockedTile(), 100);
        } else {
          console.error('Błąd podczas pobierania statystyk');
          setGameState(savedState);
          // Wycentruj na ostatnim odblokowanym kafelku po załadowaniu
          setTimeout(() => centerOnLastUnlockedTile(), 100);
        }
      } else {
        // Nowa gra - pobierz statystyki i stwórz nowy stan
        const response = await fetch(`/api/hiscores/${encodeURIComponent(playerName)}`);
        if (response.ok) {
          const playerStats = await response.json();
          const newGameState = await generateInitialGameState(playerName.toLowerCase(), playerStats);
          saveGameState(newGameState);
          setGameState(newGameState);
          // Wycentruj na ostatnim odblokowanym kafelku po załadowaniu
          setTimeout(() => centerOnLastUnlockedTile(), 100);
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

  const handleTileClick = async (tileId: string) => {
    if (!gameState) return;
    
    const isUnlocked = gameState.unlockedTiles.includes(tileId);
    const isCompleted = gameState.completedTiles.includes(tileId);
    const canUnlock = canUnlockTile(tileId, gameState);
    
    if (isCompleted) {
      // Kafelek już ukończony - pokaż szczegóły
      setSelectedTile(tileId);
    } else if (isUnlocked) {
      // Kafelek odblokowany - pokaż popup do ukończenia
      setPopupTile(tileId);
    } else if (canUnlock) {
      // Kafelek można odblokować - pokaż popup do odblokowania
      setPopupTile(tileId);
    } else {
      // Kafelek zablokowany - pokaż szczegóły
      setSelectedTile(tileId);
    }
  };


  const handleUnlockTile = async (tileId: string) => {
    if (!gameState) return;
    
    try {
      const newGameState = unlockTile(tileId, gameState);
      
      setGameState(newGameState);
      saveGameState(newGameState);
      setPopupTile(null); // Zamknij popup
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Nieznany błąd');
    }
  };

  const handleCompleteTile = (tileId: string) => {
    if (!gameState) return;
    
    // Oblicz nagrodę golda na podstawie trudności zadania
    const task = gameState.tileTasks[tileId];
    let goldReward = 100; // Domyślna nagroda
    
    if (task) {
      switch (task.difficulty) {
        case 'easy':
          goldReward = 50;
          break;
        case 'medium':
          goldReward = 150;
          break;
        case 'hard':
          goldReward = 300;
          break;
        case 'elite':
          goldReward = 500;
          break;
        case 'master':
          goldReward = 1000;
          break;
      }
    }
    
    const newGameState = {
      ...gameState,
      completedTiles: [...gameState.completedTiles, tileId],
      gold: gameState.gold + goldReward // Dodaj gold za ukończenie zadania
    };
    
    setGameState(newGameState);
    saveGameState(newGameState);
    setPopupTile(null); // Zamknij popup
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

  const handleSlayerTaskComplete = (masterName: string) => {
    if (!gameState) return;
    
    setSlayerMasters(prev => {
      const updated = prev.map(master => {
        if (master.name === masterName) {
          const newCount = master.tasksCompleted + 1;
          const isCompleted = newCount >= master.requiredTasks;
          
          if (isCompleted) {
            // Reset licznika i dodaj klucz
            const newGameState = {
              ...gameState,
              keys: gameState.keys + 1
            };
            setGameState(newGameState);
            saveGameState(newGameState);
            
            return {
              ...master,
              tasksCompleted: 0 // Reset do 0
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
      
      // Zapisz stan slayer masterów po każdej zmianie
      saveSlayerMasters(updated);
      return updated;
    });
  };

  // Centrowanie na ostatnim odblokowanym kafelku
  const centerOnLastUnlockedTile = () => {
    if (!gameState || gameState.unlockedTiles.length === 0) {
      // Jeśli brak odblokowanych kafelków, wycentruj na (0,0)
      setPan({ x: 0, y: 0 });
      return;
    }

    // Znajdź ostatni odblokowany kafelek
    const lastUnlockedTile = gameState.unlockedTiles[gameState.unlockedTiles.length - 1];
    if (!lastUnlockedTile) return;
    
    const [x, y] = lastUnlockedTile.split(',').map(Number);
    if (x === undefined || y === undefined) return;
    
    // Wycentruj na tym kafelku
    // Kafelek ma rozmiar 88px (80px + 8px gap), więc centrum to x * 88 + 44
    const tileCenterX = x * 88 + 44;
    const tileCenterY = y * 88 + 44;
    
    // Wycentruj na środku ekranu (uwzględniając zoom)
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;
    
    // Oblicz offset potrzebny do wycentrowania
    const offsetX = screenCenterX - tileCenterX;
    const offsetY = screenCenterY - tileCenterY;
    
    setPan({ x: offsetX, y: offsetY });
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

        {/* Licznik kluczy i przycisk Stats w lewym górnym rogu */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <div className="bg-gray-800 p-3 rounded border-2 border-gray-600 flex flex-col items-center">
            <img 
              src="https://runescape.wiki/images/thumb/A_key_detail.png/100px-A_key_detail.png?d5cf4" 
              alt="Key" 
              className="w-6 h-6 mb-1"
            />
            <div className="text-white font-bold text-lg">{gameState.keys}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded border-2 border-gray-600 flex flex-col items-center">
            <img 
              src="/src/assets/gold_icon.png" 
              alt="Gold" 
              className="w-6 h-6 mb-1"
            />
            <div className="text-white font-bold text-lg">{gameState.gold.toLocaleString()}</div>
          </div>
          <button
            onClick={() => setShowSkillsModal(!showSkillsModal)}
            className="bg-gray-800 p-3 rounded border-2 border-gray-600 flex flex-col items-center hover:bg-gray-700"
            title="Skills"
          >
            <img 
              src="/src/assets/Stats_icon.png" 
              alt="Stats" 
              className="w-6 h-6 mb-1"
            />
            <div className="text-white font-bold text-sm">Stats</div>
          </button>
        </div>


        {/* Przyciski na lewej krawędzi */}
        <div className="absolute left-4 top-32 z-10 flex flex-col gap-2">
          {/* Daily */}
          <button className="bg-gray-800 p-3 rounded border-2 border-gray-600 flex flex-col items-center hover:bg-gray-700">
            <img 
              src="https://runescape.wiki/images/Scroll_%28Barbarian_Assault%29_detail.png?24779" 
              alt="Daily" 
              className="w-6 h-6 mb-1"
            />
            <div className="text-white font-bold text-sm">Daily</div>
          </button>

          {/* Slayer */}
          <button 
            onClick={() => setShowSlayerModal(!showSlayerModal)}
            className="bg-gray-800 p-3 rounded border-2 border-gray-600 flex flex-col items-center hover:bg-gray-700"
          >
            <img 
              src="https://runescape.wiki/images/thumb/Slayer_detail.png/100px-Slayer_detail.png?0f0af" 
              alt="Slayer" 
              className="w-6 h-6 mb-1"
            />
            <div className="text-white font-bold text-sm">Slayer</div>
          </button>

          {/* Bosses */}
          <button className="bg-gray-800 p-3 rounded border-2 border-gray-600 flex flex-col items-center hover:bg-gray-700">
            <img 
              src="https://runescape.wiki/images/thumb/Nex.png/200px-Nex.png?67c8a" 
              alt="Bosses" 
              className="w-6 h-6 mb-1"
            />
            <div className="text-white font-bold text-sm">Bosses</div>
          </button>
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
            <button
              onClick={centerOnLastUnlockedTile}
              className="w-10 h-10 bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
              title="Wycentruj na ostatnim odblokowanym kafelku"
            >
              🎯
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
                        const isCompleted = gameState.completedTiles.includes(tileId);
                        const canUnlock = canUnlockTile(tileId, gameState);
                        const task = gameState.tileTasks[tileId];
                        
                        // Określ stan kafelka
                        let tileState: 'locked' | 'unlocked' | 'completed';
                        if (isCompleted) {
                          tileState = 'completed';
                        } else if (isUnlocked) {
                          tileState = 'unlocked';
                        } else {
                          tileState = 'locked';
                        }
                        
                        console.log('Rendering tile:', tileId, 'state:', tileState, 'canUnlock:', canUnlock);
                        
                        return (
                          <div
                            key={tileId}
                            className={`
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
                            onClick={() => handleTileClick(tileId)}
                            onMouseEnter={() => setHoverTile(tileId)}
                            onMouseLeave={() => setHoverTile(null)}
                            title={task ? `${task.title}\n${task.description}` : undefined}
                          >
                            {/* Tło kafelka w stylu RuneScape */}
                            <div className={`
                              absolute inset-0 border-2 rounded-sm
                              ${tileState === 'completed' 
                                ? 'bg-gray-800 border-gray-600' 
                                : tileState === 'unlocked'
                                  ? 'bg-green-800 border-green-600 shadow-lg shadow-green-500/20'
                                  : canUnlock
                                    ? 'bg-blue-800 border-blue-600 shadow-lg shadow-blue-500/20'
                                    : 'bg-gray-800 border-gray-600'
                              }
                            `} />
                            
                            {/* Wzór w stylu RuneScape */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-sm" />
                            
                            {/* Ramka wewnętrzna */}
                            <div className="absolute inset-1 border border-black/20 rounded-sm" />
                            {/* Ikona typu zadania */}
                            {task && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <img 
                                  src={getTaskIcon(task.category)} 
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
                            
                            {/* Ikona kłódki dla zablokowanych */}
                            {tileState === 'locked' && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 rounded-sm flex items-center justify-center text-xs font-bold text-black">
                                🔒
                              </div>
                            )}
                            
                            {/* Ikona zielonego ptaszka dla ukończonych */}
                            {tileState === 'completed' && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-green-400 rounded-sm flex items-center justify-center text-xs font-bold text-black">
                                ✓
                              </div>
                            )}
                            
                            {/* Ikona dla odblokowanych */}
                            {tileState === 'unlocked' && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-blue-400 rounded-sm flex items-center justify-center text-xs font-bold text-black">
                                ⚡
                              </div>
                            )}
                            
                            {/* Efekt hover */}
                            {tileState !== 'completed' && (
                              <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity rounded-sm" />
                            )}
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
                        {gameState.tileTasks[selectedTile] ? (
                          <div>
                            <div className="font-semibold text-white mb-1">
                              {gameState.tileTasks[selectedTile].title}
                            </div>
                            <div className="mb-2">
                              {gameState.tileTasks[selectedTile].description}
                            </div>
                            <div className="text-xs text-gray-400">
                              Kategoria: {gameState.tileTasks[selectedTile].category} | 
                              Trudność: {gameState.tileTasks[selectedTile].difficulty}
                            </div>
                          </div>
                        ) : (
                          <div>
                            {canUnlockTile(selectedTile, gameState) 
                              ? 'Możesz odblokować ten kafelek!' 
                              : 'Ten kafelek nie może być odblokowany'
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  )}
        </div>
      </div>

      {/* Skills Popup */}
      {showSkillsModal && (
        <div className="absolute top-4 left-32 z-20">
          <div className="bg-gray-800 p-3 rounded border-2 border-gray-600">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-white">Skills</h3>
              <button
                onClick={() => setShowSkillsModal(false)}
                className="text-white hover:text-gray-300 text-lg"
              >
                ×
              </button>
            </div>
            <SkillsPanel playerStats={gameState.playerStats} />
          </div>
        </div>
      )}

              {/* Slayer Masters Popup */}
              {showSlayerModal && (
                <div className="absolute top-32 left-32 z-20">
                  <div className="bg-gray-800 p-4 rounded border-2 border-gray-600 max-w-2xl">
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

              {/* Małe popupy dla kafelków */}
              {popupTile && gameState && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                  <div className="bg-gray-900 p-4 rounded border-2 border-gray-600 shadow-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-white">Kafelek {popupTile}</h3>
                      <button
                        onClick={() => setPopupTile(null)}
                        className="text-white hover:text-gray-300 text-lg"
                      >
                        ×
                      </button>
                    </div>
                    
                    {(() => {
                      const isUnlocked = gameState.unlockedTiles.includes(popupTile);
                      const task = gameState.tileTasks[popupTile];
                      
                      if (isUnlocked) {
                        return (
                          <div className="text-sm text-gray-300">
                            <div className="font-semibold text-blue-400 mb-2">
                              ⚡ Zadanie odblokowane
                            </div>
                            <div className="mb-2">
                              {task?.title} - {task?.description}
                            </div>
                            <div className="text-xs text-gray-400 mb-3">
                              Kategoria: {task?.category} | 
                              Trudność: {task?.difficulty}
                            </div>
                            <button
                              onClick={() => handleCompleteTile(popupTile)}
                              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 border border-green-500"
                            >
                              Ukończ zadanie (+gold)
                            </button>
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-sm text-gray-300">
                            <div className="font-semibold text-yellow-400 mb-2">
                              🔒 Kafelek zablokowany
                            </div>
                            <div className="mb-2">
                              {task?.title} - {task?.description}
                            </div>
                            <div className="text-xs text-gray-400 mb-3">
                              Kategoria: {task?.category} | 
                              Trudność: {task?.difficulty}
                            </div>
                            <button
                              onClick={() => handleUnlockTile(popupTile)}
                              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 border border-blue-500"
                              disabled={gameState.keys < 1}
                            >
                              Odblokuj za 1 klucz
                            </button>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Hover hints */}
              {hoverTile && gameState && !popupTile && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="bg-gray-900 p-3 rounded border-2 border-gray-600 shadow-lg max-w-xs">
                    {(() => {
                      const isUnlocked = gameState.unlockedTiles.includes(hoverTile);
                      const isCompleted = gameState.completedTiles.includes(hoverTile);
                      const canUnlock = canUnlockTile(hoverTile, gameState);
                      const task = gameState.tileTasks[hoverTile];
                      
                      if (isCompleted) {
                        return (
                          <div className="text-sm text-gray-300">
                            <div className="font-semibold text-green-400 mb-1">
                              ✅ Ukończone
                            </div>
                            <div className="text-xs">
                              {task?.title}
                            </div>
                          </div>
                        );
                      } else if (isUnlocked) {
                        return (
                          <div className="text-sm text-gray-300">
                            <div className="font-semibold text-blue-400 mb-1">
                              ⚡ Kliknij aby ukończyć
                            </div>
                            <div className="text-xs">
                              {task?.title}
                            </div>
                          </div>
                        );
                      } else if (canUnlock) {
                        return (
                          <div className="text-sm text-gray-300">
                            <div className="font-semibold text-yellow-400 mb-1">
                              🔒 Kliknij aby odblokować
                            </div>
                            <div className="text-xs">
                              {task?.title}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-sm text-gray-300">
                            <div className="font-semibold text-gray-400 mb-1">
                              🔒 Zablokowany
                            </div>
                            <div className="text-xs">
                              {task?.title || 'Nieznane zadanie'}
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          );
        }
