'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import FlowerAnimation from './components/FlowerAnimation';
import MotivationalText from './components/MotivationalText';
import Link from 'next/link';

// Cargamos el componente Confetti de forma dinámica para evitar errores en el servidor
const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false,
  loading: () => null
});

export default function Home() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marcamos que estamos en el cliente
    setIsClient(true);
    setShowConfetti(true);
    
    // Establecer las dimensiones de la ventana
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    // Manejar el redimensionamiento de la ventana
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    // Establecer un temporizador para ocultar el confetti después de 7 segundos
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 7000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center relative overflow-hidden gradient-bg">
      {isClient && showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          numberOfPieces={200}
          colors={['#FFD700', '#FFEB3B', '#FFC107', '#FF9800', '#4CAF50']}
          recycle={false}
        />
      )}
      
      <motion.div 
        className="max-w-md mx-auto p-8 rounded-lg shadow-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="mb-12 floating"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <FlowerAnimation />
        </motion.div>
        
        <motion.div 
          className="mt-8 text-shadow"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <MotivationalText />
        </motion.div>
      </motion.div>
      <Link href="https://www.instagram.com/jonaa.nw/" className="absolute bottom-6 right-6 text-sm text-gray-700">@jonaa.nw</Link>
    </main>
  );
}
