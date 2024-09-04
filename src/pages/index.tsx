import { useEffect, useRef, useState } from 'react';
import { Game } from '../Game';

export default function Home() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    if (gameContainerRef.current) {
      const newGame = new Game();
      newGame.initialize(gameContainerRef.current);
      setGame(newGame);
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (game && gameContainerRef.current) {
      const rect = gameContainerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      game.handleClick(x, y);
    }
  };

  return (
    <div 
      ref={gameContainerRef} 
      id="game-container" 
      style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f0f0' }}
      onClick={handleClick}
    >
      {/* The game will be rendered here */}
    </div>
  );
}