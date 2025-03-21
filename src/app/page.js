'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import FlowerAnimation from './components/FlowerAnimation';
import MotivationalPhrasesList from './components/MotivationalPhrasesList';
import initializePhrases from './lib/initializePhrases';
import './styles/motivational-phrases.css';
import Link from 'next/link';

// Cargamos el componente Confetti de forma dinámica para evitar errores en el servidor
const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false,
  loading: () => null
});

/**
 * Página principal de la aplicación
 * Muestra una animación de flores, confeti y frases motivacionales
 * @returns {JSX.Element} Componente de página principal
 */
export default function Home() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Solo ejecutamos este código en el cliente
    setIsClient(true);
    
    // Mostrar confeti al cargar la página
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

    // Ocultar el confeti después de 7 segundos
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 7000);
    
    // Inicializar frases en Supabase (si no existen)
    initializePhrases();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center relative overflow-hidden gradient-bg">
      {/* Confeti solo en el cliente y cuando debe mostrarse */}
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
        className="max-w-xl mx-auto p-8 rounded-lg shadow-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animación de flores */}
        <motion.div 
          className="mb-16 floating"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {isClient && <FlowerAnimation />}
        </motion.div>
        
        {/* Lista de frases motivacionales */}
        <motion.div 
          className="mt-12 text-shadow"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {isClient && <MotivationalPhrasesList />}
        </motion.div>
      </motion.div>
      
      {/* Marca de agua */}
      <Link href="https://www.instagram.com/jonaa.nw/" className="absolute bottom-5 right-5  text-zinc-700 dark:text-white font-medium text-sm backdrop-blur-sm">
        jonaa.nw
      </Link>
    </main>
  );
}
