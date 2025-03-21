import { supabase } from './supabase';

/**
 * Lista de frases motivacionales para inicializar en la base de datos
 */
const DEFAULT_PHRASES = [
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

/**
 * Inicializa frases motivacionales en Supabase si no existen
 * Esta función verifica si hay frases en la base de datos y,
 * si no hay ninguna, agrega un conjunto predeterminado de frases.
 * 
 * @async
 * @returns {Promise<void>}
 */
const initializePhrases = async () => {
  try {
    // Verificar si ya existen frases en la base de datos
    const { count, error: countError } = await supabase
      .from('motivational_phrases')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error al verificar frases existentes:', countError);
      return;
    }
    
    // Si no hay frases, agregar las frases predeterminadas
    if (count === 0) {
      console.log('No se encontraron frases. Agregando frases iniciales...');
      
      const { error: insertError } = await supabase
        .from('motivational_phrases')
        .insert(DEFAULT_PHRASES.map(phrase => ({ phrase })));
        
      if (insertError) {
        console.error('Error al insertar frases iniciales:', insertError);
      } else {
        console.log(`${DEFAULT_PHRASES.length} frases iniciales agregadas con éxito`);
      }
    } else {
      console.log(`Ya existen ${count} frases en la base de datos`);
    }
  } catch (error) {
    console.error('Error inesperado al inicializar frases:', error);
  }
};

export default initializePhrases; 