# 🌻 Flores Amarillas - Aplicación Motivacional

Una aplicación web que proporciona mensajes motivacionales para quienes no recibieron flores amarillas. Incluye animaciones de flores, frases motivacionales con sistema de reacciones y efectos visuales.

## ✨ Características

- 🌼 Animación de flores amarillas optimizada para dispositivos móviles
- 💬 Frases motivacionales aleatorias
- ❤️ Sistema de reacciones con contador persistente
- 🔄 Actualizaciones en tiempo real de los contadores
- 🎵 Efectos de sonido interactivos
- 🌓 Soporte para modo oscuro/claro
- 📱 Diseño responsivo para todos los dispositivos

## 🚀 Tecnologías

- **Frontend**: Next.js, React, Framer Motion, TailwindCSS
- **Backend**: Supabase (Base de datos PostgreSQL, Realtime, RLS)
- **Otros**: Web Audio API para efectos de sonido

## 🛠️ Configuración Local

### Requisitos Previos

- Node.js 18+ y npm
- Cuenta en [Supabase](https://supabase.com)

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone [url-del-repositorio]
   cd flores-amarillas
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar Supabase**

   - Crear un nuevo proyecto en [Supabase](https://app.supabase.com)
   - Ejecutar el script SQL en la consola SQL de Supabase:

   ```sql
   -- Copiar y pegar el contenido del archivo supabase-setup.sql aquí
   ```

4. **Configurar variables de entorno**

   - Crear un archivo `.env.local` en la raíz del proyecto:

   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica_de_supabase
   ```

5. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

6. **Acceder a la aplicación**

   Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 📤 Despliegue en Producción

### Opción 1: Vercel (Recomendado)

1. Crear una cuenta en [Vercel](https://vercel.com)
2. Importar el repositorio desde GitHub/GitLab/Bitbucket
3. Configurar las variables de entorno de Supabase en la sección "Environment Variables":
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Desplegar

### Opción 2: Netlify

1. Crear una cuenta en [Netlify](https://netlify.com)
2. Importar el repositorio desde GitHub/GitLab/Bitbucket
3. Configurar las variables de entorno de Supabase en la sección "Build & deploy → Environment":
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Establecer el comando de construcción como `npm run build`
5. Establecer el directorio de publicación como `.next`

## 📝 Notas Importantes

### Variables de Entorno

- **Desarrollo local**: Las variables se leen desde `.env.local`
- **Producción**: Deben configurarse en la plataforma de despliegue
- Las variables de entorno que comienzan con `NEXT_PUBLIC_` son incluidas en el bundle del cliente

### Solución de Problemas

- **Error "The current user is not authorized"**: Verifica que las políticas RLS estén configuradas correctamente en Supabase.
- **Error con variables de entorno**: Asegúrate de que estén correctamente configuradas en tu plataforma de despliegue.
- **Problemas con el Audio**: Los navegadores móviles pueden requerir interacción del usuario antes de reproducir audio.

## 📄 Licencia

Este proyecto está licenciado bajo [Nombre de la Licencia] - ver el archivo LICENSE para más detalles.

## 👤 Autor

jonaa.nw