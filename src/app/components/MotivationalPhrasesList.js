'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import MotivationalPhrase from './MotivationalPhrase';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Componente que muestra una lista de frases motivacionales y permite cambiar entre ellas
 * @returns {JSX.Element} Componente de lista de frases motivacionales
 */
const MotivationalPhrasesList = () => {
  const [phrases, setPhrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhrase, setSelectedPhrase] = useState(null);
  const [selectedPhraseId, setSelectedPhraseId] = useState(null);
  const audioContextRef = useRef(null);
  
  /**
   * Reproduce un sonido simple al cambiar de frase
   */
  const playPopSound = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;
      
      // Inicializar el contexto de audio si no existe
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const context = audioContextRef.current;
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
  }, []);
  
  /**
   * Actualiza la frase seleccionada
   * @param {Object} phraseObj - Objeto con la información de la frase
   */
  const updateSelectedPhrase = useCallback((phraseObj) => {
    setSelectedPhrase(phraseObj);
    setSelectedPhraseId(phraseObj?.id || null);
  }, []);
  
  /**
   * Selecciona una nueva frase aleatoria
   */
  const changePhrase = useCallback(() => {
    if (phrases.length <= 1) return;
    
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * phrases.length);
    } while (selectedPhraseId && phrases[newIndex].id === selectedPhraseId);
    
    updateSelectedPhrase(phrases[newIndex]);
    playPopSound();
  }, [phrases, selectedPhraseId, updateSelectedPhrase, playPopSound]);
  
  // Cargar frases iniciales
  useEffect(() => {
    const fetchPhrases = async () => {
      try {
        // Obtener todas las frases ordenadas por cantidad de corazones (descendente)
        const { data, error } = await supabase
          .from('motivational_phrases')
          .select('*')
          .order('heart_count', { ascending: false });
          
        if (error) throw error;
        
        setPhrases(data || []);
        
        // Seleccionar una frase aleatoria para mostrar al inicio
        if (data && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          updateSelectedPhrase(data[randomIndex]);
        }
      } catch (err) {
        console.error('Error obteniendo frases:', err);
        setError('No se pudieron cargar las frases. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhrases();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Configurar suscripción para actualizaciones en tiempo real
  useEffect(() => {
    // Suscripción a cambios en tiempo real en la tabla motivational_phrases
    const channel = supabase
      .channel('motivational_phrases_changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'motivational_phrases' 
      }, (payload) => {
        // Actualizar la frase específica que cambió
        setPhrases(prevPhrases => 
          prevPhrases.map(phrase => 
            phrase.id === payload.new.id ? payload.new : phrase
          )
        );
        
        // Si la frase seleccionada fue actualizada, actualizarla
        if (selectedPhraseId && selectedPhraseId === payload.new.id) {
          updateSelectedPhrase(payload.new);
        }
      })
      .subscribe();
      
    // Limpiar suscripción al desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedPhraseId, updateSelectedPhrase]);
  
  if (loading) return <div className="loading">Cargando frases motivadoras...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="phrases-container">
      <AnimatePresence mode="wait">
        {selectedPhrase && (
          <motion.div
            key={selectedPhrase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <MotivationalPhrase 
              phraseId={selectedPhrase.id}
              phrase={selectedPhrase.phrase}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className="btn-yellow mt-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={changePhrase}
      >
        Nuevo mensaje
      </motion.button>
    </div>
  );
};

export default MotivationalPhrasesList; 