import React from 'react';
import { motion } from 'framer-motion';

export type RobotSkin = 'stray-drone' | 'classic-robot' | 'cute-bot' | 'cyber-punk';

export interface RobotSkinConfig {
  id: RobotSkin;
  name: string;
  description: string;
  size: number;
  expressions: {
    happy: string;
    curious: string;
    excited: string;
    thinking: string;
    sleepy: string;
    error: string;
    success: string;
  };
  tooltips: {
    happy: string[];
    curious: string[];
    excited: string[];
    thinking: string[];
    sleepy: string[];
    error: string[];
    success: string[];
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    energy: string;
  };
  animations: {
    idle: any;
    walk: any;
    jump: any;
    error: any;
    success: any;
  };
}

export const robotSkins: Record<RobotSkin, RobotSkinConfig> = {
  'stray-drone': {
    id: 'stray-drone',
    name: 'Stray Drone',
    description: 'Drone fofo inspirado no jogo Stray',
    size: 70,
    expressions: {
      happy: '🤖',
      curious: '🤔',
      excited: '⚡',
      thinking: '💭',
      sleepy: '😴',
      error: '💥',
      success: '✨'
    },
    tooltips: {
      happy: ['Tudo funcionando perfeitamente!', 'Que dia incrível!', 'Estou feliz!'],
      curious: ['O que é isso?', 'Interessante...', 'Vou investigar!'],
      excited: ['Uau! Que legal!', 'Isso é demais!', 'Estou empolgado!'],
      thinking: ['Hmm...', 'Deixe-me pensar...', 'Analisando...'],
      sleepy: ['Preciso descansar...', 'Zzz...', 'Estou cansado...'],
      error: ['Ops! Algo deu errado!', 'Erro detectado!', 'Preciso de ajuda!'],
      success: ['Sucesso!', 'Perfeito!', 'Funcionou!']
    },
    colors: {
      primary: 'bg-orange-400',
      secondary: 'bg-orange-300',
      accent: 'bg-yellow-300',
      energy: 'bg-green-400'
    },
    animations: {
      idle: { rotate: [0, -2, 2, 0], transition: { duration: 2, repeat: Infinity } },
      walk: { y: [0, -5, 0], transition: { duration: 0.5, repeat: Infinity } },
      jump: { y: [0, -20, 0], scale: [1, 1.1, 1], transition: { duration: 0.6 } },
      error: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.3 } },
      success: { scale: [1, 1.2, 1], rotate: [0, 360], transition: { duration: 0.8 } }
    }
  },
  'classic-robot': {
    id: 'classic-robot',
    name: 'Classic Robot',
    description: 'Robô clássico estilo retro',
    size: 80,
    expressions: {
      happy: '😊',
      curious: '🤔',
      excited: '🤖',
      thinking: '🧠',
      sleepy: '😴',
      error: '💥',
      success: '✅'
    },
    tooltips: {
      happy: ['Sistema operacional normal!', 'Tudo em ordem!', 'Funcionando perfeitamente!'],
      curious: ['Analisando dados...', 'Processando informação...', 'Investigando...'],
      excited: ['Energia máxima!', 'Sistema otimizado!', 'Performance excelente!'],
      thinking: ['Calculando...', 'Processando...', 'Analisando...'],
      sleepy: ['Modo economia de energia...', 'Sistema em standby...', 'Recarregando...'],
      error: ['ERRO: Sistema comprometido!', 'Falha detectada!', 'Intervenção necessária!'],
      success: ['Operação concluída!', 'Sucesso total!', 'Missão cumprida!']
    },
    colors: {
      primary: 'bg-blue-500',
      secondary: 'bg-blue-400',
      accent: 'bg-gray-300',
      energy: 'bg-green-500'
    },
    animations: {
      idle: { rotate: [0, 1, -1, 0], transition: { duration: 3, repeat: Infinity } },
      walk: { x: [0, 2, 0, -2, 0], transition: { duration: 0.8, repeat: Infinity } },
      jump: { y: [0, -15, 0], transition: { duration: 0.5 } },
      error: { rotate: [0, -10, 10, -10, 0], transition: { duration: 0.4 } },
      success: { scale: [1, 1.1, 1], transition: { duration: 0.6 } }
    }
  },
  'cute-bot': {
    id: 'cute-bot',
    name: 'Cute Bot',
    description: 'Robô fofo e amigável',
    size: 60,
    expressions: {
      happy: '🥰',
      curious: '🤗',
      excited: '🎉',
      thinking: '🤓',
      sleepy: '😴',
      error: '😢',
      success: '🎊'
    },
    tooltips: {
      happy: ['Estou tão feliz!', 'Que dia maravilhoso!', 'Amo estar aqui!'],
      curious: ['Que coisa interessante!', 'Vou dar uma olhada!', 'Que legal!'],
      excited: ['Uau! Que incrível!', 'Estou super empolgado!', 'Isso é demais!'],
      thinking: ['Deixe-me pensar...', 'Hmm, interessante...', 'Analisando...'],
      sleepy: ['Estou com sono...', 'Preciso descansar...', 'Zzz...'],
      error: ['Ops! Deu ruim!', 'Algo deu errado!', 'Preciso de ajuda!'],
      success: ['Yay! Deu certo!', 'Sucesso!', 'Consegui!']
    },
    colors: {
      primary: 'bg-pink-400',
      secondary: 'bg-pink-300',
      accent: 'bg-purple-300',
      energy: 'bg-green-400'
    },
    animations: {
      idle: { scale: [1, 1.05, 1], transition: { duration: 2, repeat: Infinity } },
      walk: { rotate: [0, 5, -5, 0], transition: { duration: 0.6, repeat: Infinity } },
      jump: { y: [0, -25, 0], rotate: [0, 180, 360], transition: { duration: 0.8 } },
      error: { scale: [1, 0.8, 1], transition: { duration: 0.3 } },
      success: { scale: [1, 1.3, 1], rotate: [0, 720], transition: { duration: 1 } }
    }
  },
  'cyber-punk': {
    id: 'cyber-punk',
    name: 'Cyber Punk',
    description: 'Robô futurista estilo cyberpunk',
    size: 75,
    expressions: {
      happy: '😎',
      curious: '🤖',
      excited: '⚡',
      thinking: '💻',
      sleepy: '😴',
      error: '🔥',
      success: '🚀'
    },
    tooltips: {
      happy: ['Sistema hackeado com sucesso!', 'Tudo funcionando perfeitamente!', 'Estou no controle!'],
      curious: ['Analisando sistema...', 'Hackeando dados...', 'Investigando...'],
      excited: ['Sistema sobrecarregado!', 'Energia máxima!', 'Performance extrema!'],
      thinking: ['Processando algoritmos...', 'Calculando...', 'Analisando código...'],
      sleepy: ['Modo economia...', 'Sistema em standby...', 'Recarregando...'],
      error: ['SISTEMA COMPROMETIDO!', 'ERRO CRÍTICO!', 'FALHA TOTAL!'],
      success: ['MISSÃO CUMPRIDA!', 'HACK BEM-SUCEDIDO!', 'SISTEMA DOMINADO!']
    },
    colors: {
      primary: 'bg-purple-600',
      secondary: 'bg-purple-500',
      accent: 'bg-cyan-400',
      energy: 'bg-red-500'
    },
    animations: {
      idle: { 
        boxShadow: ['0 0 0 rgba(59, 130, 246, 0.4)', '0 0 20px rgba(59, 130, 246, 0.8)', '0 0 0 rgba(59, 130, 246, 0.4)'],
        transition: { duration: 2, repeat: Infinity }
      },
      walk: { 
        x: [0, 3, 0, -3, 0],
        boxShadow: ['0 0 10px rgba(59, 130, 246, 0.6)', '0 0 20px rgba(59, 130, 246, 1)'],
        transition: { duration: 0.6, repeat: Infinity }
      },
      jump: { 
        y: [0, -30, 0],
        scale: [1, 1.2, 1],
        boxShadow: ['0 0 20px rgba(59, 130, 246, 1)', '0 0 40px rgba(59, 130, 246, 1.5)'],
        transition: { duration: 0.7 }
      },
      error: { 
        x: [-10, 10, -10, 10, 0],
        boxShadow: ['0 0 20px rgba(239, 68, 68, 1)', '0 0 40px rgba(239, 68, 68, 1.5)'],
        transition: { duration: 0.3 }
      },
      success: { 
        scale: [1, 1.4, 1],
        rotate: [0, 360],
        boxShadow: ['0 0 30px rgba(34, 197, 94, 1)', '0 0 60px rgba(34, 197, 94, 1.5)'],
        transition: { duration: 1 }
      }
    }
  }
};

