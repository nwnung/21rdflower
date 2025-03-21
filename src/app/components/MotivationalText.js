'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Textos motivacionales expandidos
const motivationalTexts = [
  "Las flores amarillas más bonitas son las que florecen en tu interior",
  "No necesitas flores amarillas para brillar con luz propia",
  "Quizás no recibiste flores amarillas, pero mereces un jardín entero",
  "Las flores se marchitan, pero tu sonrisa ilumina más que mil girasoles",
  "Cada día es una oportunidad para florecer, con o sin flores amarillas",
  "Tu valor no depende de las flores que recibas, sino de las que cultives en tu corazón",
  "Brilla con la intensidad de mil flores amarillas",
  "El sol es la flor amarilla más grande, y cada día te ilumina a ti",
  "Las mejores flores son las que crecen después de la tormenta"
];

export default function MotivationalText() {
  // Estado para el texto actual y el índice
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [audioContext, setAudioContext] = useState(null);

  // Inicializar AudioContext solo después de interacción del usuario
  useEffect(() => {
    // Solo inicializamos en el cliente
    if (typeof window !== 'undefined') {
      // No inicializamos automáticamente para evitar errores
      // Se iniciará cuando el usuario haga clic en el botón
    }
  }, []);

  // Función para reproducir un sonido simple
  const playPopSound = () => {
    // Crear un contexto de audio
    try {
      let context;
      // Si ya tenemos un contexto, lo usamos
      if (audioContext) {
        context = audioContext;
      } else {
        // Si no, creamos uno nuevo
        context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);
      }
      
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, context.currentTime); // Nota A5
      oscillator.frequency.exponentialRampToValueAtTime(440, context.currentTime + 0.1); // Bajada a A4
      
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.start();
      oscillator.stop(context.currentTime + 0.1);
    } catch (e) {
      console.error('Error al reproducir sonido:', e);
    }
  };

  // Función para obtener un texto aleatorio diferente al actual
  const getRandomText = () => {
    if (motivationalTexts.length <= 1) return 0;
    
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * motivationalTexts.length);
    } while (newIndex === currentTextIndex);
    
    return newIndex;
  };

  // Cambiar el texto cada vez que se carga la página
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const randomIndex = Math.floor(Math.random() * motivationalTexts.length);
      setCurrentTextIndex(randomIndex);
    }
  }, []);

  // Función para cambiar el texto manualmente
  const changeText = () => {
    if (isChanging) return;
    
    setIsChanging(true);
    setTimeout(() => {
      const newIndex = getRandomText();
      setCurrentTextIndex(newIndex);
      playPopSound();
      setIsChanging(false);
    }, 500);
  };

  return (
    <div className="text-center">
      <AnimatePresence mode="wait">
        <motion.h1 
          key={currentTextIndex}
          className="text-2xl md:text-3xl font-bold mb-8 display-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {motivationalTexts[currentTextIndex]}
        </motion.h1>
      </AnimatePresence>
      
      <motion.button
        className="btn-yellow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={changeText}
        disabled={isChanging}
      >
        Nuevo mensaje
      </motion.button>
    </div>
  );
} 