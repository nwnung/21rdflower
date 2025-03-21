'use client';

import { createClient } from '@supabase/supabase-js';

/**
 * Configuración del cliente Supabase
 * 
 * IMPORTANTE PARA DEPLOYMENT:
 * 1. En desarrollo local, estas variables se leen del archivo .env.local
 * 2. Para producción, debes configurar estas variables en tu plataforma de deploy:
 *    - Vercel: https://vercel.com/docs/concepts/projects/environment-variables
 *    - Netlify: https://docs.netlify.com/environment-variables/overview/
 *    - Otras plataformas: Consulta su documentación específica
 * 
 * Variables requeridas:
 * - NEXT_PUBLIC_SUPABASE_URL: URL de tu proyecto Supabase
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Clave anónima/pública de tu proyecto Supabase
 */

// Obtener variables de entorno con valores de respaldo para desarrollo
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hdckzinlykqlwfyhgnor.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkY2t6aW5seWtxbHdmeWhnbm9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MjE5NzIsImV4cCI6MjA1ODA5Nzk3Mn0.1CuQVlMKrLEEVphdJroF_cYF-eYBk1BVw9Z0iZiPlCI';

// Advertencia si las URLs parecen ser los valores predeterminados en producción
if (process.env.NODE_ENV === 'production' && 
    (supabaseUrl === 'https://hdckzinlykqlwfyhgnor.supabase.co' || 
     !supabaseUrl || !supabaseKey)) {
  console.warn(
    '⚠️ Producción: Las variables de entorno de Supabase parecen no estar configuradas correctamente.\n' +
    'Asegúrate de configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu plataforma de deploy.'
  );
}

/**
 * Cliente de Supabase inicializado para uso en toda la aplicación
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

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