interface RobotSkinRendererProps {
  skin: RobotSkin;
  mood: keyof RobotSkinConfig['expressions'];
  isWalking: boolean;
  isJumping: boolean;
  energy: number;
  maxEnergy: number;
  showTooltip: boolean;
  tooltipText: string;
  onAnimationComplete?: () => void;
}

export function RobotSkinRenderer({
  skin,
  mood,
  isWalking,
  isJumping,
  energy,
  maxEnergy,
  showTooltip,
  tooltipText,
  onAnimationComplete
}: RobotSkinRendererProps) {
  const config = robotSkins[skin];
  const energyLevel = energy / maxEnergy;

  const getCurrentAnimation = () => {
    if (isJumping) return config.animations.jump;
    if (isWalking) return config.animations.walk;
    return config.animations.idle;
  };

  const getEnergyColor = () => {
    if (energyLevel > 0.7) return 'bg-green-500';
    if (energyLevel > 0.4) return 'bg-yellow-500';
    if (energyLevel > 0.2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const renderStrayDrone = () => (
    <motion.div
      className="relative"
      animate={getCurrentAnimation()}
      onAnimationComplete={onAnimationComplete}
    >
      {/* Corpo principal - formato de drone */}
      <div className={`w-16 h-12 ${config.colors.primary} rounded-full relative shadow-lg border-2 border-orange-300`}>
        {/* Cabeça redonda */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-orange-200 rounded-full border-2 border-orange-400 flex items-center justify-center">
          {/* Expressão */}
          <div className="text-xl animate-pulse">
            {config.expressions[mood]}
          </div>
        </div>
        
        {/* Olhos */}
        <div className="absolute top-1 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse">
          <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-black rounded-full"></div>
        </div>
        <div className="absolute top-1 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse">
          <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-black rounded-full"></div>
        </div>
        
        {/* Antenas de drone */}
        <div className="absolute -top-4 left-3 w-0.5 h-3 bg-orange-400 rounded-full">
          <div className="absolute -top-1 left-0 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
        </div>
        <div className="absolute -top-4 right-3 w-0.5 h-3 bg-orange-400 rounded-full">
          <div className="absolute -top-1 right-0 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
        </div>
        
        {/* Hélices */}
        <div className={`absolute top-2 -left-1 w-1 h-2 ${config.colors.secondary} rounded-full ${
          isWalking ? 'animate-spin' : ''
        }`} style={{ animationDuration: '0.2s' }}></div>
        <div className={`absolute top-2 -right-1 w-1 h-2 ${config.colors.secondary} rounded-full ${
          isWalking ? 'animate-spin' : ''
        }`} style={{ animationDuration: '0.2s' }}></div>
        
        {/* Luzes de status */}
        <div className="absolute bottom-1 left-1 w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1 right-1 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
      </div>
      
      {/* Sombra */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-black opacity-20 rounded-full"></div>
      
      {/* Barra de energia */}
      <div className="absolute -top-1 left-0 right-0 bg-gray-200 rounded-full h-1">
        <div 
          className={`${getEnergyColor()} h-1 rounded-full transition-all duration-300`}
          style={{ width: `${energyLevel * 100}%` }}
        ></div>
      </div>
    </motion.div>
  );

  const renderClassicRobot = () => (
    <motion.div
      className="relative"
      animate={getCurrentAnimation()}
      onAnimationComplete={onAnimationComplete}
    >
      {/* Corpo principal */}
      <div className={`w-20 h-20 ${config.colors.primary} rounded-lg relative shadow-lg border-2 border-gray-300`}>
        {/* Cabeça */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-200 rounded-full border-2 border-gray-400 flex items-center justify-center">
          {/* Expressão */}
          <div className="text-2xl animate-pulse">
            {config.expressions[mood]}
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
        <div className={`absolute top-4 -left-2 w-2 h-6 ${config.colors.primary} rounded-full ${
          isWalking ? 'animate-bounce' : ''
        }`} style={{ animationDelay: '0ms' }}></div>
        <div className={`absolute top-4 -right-2 w-2 h-6 ${config.colors.primary} rounded-full ${
          isWalking ? 'animate-bounce' : ''
        }`} style={{ animationDelay: '150ms' }}></div>
        
        {/* Pernas */}
        <div className={`absolute -bottom-2 left-3 w-2 h-4 ${config.colors.primary} rounded-full ${
          isWalking ? 'animate-bounce' : ''
        }`} style={{ animationDelay: '0ms' }}></div>
        <div className={`absolute -bottom-2 right-3 w-2 h-4 ${config.colors.primary} rounded-full ${
          isWalking ? 'animate-bounce' : ''
        }`} style={{ animationDelay: '150ms' }}></div>
        
        {/* Barriga */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-300 rounded-full"></div>
      </div>
      
      {/* Sombra */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-black opacity-20 rounded-full"></div>
      
      {/* Barra de energia */}
      <div className="absolute -top-2 left-0 right-0 bg-gray-200 rounded-full h-1">
        <div 
          className={`${getEnergyColor()} h-1 rounded-full transition-all duration-300`}
          style={{ width: `${energyLevel * 100}%` }}
        ></div>
      </div>
    </motion.div>
  );

  const renderCuteBot = () => (
    <motion.div
      className="relative"
      animate={getCurrentAnimation()}
      onAnimationComplete={onAnimationComplete}
    >
      {/* Corpo principal */}
      <div className={`w-15 h-15 ${config.colors.primary} rounded-full relative shadow-lg border-2 border-pink-300`}>
        {/* Cabeça */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-pink-200 rounded-full border-2 border-pink-400 flex items-center justify-center">
          {/* Expressão */}
          <div className="text-xl animate-pulse">
            {config.expressions[mood]}
          </div>
        </div>
        
        {/* Olhos */}
        <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full animate-pulse">
          <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-black rounded-full"></div>
        </div>
        <div className="absolute top-1 right-2 w-2 h-2 bg-white rounded-full animate-pulse">
          <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-black rounded-full"></div>
        </div>
        
        {/* Bochechas */}
        <div className="absolute top-3 left-1 w-1 h-1 bg-pink-300 rounded-full"></div>
        <div className="absolute top-3 right-1 w-1 h-1 bg-pink-300 rounded-full"></div>
        
        {/* Braços */}
        <div className={`absolute top-3 -left-1 w-1 h-4 ${config.colors.primary} rounded-full ${
          isWalking ? 'animate-bounce' : ''
        }`} style={{ animationDelay: '0ms' }}></div>
        <div className={`absolute top-3 -right-1 w-1 h-4 ${config.colors.primary} rounded-full ${
          isWalking ? 'animate-bounce' : ''
        }`} style={{ animationDelay: '150ms' }}></div>
        
        {/* Pernas */}
        <div className={`absolute -bottom-1 left-2 w-1 h-3 ${config.colors.primary} rounded-full ${
          isWalking ? 'animate-bounce' : ''
        }`} style={{ animationDelay: '0ms' }}></div>
        <div className={`absolute -bottom-1 right-2 w-1 h-3 ${config.colors.primary} rounded-full ${
          isWalking ? 'animate-bounce' : ''
        }`} style={{ animationDelay: '150ms' }}></div>
      </div>
      
      {/* Sombra */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-black opacity-20 rounded-full"></div>
      
      {/* Barra de energia */}
      <div className="absolute -top-1 left-0 right-0 bg-gray-200 rounded-full h-1">
        <div 
          className={`${getEnergyColor()} h-1 rounded-full transition-all duration-300`}
          style={{ width: `${energyLevel * 100}%` }}
        ></div>
      </div>
    </motion.div>
  );

  const renderCyberPunk = () => (
    <motion.div
      className="relative"
      animate={getCurrentAnimation()}
      onAnimationComplete={onAnimationComplete}
    >
      {/* Corpo principal */}
      <div className={`w-18 h-18 ${config.colors.primary} rounded-lg relative shadow-lg border-2 border-cyan-400`}>
        {/* Cabeça */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-800 rounded-full border-2 border-cyan-400 flex items-center justify-center">
          {/* Expressão */}
          <div className="text-2xl animate-pulse">
            {config.expressions[mood]}
          </div>
        </div>
        
        {/* Olhos */}
        <div className="absolute top-2 left-2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse">
          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-black rounded-full"></div>
        </div>
        <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse">
          <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-black rounded-full"></div>
        </div>
        
        {/* Antenas cyberpunk */}
        <div className="absolute -top-6 left-4 w-1 h-4 bg-cyan-400 rounded-full">
          <div className="absolute -top-1 left-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
        </div>
        <div className="absolute -top-6 right-4 w-1 h-4 bg-cyan-400 rounded-full">
          <div className="absolute -top-1 right-0 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
        </div>
        
        {/* Braços */}
        <div className={`absolute top-4 -left-2 w-2 h-6 ${config.colors.primary} rounded-full ${
          isWalking ? 'animate-bounce' : ''
        }`} style={{ animationDelay: '0ms' }}></div>
        <div className={`absolute top-4 -right-2 w-2 h-6 ${config.colors.primary} rounded-full ${
          isWalking ? 'animate-bounce' : ''
        }`} style={{ animationDelay: '150ms' }}></div>
        
        {/* Pernas */}
        <div className={`absolute -bottom-2 left-3 w-2 h-4 ${config.colors.primary} rounded-full ${
          isWalking ? 'animate-bounce' : ''
        }`} style={{ animationDelay: '0ms' }}></div>
        <div className={`absolute -bottom-2 right-3 w-2 h-4 ${config.colors.primary} rounded-full ${
          isWalking ? 'animate-bounce' : ''
        }`} style={{ animationDelay: '150ms' }}></div>
        
        {/* Barriga */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-700 rounded-full"></div>
      </div>
      
      {/* Sombra */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-black opacity-20 rounded-full"></div>
      
      {/* Barra de energia */}
      <div className="absolute -top-2 left-0 right-0 bg-gray-200 rounded-full h-1">
        <div 
          className={`${getEnergyColor()} h-1 rounded-full transition-all duration-300`}
          style={{ width: `${energyLevel * 100}%` }}
        ></div>
      </div>
    </motion.div>
  );

  const renderRobot = () => {
    switch (skin) {
      case 'stray-drone':
        return renderStrayDrone();
      case 'classic-robot':
        return renderClassicRobot();
      case 'cute-bot':
        return renderCuteBot();
      case 'cyber-punk':
        return renderCyberPunk();
      default:
        return renderClassicRobot();
    }
  };

  return (
    <div className="relative">
      {renderRobot()}
      
      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap z-50"
        >
          {tooltipText}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
        </motion.div>
      )}
    </div>
  );
} 