'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { getUserFingerprint } from '../lib/supabase';

/**
 * Componente que muestra una frase motivacional individual con un contador de corazones
 * @param {Object} props - Propiedades del componente
 * @param {string} props.phraseId - ID único de la frase en Supabase
 * @param {string} props.phrase - Texto de la frase motivacional
 * @returns {JSX.Element} Componente de frase motivacional con sistema de votos
 */
const MotivationalPhrase = ({ phraseId, phrase }) => {
  const [heartCount, setHeartCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const audioContextRef = useRef(null);
  
  /**
   * Reproduce un sonido suave al dar corazón
   */
  const playHeartSound = () => {
    try {
      if (typeof window === 'undefined') return;
      
      // Inicializar el contexto de audio si no existe
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      // Sonido más suave y melodioso para el corazón
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, context.currentTime); // Nota D5
      oscillator.frequency.exponentialRampToValueAtTime(783.99, context.currentTime + 0.1); // Subida a G5
      
      gainNode.gain.setValueAtTime(0.2, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.start();
      oscillator.stop(context.currentTime + 0.3);
    } catch (e) {
      console.error('Error al reproducir sonido:', e);
    }
  };
  
  // Verificar recuento actual de corazones y si el usuario ha votado
  useEffect(() => {
    const checkHeartCount = async () => {
      // Obtener el recuento actual de corazones para esta frase
      const { data, error } = await supabase
        .from('motivational_phrases')
        .select('heart_count')
        .eq('id', phraseId)
        .single();
        
      if (error) {
        console.error('Error al obtener el recuento de corazones:', error);
        return;
      }
      
      setHeartCount(data.heart_count || 0);
      
      // Verificar si el usuario ya ha votado por esta frase
      const userFingerprint = getUserFingerprint();
      const localStorageKey = `voted_${phraseId}`;
      const hasVotedLocally = localStorage.getItem(localStorageKey) === 'true';
      
      // Si ya votó localmente, no necesitamos verificar en la base de datos
      if (hasVotedLocally) {
        setHasVoted(true);
        return;
      }
      
      // Verificar en la base de datos
      const { data: voteData, error: voteError } = await supabase
        .from('user_votes')
        .select('id')
        .eq('phrase_id', phraseId)
        .eq('user_fingerprint', userFingerprint)
        .maybeSingle();
        
      if (voteError) {
        console.error('Error al verificar el voto del usuario:', voteError);
        return;
      }
      
      // Si hay un voto, actualizar el estado y guardar localmente
      if (voteData) {
        setHasVoted(true);
        localStorage.setItem(localStorageKey, 'true');
      }
    };
    
    checkHeartCount();
  }, [phraseId]);
  
  /**
   * Maneja el clic en el botón de corazón para registrar un voto
   */
  const handleHeartClick = async () => {
    // No permitir votar si ya votó o si está animando
    if (hasVoted || isAnimating) return;
    
    setIsAnimating(true);
    playHeartSound();
    
    const userFingerprint = getUserFingerprint();
    const localStorageKey = `voted_${phraseId}`;
    
    try {
      // Llamar a la función RPC de Supabase para incrementar el contador
      const { data, error } = await supabase.rpc(
        'increment_heart_count',
        { 
          p_phrase_id: phraseId,
          p_user_fingerprint: userFingerprint
        }
      );
      
      if (error) throw error;
      
      // Si la operación fue exitosa, actualizar el estado
      if (data.success) {
        setHeartCount(prevCount => prevCount + 1);
        setHasVoted(true);
        localStorage.setItem(localStorageKey, 'true');
      } else if (data.message.includes('already voted')) {
        // Si el usuario ya ha votado, actualizar el estado
        setHasVoted(true);
        localStorage.setItem(localStorageKey, 'true');
      }
    } catch (err) {
      console.error('Error al incrementar el contador:', err);
    } finally {
      // Restaurar el estado de animación después de un breve momento
      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    }
  };
  
  return (
    <div className="motivational-phrase">
      <p className="phrase-text">{phrase}</p>
      
      <div className="heart-counter">
        <motion.button
          className={`heart-button ${hasVoted ? 'has-voted' : ''}`}
          whileHover={{ scale: hasVoted ? 1 : 1.1 }}
          whileTap={{ scale: hasVoted ? 1 : 0.9 }}
          onClick={handleHeartClick}
          disabled={hasVoted}
          aria-label={hasVoted ? "Ya has dado corazón" : "Dar corazón"}
          animate={isAnimating ? { 
            scale: [1, 1.3, 1],
            transition: { duration: 0.5 }
          } : {}}
        >
          {hasVoted ? '❤️' : '🤍'}
        </motion.button>
        <span className="heart-count">{heartCount}</span>
      </div>
    </div>
  );
};

export default MotivationalPhrase; 