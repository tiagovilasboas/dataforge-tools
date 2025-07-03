import React, { useEffect, useRef, useState, useCallback } from 'react';

interface RobotGameProps {
  isVisible: boolean;
}

interface RobotState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  isJumping: boolean;
  isWalking: boolean;
  direction: 1 | -1;
  targetElement: string | null;
  mood: 'happy' | 'curious' | 'excited' | 'thinking' | 'sleepy';
  energy: number;
  lastAction: number;
  idleTimer: number;
  currentAnimation: string;
}

const ROBOT_SIZE = 80;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const WALK_SPEED = 2;
const DIAGONAL_SPEED = 1.5;
const MAX_ENERGY = 100;
const ENERGY_DRAIN = 0.1;
const ENERGY_RESTORE = 0.05;

export function RobotGame({ isVisible }: RobotGameProps) {
  const robotRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [robot, setRobot] = useState<RobotState>({
    x: 100,
    y: window.innerHeight - 120,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    isWalking: false,
    direction: 1,
    targetElement: null,
    mood: 'happy',
    energy: MAX_ENERGY,
    lastAction: Date.now(),
    idleTimer: 0,
    currentAnimation: 'idle'
  });

  // Função para pular
  const jump = useCallback(() => {
    setRobot(prev => ({
      ...prev,
      velocityY: JUMP_FORCE,
      isJumping: true,
      energy: Math.max(0, prev.energy - 10),
      mood: 'excited',
      currentAnimation: 'jump'
    }));
  }, []);

  // Função para encontrar elementos da página
  const findPageElements = useCallback(() => {
    const elements = document.querySelectorAll('a[href], button, .card, [role="button"], h1, h2, h3, input, textarea');
    const pageElements: Array<{ id: string; x: number; y: number; width: number; height: number; text: string; type: string }> = [];
    
    elements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && rect.top > 0) {
        pageElements.push({
          id: `element-${index}`,
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
          text: el.textContent?.trim() || '',
          type: el.tagName.toLowerCase()
        });
      }
    });
    
    return pageElements;
  }, []);

  // Função para encontrar elemento mais próximo
  const findNearestElement = useCallback((robot: RobotState) => {
    const elements = findPageElements();
    let nearest = null;
    let minDistance = Infinity;

    elements.forEach(element => {
      const distance = Math.sqrt(
        Math.pow(robot.x - (element.x + element.width / 2), 2) +
        Math.pow(robot.y - (element.y + element.height / 2), 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = element.id;
      }
    });

    return nearest;
  }, [findPageElements]);

  // Função para mover em direção ao elemento com movimentos diagonais
  const moveTowardsElement = useCallback((robot: RobotState, targetId: string) => {
    const elements = findPageElements();
    const target = elements.find(e => e.id === targetId);
    if (!target) return robot;

    const targetX = target.x + target.width / 2;
    const targetY = target.y + target.height / 2;
    
    const dx = targetX - robot.x;
    const dy = targetY - robot.y;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 15) {
      // Movimento diagonal mais suave
      const speed = distance > 100 ? WALK_SPEED : DIAGONAL_SPEED;
      const newX = robot.x + (dx / distance) * speed;
      const newY = robot.y + (dy / distance) * speed;
      const newDirection = dx > 0 ? 1 : -1;
      
      return {
        ...robot,
        x: newX,
        y: newY,
        direction: newDirection as 1 | -1,
        isWalking: true,
        currentAnimation: 'walk',
        energy: Math.max(0, robot.energy - ENERGY_DRAIN)
      };
    }
    
    return robot;
  }, [findPageElements]);

  // Função para verificar colisão
  const checkCollision = useCallback((robot: RobotState, targetId: string) => {
    const elements = findPageElements();
    const target = elements.find(e => e.id === targetId);
    if (!target) return false;

    return robot.x < target.x + target.width &&
           robot.x + ROBOT_SIZE > target.x &&
           robot.y < target.y + target.height &&
           robot.y + ROBOT_SIZE > target.y;
  }, [findPageElements]);

  // Função para mudar humor baseado em ações
  const updateMood = useCallback((robot: RobotState) => {
    const timeSinceLastAction = Date.now() - robot.lastAction;
    const energyLevel = robot.energy / MAX_ENERGY;

    if (energyLevel < 0.3) {
      return 'sleepy';
    } else if (timeSinceLastAction > 10000) {
      return 'curious';
    } else if (robot.isJumping) {
      return 'excited';
    } else if (robot.isWalking) {
      return 'happy';
    } else {
      return 'thinking';
    }
  }, []);

  // Função para comportamento autônomo
  const autonomousBehavior = useCallback((robot: RobotState) => {
    const timeSinceLastAction = Date.now() - robot.lastAction;
    const elements = findPageElements();
    
    // Se ficou muito tempo parado, escolhe um novo alvo
    if (timeSinceLastAction > 8000 && !robot.targetElement) {
      if (elements.length > 0) {
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        return {
          ...robot,
          targetElement: randomElement.id,
          mood: 'curious' as const,
          currentAnimation: 'walk'
        };
      }
    }

    // Se energia baixa, descansa
    if (robot.energy < 20) {
      return {
        ...robot,
        targetElement: null,
        mood: 'sleepy' as const,
        currentAnimation: 'idle',
        energy: Math.min(MAX_ENERGY, robot.energy + ENERGY_RESTORE * 2)
      };
    }

    // Movimento aleatório ocasional
    if (Math.random() < 0.001) {
      const randomX = Math.random() * (window.innerWidth - ROBOT_SIZE);
      const randomY = Math.random() * (window.innerHeight - ROBOT_SIZE - 100) + 100;
      return {
        ...robot,
        x: randomX,
        y: randomY,
        mood: 'excited' as const,
        currentAnimation: 'jump'
      };
    }

    return robot;
  }, [findPageElements]);

  // Loop principal da animação
  const gameLoop = useCallback(() => {
    setRobot(prev => {
      let newRobot = { ...prev };

      // Aplicar gravidade
      newRobot.velocityY += GRAVITY;
      newRobot.y += newRobot.velocityY;

      // Verificar colisão com o chão
      const currentGroundY = window.innerHeight - 120;
      if (newRobot.y >= currentGroundY) {
        newRobot.y = currentGroundY;
        newRobot.velocityY = 0;
        newRobot.isJumping = false;
      }

      // Comportamento autônomo
      newRobot = autonomousBehavior(newRobot);

      // Lógica de movimento inteligente
      if (!newRobot.targetElement) {
        newRobot.targetElement = findNearestElement(newRobot);
      }

      if (newRobot.targetElement) {
        newRobot = moveTowardsElement(newRobot, newRobot.targetElement);
        
        // Verificar se chegou ao elemento
        if (newRobot.targetElement && checkCollision(newRobot, newRobot.targetElement)) {
          // Pular quando chegar ao elemento
          if (!newRobot.isJumping) {
            newRobot.velocityY = JUMP_FORCE;
            newRobot.isJumping = true;
            newRobot.currentAnimation = 'jump';
            newRobot.mood = 'excited';
          }
          
          // Escolher próximo elemento aleatoriamente
          const elements = findPageElements();
          const availableElements = elements.filter(e => e.id !== newRobot.targetElement);
          if (availableElements.length > 0) {
            const randomElement = availableElements[Math.floor(Math.random() * availableElements.length)];
            newRobot.targetElement = randomElement.id;
            newRobot.lastAction = Date.now();
          }
        }
      }

      // Atualizar humor
      newRobot.mood = updateMood(newRobot);

      // Restaurar energia gradualmente
      if (!newRobot.isWalking && !newRobot.isJumping) {
        newRobot.energy = Math.min(MAX_ENERGY, newRobot.energy + ENERGY_RESTORE);
      }

      return newRobot;
    });

    // Continuar loop
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [findNearestElement, moveTowardsElement, checkCollision, findPageElements, autonomousBehavior, updateMood]);

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
          setRobot(prev => ({
            ...prev,
            targetElement: element.id,
            mood: 'curious',
            currentAnimation: 'walk',
            lastAction: Date.now()
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

  // Expressões do robô baseadas no humor
  const getRobotExpression = () => {
    switch (robot.mood) {
      case 'happy':
        return '😊';
      case 'curious':
        return '🤔';
      case 'excited':
        return '🤖';
      case 'thinking':
        return '🧠';
      case 'sleepy':
        return '😴';
      default:
        return '🤖';
    }
  };

  // Cor do robô baseada na energia
  const getRobotColor = () => {
    const energyLevel = robot.energy / MAX_ENERGY;
    if (energyLevel > 0.7) return 'bg-blue-500';
    if (energyLevel > 0.4) return 'bg-blue-400';
    if (energyLevel > 0.2) return 'bg-blue-300';
    return 'bg-gray-400';
  };

  return (
    <div
      ref={robotRef}
      className="fixed z-50 pointer-events-none select-none"
      style={{
        left: `${robot.x}px`,
        top: `${robot.y}px`,
        transform: `scaleX(${robot.direction})`,
        transition: 'transform 0.2s ease'
      }}
    >
      {/* Robô */}
      <div className="relative">
        {/* Corpo principal */}
        <div className={`w-20 h-20 ${getRobotColor()} rounded-lg relative shadow-lg border-2 border-gray-300`}>
          {/* Cabeça */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-200 rounded-full border-2 border-gray-400 flex items-center justify-center">
            {/* Expressão */}
            <div className="text-2xl animate-pulse">
              {getRobotExpression()}
            </div>
          </div>
          
          {/* Olhos */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse">
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-black rounded-full"></div>
          </div>
          <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse">
            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-black rounded-full"></div>
          </div>
          
          {/* Antenas */}
          <div className="absolute -top-6 left-4 w-1 h-4 bg-gray-400 rounded-full">
            <div className="absolute -top-1 left-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          </div>
          <div className="absolute -top-6 right-4 w-1 h-4 bg-gray-400 rounded-full">
            <div className="absolute -top-1 right-0 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          </div>
          
          {/* Braços */}
          <div className={`absolute top-4 -left-2 w-2 h-6 ${getRobotColor()} rounded-full ${
            robot.isWalking ? 'animate-bounce' : ''
          }`} style={{ animationDelay: '0ms' }}></div>
          <div className={`absolute top-4 -right-2 w-2 h-6 ${getRobotColor()} rounded-full ${
            robot.isWalking ? 'animate-bounce' : ''
          }`} style={{ animationDelay: '150ms' }}></div>
          
          {/* Pernas */}
          <div className={`absolute -bottom-2 left-3 w-2 h-4 ${getRobotColor()} rounded-full ${
            robot.isWalking ? 'animate-bounce' : ''
          }`} style={{ animationDelay: '0ms' }}></div>
          <div className={`absolute -bottom-2 right-3 w-2 h-4 ${getRobotColor()} rounded-full ${
            robot.isWalking ? 'animate-bounce' : ''
          }`} style={{ animationDelay: '150ms' }}></div>
          
          {/* Barriga */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Sombra */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-black opacity-20 rounded-full"></div>
        
        {/* Barra de energia */}
        <div className="absolute -top-2 left-0 right-0 bg-gray-200 rounded-full h-1">
          <div 
            className="bg-green-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(robot.energy / MAX_ENERGY) * 100}%` }}
          ></div>
        </div>
        
        {/* Balão de fala */}
        {robot.mood === 'curious' && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-300 rounded-lg px-2 py-1 text-xs whitespace-nowrap">
            O que é isso? 🤔
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-300"></div>
          </div>
        )}
      </div>
    </div>
  );
}