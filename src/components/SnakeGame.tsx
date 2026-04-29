import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoveUp, MoveDown, MoveLeft, MoveRight } from 'lucide-react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 80;

function generateFood(snake: Point[]): Point {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    const collision = snake.some(s => s.x === newFood.x && s.y === newFood.y);
    if (!collision) break;
  }
  return newFood;
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFoodState] = useState<Point>({ x: 5, y: 5 });
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const setFood = useCallback((newFood: Point) => {
    foodRef.current = newFood;
    setFoodState(newFood);
  }, []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const dirRef = useRef<Point>(INITIAL_DIRECTION);
  const lastProcessedDirRef = useRef<Point>(INITIAL_DIRECTION);
  const gameLoopRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('glitch_snake_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    dirRef.current = INITIAL_DIRECTION;
    lastProcessedDirRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setIsPlaying(true);
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('glitch_snake_highscore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && (!isPlaying || gameOver)) {
        startGame();
        return;
      }

      if (!isPlaying || gameOver) return;

      const currentDir = lastProcessedDirRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) dirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) dirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) dirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) dirRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, startGame]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        if (!prevSnake || prevSnake.length === 0) return prevSnake;
        const head = prevSnake[0];
        const dir = dirRef.current;
        lastProcessedDirRef.current = dir;

        const newHead = { x: head.x + dir.x, y: head.y + dir.y };

        // Wall
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          endGame();
          return prevSnake;
        }

        // Self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          endGame();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        const currentFood = foodRef.current;
        if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore % 50 === 0) setSpeed(sp => Math.max(30, sp - 5));
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = window.setInterval(moveSnake, speed);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, speed, endGame]);

  const handleMobileControl = (x: number, y: number) => {
    if (!isPlaying || gameOver) return;
    const currentDir = lastProcessedDirRef.current;
    if (x !== 0 && currentDir.x === -x) return;
    if (y !== 0 && currentDir.y === -y) return;
    dirRef.current = { x, y };
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Score Header */}
      <div className="w-full flex justify-between items-end mb-4 px-2 text-2xl font-bold tracking-widest border-b-4 border-[#00ffff] pb-2">
        <div className="flex flex-col">
          <span className="text-[#ff00ff] text-xl">MEM_ALLOC</span>
          <span className="text-white text-5xl glitch-text" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[#00ffff] text-xl bg-[#00ffff]/10 border border-[#00ffff] p-1 px-2">MAX_CAP</span>
          <span className="text-white text-5xl glitch-text mt-1" data-text={highScore.toString().padStart(4, '0')}>
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative bg-black w-full" style={{ width: 'min(90vw, 400px)', height: 'min(90vw, 400px)' }}>
        
        {/* Game Area Border */}
        <div className="absolute inset-0 border-[6px] border-[#00ffff] pointer-events-none z-30 shadow-[0_0_15px_#00ffff,inset_0_0_15px_#00ffff]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 grid pointer-events-none z-20 opacity-30" 
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}>
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border-r border-b border-[#00ffff]" />
          ))}
        </div>

        <div className="relative w-full h-full z-10 overflow-hidden bg-black">
          {/* Food node */}
          <div 
            className="absolute bg-[#ff00ff] shadow-[0_0_20px_#ff00ff] z-10 border-2 border-[#fff]"
            style={{
              width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
              left: `${(food.x / GRID_SIZE) * 100}%`, top: `${(food.y / GRID_SIZE) * 100}%`,
              animation: 'flash 0.3s infinite steps(2)'
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <motion.div
                key={`${segment.x}-${segment.y}-${index}`}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: (speed * 0.8) / 1000, ease: "linear" }}
                className="absolute shadow-[0_0_15px_#00ffff]"
                style={{
                  backgroundColor: isHead ? '#ffffff' : '#00ffff',
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                  zIndex: 100 - index,
                  border: isHead ? '2px solid #ff00ff' : '2px solid #000'
                }}
              />
            );
          })}
        </div>

        <AnimatePresence>
          {(!isPlaying || gameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-6 text-center border-4 border-[#ff00ff]"
            >
              {gameOver ? (
                <>
                  <h2 
                    className="text-5xl sm:text-6xl font-black text-[#ff00ff] glitch-text mb-4 z-50 drop-shadow-[4px_4px_0_#00ffff]"
                    data-text="FATAL_ERROR"
                  >
                    FATAL_ERROR
                  </h2>
                  <p className="text-white text-2xl mb-8">
                    DATA LOSS: <span className="text-[#00ffff]">{score} B</span>
                  </p>
                </>
              ) : (
                <div className="mb-8 w-24 h-24 border-[6px] border-[#00ffff] bg-[#ff00ff] shadow-[8px_8px_0_#00ffff] animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 border-[4px] border-black scale-75 rotate-45" />
                </div>
              )}
              
              <button 
                onClick={startGame}
                className="group px-8 py-3 border-[6px] border-[#00ffff] bg-black text-[#00ffff] text-3xl uppercase font-bold hover:bg-[#00ffff] hover:text-black transition-none focus:outline-none focus:border-[#ff00ff] shadow-[8px_8px_0_#ff00ff] active:translate-x-2 active:translate-y-2 active:shadow-[2px_2px_0_#ff00ff]"
              >
                {gameOver ? 'REBOOT' : 'EXECUTE'}
              </button>
              
              <p className="text-[#ff00ff] text-xl mt-8 opacity-90 blink">_ PRESS_SPACE_</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes flash { 0% { background: #ff00ff; border-color: white; } 50% { background: #white; border-color: #ff00ff; } }
          .blink { animation: blinker 1s linear infinite; }
          @keyframes blinker { 50% { opacity: 0; } }
        `}} />
      </div>

      <div className="md:hidden grid grid-cols-3 gap-2 mt-8 w-full max-w-[200px]">
        <div />
        <button 
          className="bg-black p-4 border-4 border-[#00ffff] text-[#00ffff] flex justify-center active:bg-[#ff00ff] active:text-white"
          onClick={(e) => { e.preventDefault(); handleMobileControl(0, -1); }}
        >
          <MoveUp className="w-10 h-10" strokeWidth={4} />
        </button>
        <div />
        <button 
          className="bg-black p-4 border-4 border-[#00ffff] text-[#00ffff] flex justify-center active:bg-[#ff00ff] active:text-white"
          onClick={(e) => { e.preventDefault(); handleMobileControl(-1, 0); }}
        >
          <MoveLeft className="w-10 h-10" strokeWidth={4} />
        </button>
        <button 
          className="bg-black p-4 border-4 border-[#00ffff] text-[#00ffff] flex justify-center active:bg-[#ff00ff] active:text-white"
          onClick={(e) => { e.preventDefault(); handleMobileControl(0, 1); }}
        >
          <MoveDown className="w-10 h-10" strokeWidth={4} />
        </button>
        <button 
          className="bg-black p-4 border-4 border-[#00ffff] text-[#00ffff] flex justify-center active:bg-[#ff00ff] active:text-white"
          onClick={(e) => { e.preventDefault(); handleMobileControl(1, 0); }}
        >
          <MoveRight className="w-10 h-10" strokeWidth={4} />
        </button>
      </div>
    </div>
  );
}
