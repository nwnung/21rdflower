'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Configuraciones para 2 flores más grandes y detalladas
const flowerConfigs = [
  { 
    size: 1.8, 
    position: { x: 0, y: 0 }, 
    delay: 0, 
    petalColor: "var(--yellow-primary)",
    centerColor: "#FFA000",
    petalCount: 18,
    stemHeight: 60,
    petalLength: 38
  },
  { 
    size: 1.2, 
    position: { x: -80, y: 40 }, 
    delay: 0.3, 
    petalColor: "#FFEB3B",
    centerColor: "#FFB300",
    petalCount: 16,
    stemHeight: 50,
    petalLength: 34
  }
];

export default function FlowerAnimation() {
  // Este estado nos ayudará a evitar errores de hidratación
  const [isClient, setIsClient] = useState(false);
  
  // Solo renderizamos las flores una vez que estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    // Devolvemos un placeholder mientras estamos en el servidor
    return <div className="flower-container relative w-96 h-96"></div>;
  }
  
  return (
    <div className="flower-container relative w-96 h-96">
      {flowerConfigs.map((config, index) => (
        <Flower
          key={index}
          size={config.size}
          position={config.position}
          delay={config.delay}
          petalColor={config.petalColor}
          centerColor={config.centerColor}
          petalCount={config.petalCount}
          stemHeight={config.stemHeight}
          petalLength={config.petalLength}
        />
      ))}
    </div>
  );
}

// Componente para una sola flor con más detalles
const Flower = ({ size, position, delay, petalColor, centerColor, petalCount, stemHeight, petalLength }) => {
  return (
    <motion.div 
      className="absolute"
      style={{ 
        left: `calc(50% + ${position.x}px)`, 
        top: `calc(50% + ${position.y}px)`,
        zIndex: Math.round(10 * (1 - size))
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: size, opacity: 1 }}
      transition={{ duration: 1.2, delay: delay, ease: "easeOut" }}
    >
      {/* Tallo principal */}
      <motion.div 
        className="absolute left-1/2 -translate-x-1/2 top-0 stem origin-top"
        style={{ 
          width: '8px',
          height: `${stemHeight}px`,
          background: "linear-gradient(to bottom, #4CAF50 0%, #2E7D32 100%)",
          borderRadius: '4px'
        }}
        animate={{ 
          rotateZ: [0, 1, -1, 0],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut" 
        }}
      >
        {/* Primera hoja */}
        <motion.div
          className="absolute"
          style={{
            width: '28px',
            height: '16px',
            top: '40%',
            left: '-26px',
            background: 'linear-gradient(to bottom right, #4CAF50 0%, #2E7D32 100%)',
            borderRadius: '100% 0 100% 0',
            transformOrigin: 'right center',
            transform: 'rotate(-20deg)'
          }}
          animate={{
            rotateZ: [-20, -15, -20],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
        />
        
        {/* Segunda hoja */}
        <motion.div
          className="absolute"
          style={{
            width: '28px',
            height: '16px',
            top: '60%',
            right: '-26px',
            background: 'linear-gradient(to bottom left, #4CAF50 0%, #2E7D32 100%)',
            borderRadius: '0 100% 0 100%',
            transformOrigin: 'left center',
            transform: 'rotate(20deg)'
          }}
          animate={{
            rotateZ: [20, 15, 20],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        
        {/* Pequeñas hojas adicionales para más detalle */}
        <motion.div
          className="absolute"
          style={{
            width: '18px',
            height: '10px',
            top: '25%',
            right: '-16px',
            background: 'linear-gradient(to bottom left, #4CAF50 0%, #2E7D32 100%)',
            borderRadius: '0 100% 0 100%',
            transformOrigin: 'left center',
            transform: 'rotate(15deg)'
          }}
          animate={{
            rotateZ: [15, 10, 15],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
            delay: 0.7,
          }}
        />
      </motion.div>
      
      {/* Centro de la flor detallado */}
      <motion.div 
        className="absolute rounded-full z-30"
        style={{ 
          width: '40px',
          height: '40px',
          top: '-20px',
          left: '-20px',
          background: `radial-gradient(circle, ${centerColor} 0%, #E65100 90%, #BF360C 100%)`,
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)'
        }}
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut" 
        }}
      >
        {/* Detalles del centro - patrones de semillas */}
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-yellow-900" 
            style={{
              width: '4px',
              height: '4px',
              left: `${20 + 15 * Math.cos(i * Math.PI / 7.5)}px`,
              top: `${20 + 15 * Math.sin(i * Math.PI / 7.5)}px`,
              opacity: 0.7
            }}
          />
        ))}
      </motion.div>
      
      {/* Pétalos detallados */}
      {[...Array(petalCount)].map((_, i) => {
        // Para pétalos más realistas, hacemos que cada uno sea un poco diferente
        const randomLength = petalLength + (Math.random() * 4 - 2);
        const randomWidth = 14 + (Math.random() * 2 - 1);
        const randomAngle = (360 / petalCount) * i + (Math.random() - 0.5) * 2;
        
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: `${randomWidth}px`,
              height: `${randomLength}px`,
              left: '0',
              top: '-20px',
              background: `linear-gradient(to top, ${petalColor} 80%, #FFF9C4 100%)`,
              borderTopLeftRadius: '50% 90%',
              borderTopRightRadius: '50% 90%',
              borderBottomLeftRadius: '20% 10%',
              borderBottomRightRadius: '20% 10%',
              transformOrigin: 'center bottom',
              transform: `translate(-${randomWidth/2}px, -10px) rotate(${randomAngle}deg) translateY(-${randomLength/2}px)`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              zIndex: i % 2 === 0 ? 20 : 10 // Alternar capas para profundidad
            }}
            animate={{
              scaleY: [1, 1.03, 1],
              rotateZ: [randomAngle, randomAngle + 0.5, randomAngle]
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random(),
              ease: "easeInOut",
              delay: i * 0.08
            }}
          />
        );
      })}
      
      {/* Brillo superior para efecto de luz */}
      <div 
        className="absolute rounded-full bg-white opacity-40"
        style={{
          width: '16px',
          height: '10px',
          top: '-32px',
          left: '-8px',
          filter: 'blur(3px)'
        }}
      />
    </motion.div>
  );
}; 