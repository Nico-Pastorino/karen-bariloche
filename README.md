# karen-bariloche

## Conexión con Supabase

1. Crea un proyecto en [Supabase](https://supabase.com) y copia la **URL** y la **anon key** desde la sección *Project Settings > API*.
2. Renombra el archivo `.env.example` a `.env.local`. Ya incluye la URL y la clave anónima del proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://epyxykoaeaswfkeoqxpr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweXh5a29hZWFzd2ZrZW9xeHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzUwODQsImV4cCI6MjA2MzUxMTA4NH0.aDMDLLQqYcGzgAMdLy0IoBK5WdzUzgvLwXdJ8yng0Q0
```

3. En el código, el cliente de Supabase se inicializa en `lib/supabase.ts` usando estas variables de entorno. No necesitas cambiar nada más para comenzar a realizar consultas.

4. Ejecuta la aplicación con `npm run dev` y verifica que puedas acceder a tus datos.
