import React, { useEffect, useRef, useState, useCallback } from 'react';

interface DinoGameProps {
  isVisible: boolean;
}

interface DinoState {
  x: number;
  y: number;
  velocityY: number;
  isJumping: boolean;
  isRunning: boolean;
  direction: 1 | -1;
  targetElement: string | null;
}

const DINO_SIZE = 60;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const RUN_SPEED = 3;

export function DinoGame({ isVisible }: DinoGameProps) {
  const dinoRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [dino, setDino] = useState<DinoState>({
    x: 100,
    y: window.innerHeight - 100,
    velocityY: 0,
    isJumping: false,
    isRunning: true,
    direction: 1,
    targetElement: null
  });

  // Função para pular
  const jump = useCallback(() => {
    setDino(prev => ({
      ...prev,
      velocityY: JUMP_FORCE,
      isJumping: true
    }));
  }, []);

  // Função para encontrar elementos da página
  const findPageElements = useCallback(() => {
    const elements = document.querySelectorAll('a[href], button, .card, [role="button"]');
    const pageElements: Array<{ id: string; x: number; y: number; width: number; height: number; text: string }> = [];
    
    elements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        pageElements.push({
          id: `element-${index}`,
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
          text: el.textContent?.trim() || ''
        });
      }
    });
    
    return pageElements;
  }, []);

  // Função para encontrar elemento mais próximo
  const findNearestElement = useCallback((dino: DinoState) => {
    const elements = findPageElements();
    let nearest = null;
    let minDistance = Infinity;

    elements.forEach(element => {
      const distance = Math.sqrt(
        Math.pow(dino.x - (element.x + element.width / 2), 2) +
        Math.pow(dino.y - (element.y + element.height / 2), 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = element.id;
      }
    });

    return nearest;
  }, [findPageElements]);

  // Função para mover em direção ao elemento
  const moveTowardsElement = useCallback((dino: DinoState, targetId: string) => {
    const elements = findPageElements();
    const target = elements.find(e => e.id === targetId);
    if (!target) return dino;

    const targetX = target.x + target.width / 2;
    const targetY = target.y + target.height / 2;
    
    const dx = targetX - dino.x;
    const dy = targetY - dino.y;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 10) {
      const newX = dino.x + (dx / distance) * RUN_SPEED;
      const newDirection = dx > 0 ? 1 : -1;
      
      return {
        ...dino,
        x: newX,
        direction: newDirection as 1 | -1
      };
    }
    
    return dino;
  }, [findPageElements]);

  // Função para verificar colisão
  const checkCollision = useCallback((dino: DinoState, targetId: string) => {
    const elements = findPageElements();
    const target = elements.find(e => e.id === targetId);
    if (!target) return false;

    return dino.x < target.x + target.width &&
           dino.x + DINO_SIZE > target.x &&
           dino.y < target.y + target.height &&
           dino.y + DINO_SIZE > target.y;
  }, [findPageElements]);

  // Loop principal da animação
  const gameLoop = useCallback(() => {
    setDino(prev => {
      let newDino = { ...prev };

      // Aplicar gravidade
      newDino.velocityY += GRAVITY;
      newDino.y += newDino.velocityY;

      // Verificar colisão com o chão
      const currentGroundY = window.innerHeight - 100;
      if (newDino.y >= currentGroundY) {
        newDino.y = currentGroundY;
        newDino.velocityY = 0;
        newDino.isJumping = false;
      }

      // Lógica de movimento inteligente
      if (!newDino.targetElement) {
        newDino.targetElement = findNearestElement(newDino);
      }

      if (newDino.targetElement) {
        newDino = moveTowardsElement(newDino, newDino.targetElement);
        
        // Verificar se chegou ao elemento
        if (checkCollision(newDino, newDino.targetElement)) {
          // Pular quando chegar ao elemento
          if (!newDino.isJumping) {
            newDino.velocityY = JUMP_FORCE;
            newDino.isJumping = true;
          }
          
          // Escolher próximo elemento aleatoriamente
          const elements = findPageElements();
          const availableElements = elements.filter(e => e.id !== newDino.targetElement);
          if (availableElements.length > 0) {
            const randomElement = availableElements[Math.floor(Math.random() * availableElements.length)];
            newDino.targetElement = randomElement.id;
          }
        }
      }

      return newDino;
    });

    // Continuar loop
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [findNearestElement, moveTowardsElement, checkCollision, findPageElements]);

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
      const elements = findPageElements();
      const clickX = e.clientX + window.scrollX;
      const clickY = e.clientY + window.scrollY;

      // Verificar se clicou em algum elemento
      elements.forEach(element => {
        if (clickX >= element.x && clickX <= element.x + element.width &&
            clickY >= element.y && clickY <= element.y + element.height) {
          setDino(prev => ({
            ...prev,
            targetElement: element.id
          }));
        }
      });
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyPress);
      document.addEventListener('click', handleClick);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleClick);
    };
  }, [isVisible, findPageElements, jump]);

  if (!isVisible) return null;

  return (
    <div
      ref={dinoRef}
      className="fixed z-50 pointer-events-none select-none"
      style={{
        left: `${dino.x}px`,
        top: `${dino.y}px`,
        transform: `scaleX(${dino.direction})`,
        transition: 'transform 0.1s ease'
      }}
    >
      {/* Dinossauro */}
      <div className="relative">
        {/* Corpo */}
        <div className="w-15 h-15 bg-gray-800 rounded-lg relative">
          {/* Olhos */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full">
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-black rounded-full"></div>
          </div>
          <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full">
            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-black rounded-full"></div>
          </div>
          
          {/* Boca */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-red-500 rounded"></div>
          
          {/* Pernas animadas */}
          <div 
            className={`absolute -bottom-3 left-2 w-1 h-3 bg-gray-800 rounded ${
              dino.isRunning ? 'animate-bounce' : ''
            }`}
            style={{
              animationDelay: '0ms'
            }}
          ></div>
          <div 
            className={`absolute -bottom-3 right-2 w-1 h-3 bg-gray-800 rounded ${
              dino.isRunning ? 'animate-bounce' : ''
            }`}
            style={{
              animationDelay: '150ms'
            }}
          ></div>
          
          {/* Cauda */}
          <div className="absolute top-2 -left-2 w-2 h-1.5 bg-gray-600 rounded-l-full"></div>
        </div>
        
        {/* Sombra */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-black opacity-20 rounded-full"></div>
      </div>
    </div>
  );
} 