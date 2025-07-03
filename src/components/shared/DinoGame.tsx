import React, { useEffect, useRef, useState, useCallback } from 'react';

interface DinoGameProps {
  isVisible: boolean;
  onToggle: () => void;
}

interface DinoState {
  x: number;
  y: number;
  velocityY: number;
  isJumping: boolean;
  isRunning: boolean;
  direction: 1 | -1;
  targetModule: string | null;
}

interface Module {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
}

const DINO_SIZE = 40;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const GROUND_Y = 60;
const RUN_SPEED = 2;

export function DinoGame({ isVisible, onToggle }: DinoGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [dino, setDino] = useState<DinoState>({
    x: 50,
    y: GROUND_Y,
    velocityY: 0,
    isJumping: false,
    isRunning: true,
    direction: 1,
    targetModule: null
  });
  const modules: Module[] = [
    { id: 'json', x: 200, y: 100, width: 120, height: 80, name: 'JSON' },
    { id: 'csv', x: 400, y: 100, width: 120, height: 80, name: 'CSV' },
    { id: 'jwt', x: 600, y: 100, width: 120, height: 80, name: 'JWT' },
    { id: 'mock', x: 200, y: 250, width: 120, height: 80, name: 'Mock' },
    { id: 'regex', x: 400, y: 250, width: 120, height: 80, name: 'Regex' },
    { id: 'svg', x: 600, y: 250, width: 120, height: 80, name: 'SVG' }
  ];

  // Função para desenhar o dinossauro
  const drawDino = useCallback((ctx: CanvasRenderingContext2D, dino: DinoState) => {
    ctx.save();
    ctx.translate(dino.x, dino.y);
    ctx.scale(dino.direction, 1);

    // Corpo do dino
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(0, 0, DINO_SIZE, DINO_SIZE);

    // Olhos
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, 8, 6, 6);
    ctx.fillRect(26, 8, 6, 6);
    
    // Pupilas
    ctx.fillStyle = '#000000';
    ctx.fillRect(10, 10, 2, 2);
    ctx.fillRect(28, 10, 2, 2);

    // Boca
    ctx.fillStyle = '#e53e3e';
    ctx.fillRect(12, 25, 16, 4);

    // Pernas (animação de corrida)
    ctx.fillStyle = '#2d3748';
    const legOffset = dino.isRunning ? Math.sin(Date.now() * 0.01) * 3 : 0;
    ctx.fillRect(8, DINO_SIZE, 4, 12 + legOffset);
    ctx.fillRect(28, DINO_SIZE, 4, 12 - legOffset);

    // Cauda
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(-8, 8, 8, 6);

    ctx.restore();
  }, []);

  // Função para desenhar os módulos
  const drawModules = useCallback((ctx: CanvasRenderingContext2D) => {
    modules.forEach(module => {
      // Card do módulo
      ctx.fillStyle = '#f7fafc';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.fillRect(module.x, module.y, module.width, module.height);
      ctx.strokeRect(module.x, module.y, module.width, module.height);

      // Nome do módulo
      ctx.fillStyle = '#2d3748';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(module.name, module.x + module.width / 2, module.y + module.height / 2 + 5);

      // Ícone pequeno
      ctx.fillStyle = '#4299e1';
      ctx.fillRect(module.x + 10, module.y + 10, 20, 20);
    });
  }, [modules]);

  // Função para verificar colisão
  const checkCollision = useCallback((dino: DinoState, module: Module) => {
    return dino.x < module.x + module.width &&
           dino.x + DINO_SIZE > module.x &&
           dino.y < module.y + module.height &&
           dino.y + DINO_SIZE > module.y;
  }, []);

  // Função para encontrar módulo mais próximo
  const findNearestModule = useCallback((dino: DinoState) => {
    let nearest = null;
    let minDistance = Infinity;

    modules.forEach(module => {
      const distance = Math.sqrt(
        Math.pow(dino.x - (module.x + module.width / 2), 2) +
        Math.pow(dino.y - (module.y + module.height / 2), 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = module.id;
      }
    });

    return nearest;
  }, [modules]);

  // Função para pular
  const jump = useCallback(() => {
    setDino(prev => ({
      ...prev,
      velocityY: JUMP_FORCE,
      isJumping: true
    }));
  }, []);

  // Função para mover em direção ao módulo
  const moveTowardsModule = useCallback((dino: DinoState, targetId: string) => {
    const target = modules.find(m => m.id === targetId);
    if (!target) return dino;

    const targetX = target.x + target.width / 2;
    const targetY = target.y + target.height / 2;
    
    const dx = targetX - dino.x;
    const dy = targetY - dino.y;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      const newX = dino.x + (dx / distance) * RUN_SPEED;
      const newDirection = dx > 0 ? 1 : -1;
      
      return {
        ...dino,
        x: newX,
        direction: newDirection as 1 | -1
      };
    }
    
    return dino;
  }, [modules]);

  // Loop principal da animação
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualizar estado do dino
    setDino(prev => {
      let newDino = { ...prev };

      // Aplicar gravidade
      newDino.velocityY += GRAVITY;
      newDino.y += newDino.velocityY;

      // Verificar colisão com o chão
      if (newDino.y >= GROUND_Y) {
        newDino.y = GROUND_Y;
        newDino.velocityY = 0;
        newDino.isJumping = false;
      }

      // Lógica de movimento inteligente
      if (!newDino.targetModule) {
        newDino.targetModule = findNearestModule(newDino);
      }

      if (newDino.targetModule) {
        newDino = moveTowardsModule(newDino, newDino.targetModule);
        
        // Verificar se chegou ao módulo
        const target = modules.find(m => m.id === newDino.targetModule);
        if (target && checkCollision(newDino, target)) {
          // Pular quando chegar ao módulo
          if (!newDino.isJumping) {
            newDino.velocityY = JUMP_FORCE;
            newDino.isJumping = true;
          }
          
          // Escolher próximo módulo aleatoriamente
          const availableModules = modules.filter(m => m.id !== newDino.targetModule);
          if (availableModules.length > 0) {
            const randomModule = availableModules[Math.floor(Math.random() * availableModules.length)];
            newDino.targetModule = randomModule.id;
          }
        }
      }

      return newDino;
    });

    // Desenhar elementos
    drawModules(ctx);
    drawDino(ctx, dino);

    // Continuar loop
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [dino, modules, drawDino, drawModules, findNearestModule, moveTowardsModule, checkCollision]);

  // Iniciar/parar animação
  useEffect(() => {
    if (isVisible) {
      gameLoop();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, gameLoop]);

  // Event listeners para interação
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Verificar se clicou em algum módulo
      modules.forEach(module => {
        if (x >= module.x && x <= module.x + module.width &&
            y >= module.y && y <= module.y + module.height) {
          setDino(prev => ({
            ...prev,
            targetModule: module.id
          }));
        }
      });
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyPress);
      canvasRef.current?.addEventListener('click', handleClick);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      canvasRef.current?.removeEventListener('click', handleClick);
    };
  }, [isVisible, modules, jump]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Dino Game 🦖</h3>
          <button
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ✕
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="border border-gray-200 rounded"
        />
        <div className="text-xs text-gray-500 mt-2">
          Clique nos módulos ou pressione ESPAÇO para pular!
        </div>
      </div>
    </div>
  );
} 