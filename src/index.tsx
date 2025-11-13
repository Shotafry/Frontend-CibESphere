// src/index.tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App' // Importamos el componente App principal
import reportWebVitals from './reportWebVitals'

import 'leaflet/dist/leaflet.css' // <-- AÑADE ESTA LÍNEA

const container = document.getElementById('root')
const root = createRoot(container!) // ¡Aseguramos que container no es null!

// Renderizamos el componente App dentro de StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Si quieres medir el rendimiento, puedes descomentar esto
// reportWebVitals(console.log);
reportWebVitals()
