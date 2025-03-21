'use client';

import { createClient } from '@supabase/supabase-js';

/**
 * Configuración del cliente Supabase
 * Asegúrate de tener las variables de entorno configuradas en el archivo .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL: URL de tu proyecto Supabase
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Clave anónima/pública de tu proyecto Supabase
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificar si las variables de entorno están configuradas
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Variables de entorno de Supabase no configuradas correctamente. Revisa tu archivo .env.local');
}

/**
 * Cliente de Supabase inicializado para uso en toda la aplicación
 */
export const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || ''
);

/**
 * Genera o recupera un identificador único para el usuario actual
 * Este identificador se utiliza para rastrear los votos sin requerir inicio de sesión
 * 
 * @returns {string} Fingerprint único del usuario
 */
export const getUserFingerprint = () => {
  // Solo ejecutar en el cliente
  if (typeof window === 'undefined') return '';
  
  // Nombre de la clave en localStorage
  const FINGERPRINT_KEY = 'user_fingerprint';
  
  // Intentar obtener el fingerprint existente
  let fingerprint = localStorage.getItem(FINGERPRINT_KEY);
  
  // Si no existe, generar uno nuevo
  if (!fingerprint) {
    // Combinar timestamp actual con número aleatorio para mayor unicidad
    fingerprint = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(FINGERPRINT_KEY, fingerprint);
  }
  
  return fingerprint;
}; 