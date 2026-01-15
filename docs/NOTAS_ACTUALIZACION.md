# Documentación de Actualización - Next.js 15 + Tailwind CSS 4

Este proyecto ha sido actualizado a las versiones más recientes y estables de las tecnologías frontend para garantizar el mejor rendimiento y compatibilidad con Node.js x64.

## 🚀 Cambios Principales

1.  **Next.js 15.1.x**:
    *   Soporte nativo para **React 19**.
    *   Uso de **Turbopack** por defecto para compilaciones ultrarrápidas en desarrollo.
    *   Configuración simplificada en `next.config.mjs`.

2.  **Tailwind CSS 4.0**:
    *   **Arquitectura "CSS-first"**: Ya no necesitas `tailwind.config.ts` ni `postcss.config.js`. Todo se configura directamente en `src/app/globals.css`.
    *   Uso de `@import "tailwindcss";` para cargar el motor.
    *   Definición de temas mediante la directiva `@theme`.

3.  **React 19**:
    *   Mejoras en el manejo de hooks y renderizado asíncrono.
    *   Instalado mediante `--force` para asegurar compatibilidad con librerías de componentes que aún usan tipos de React 18.

## 🛠️ Cómo Ejecutar el Proyecto

Para que no tengas que usar comandos complicados, ahora puedes usar:

### Frontend
```bash
cd sistema_facturacion/web-app
npm run dev
```

### Backend (Identity Service)
```bash
cd sistema_facturacion/services/identity-service
npm run start:dev
```

*(Repetir para los otros servicios según sea necesario)*

## 💡 Notas sobre errores detectados
*   **PATH de Node**: Si en algún momento ves errores de "node no se reconoce", asegúrate de que `C:\Program Files\nodejs\` esté en las variables de entorno de tu sistema (PATH).
*   **HMR Warnings**: Los mensajes de "unrecognized HMR message" en la consola son avisos internos de la versión de desarrollo de Next.js 15 (Turbopack) en ciertos entornos de Windows, pero no afectan al funcionamiento de la aplicación.
*   **Purga de archivos**: Se eliminaron `tailwind.config.ts` y `postcss.config.js` porque Tailwind 4 autodetecta la configuración desde el archivo CSS principal.
