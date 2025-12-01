# Propuestas de Mejora y Roadmap Personal

## 1. Checklist de Refactorización y Modularidad

- [ ] Extraer componentes reutilizables:
  - [ ] `<CustomHeroButton />` para botones repetidos ("Soy Organizador"/"Soy Participante")
  - [ ] `<OrganizerModal />` para encapsular el contenido del Modal
  - [ ] Otros elementos repetidos (inputs, tarjetas, etc.)
- [ ] Eliminar estilos inline y `<style>` en JSX
- [ ] Centralizar animaciones (`@keyframes`) y estilos complejos en archivos de estilos o theme
- [ ] Renombrar archivos/componentes para que coincidan (`ComunidadBox.tsx`)
- [ ] Refactorizar lógica de negocio fuera de componentes de presentación
- [ ] Refuerza tipado con TypeScript en todos los props

## 2. Responsive Design

- [ ] Usar breakpoints de MUI (`theme.breakpoints`) y props `sx` responsivos
- [ ] Revisar layouts con Grid/Flex en xs/sm/md/lg
- [ ] Ajustar paddings/margins/typografías para mobile-first
- [ ] Pruebas en dispositivos reales/emuladores

## 3. Sistema de Diseño

- Centralizar tokens de color, tipografía y espaciados en el theme de MUI y/o variables CSS en `global.css`
- Ejemplo de tokens:
  - Colores: `--color-cadetblue`, `--gradient-button-primary`, etc.
  - Tipografía: `'Satoshi', Arial, Helvetica, sans-serif`
  - Sombras y gradientes
- Definir componentes base (ej. `CustomButton`, `CustomCard`)
- Documentar ejemplos de uso

## 4. Buenas Prácticas

- Mantener el stack: TypeScript + MUI + React Router Data API
- Evitar repetición de estilos/lógica (DRY)
- Separar lógica de presentación
- Usar el theme de MUI para gradientes, colores, fuentes recurrentes

## 5. Roadmap Personal

- [ ] Auditoría rápida de todos los componentes y páginas principales
- [ ] Checklist de refactorización (ver arriba)
- [ ] Documentar el sistema de diseño
- [ ] QA y revisión de accesibilidad (Lighthouse, herramientas de a11y)
- [ ] Iterar por módulos: Landing, Paneles, Eventos, etc.

---

## Apuntes y Notas 

### Componente `ComunidadBox`

> **Nota:** El nombre del archivo y del componente no coinciden (se sugiere `ComunidadBox.tsx` en lugar de `AboutThis.tsx` o cambiar el nombre del componente).

### Responsive OK

Las siguientes son áreas de oportunidad para aplicar mejores prácticas:

1.  ### Inserción de Estilos Globales (CSS-in-JS vs. Ficheros CSS)

    La inclusión de etiquetas `<style>` dentro del JSX para definir los `@keyframes` (`fadeInHero` y `iconPulse`) es una práctica que se debe evitar en la mayoría de los casos.

    * **Mejor Práctica**: Mover estas definiciones de animación a un archivo CSS/SCSS dedicado o utilizar la funcionalidad de animación que ofrece **`styled-components`**, **Emotion** (que usa MUI por debajo), o el sistema de **`theme` de MUI**, para mantener la separación de intereses.

2.  ### Estilos Inline Complejos en el `Modal`

    El `Modal` utiliza muchos estilos *inline* anidados a través del prop `sx`, y en algunos casos, estilos CSS *inline* con el atributo `style` (e.g., el `span` dentro del `Typography` del Modal). Esto hace que el componente sea denso y difícil de leer.

    * **Mejor Práctica**: **Extraer** el contenido del `Modal` en un **subcomponente dedicado** (e.g., `<OrganizadorModal />`) para limpiar la estructura del `ComunidadBox`.

3.  ### Falta de Extracción de Componentes Reutilizables

    Los botones de "Soy Organizador" y "Soy Participante" tienen estilos idénticos y se repiten, violando el principio DRY.

    * **Mejor Práctica**: Crear un componente **`CustomButton`** (o similar) que encapsule esos estilos compartidos, aplicando el principio **DRY (Don't Repeat Yourself)**.

---

## Anexos

- Fragmentos de código útiles
- Enlaces a recursos de diseño o documentación

---

## Checklist atomizado para implementar la auditoría y refactorización

1. **Preparación y organización**
   - [ ] Lee y comprende el diagnóstico completo en `auditoria.md`.
   - [ ] Prioriza tareas según impacto y facilidad (quick wins primero).

2. **Refactorización de componentes y páginas**
   - [ ] Extrae componentes reutilizables (botones, modales, tarjetas, inputs).
   - [ ] Divide archivos grandes en subcomponentes (ej: EventFilters, Eventos, Page, PanelDeOrganizador).
   - [ ] Renombra archivos/componentes para que coincidan (ej: AboutThis → ComunidadBox).
   - [ ] Refuerza el tipado en todos los props y estados.
   - [ ] Separa lógica de negocio de la presentación.

3. **Estilos y sistema de diseño**
   - [ ] Elimina estilos inline y `<style>` en JSX.
   - [ ] Centraliza animaciones y tokens en el theme de MUI o CSS global.
   - [ ] Documenta y aplica tokens de color, tipografía y espaciados.
   - [ ] Refactoriza `global.css` para contener solo resets, fuentes y variables globales.

4. **Responsive y accesibilidad**
   - [ ] Usa breakpoints y props `sx` responsivos de MUI.
   - [ ] Revisa todos los layouts en mobile, tablet y desktop.
   - [ ] Añade atributos ARIA, roles y textos alternativos donde falten.
   - [ ] Testea accesibilidad con Lighthouse y herramientas de a11y.

5. **Servicios, mocks y tipos**
   - [ ] Divide servicios (`apiService.ts`) y mocks en archivos por dominio si crecen.
   - [ ] Separa tipos en archivos por dominio si es necesario.
   - [ ] Añade tests unitarios para lógica crítica (auth, eventos, contextos).

6. **QA y documentación**
   - [ ] Haz pruebas manuales y en dispositivos/emuladores.
   - [ ] Documenta el sistema de diseño y ejemplos de uso de componentes base.
   - [ ] Actualiza el README si hay cambios relevantes en la arquitectura.

7. **Iteración y mejora continua**
   - [ ] Refactoriza por módulos (Landing, Paneles, Eventos, etc.).
   - [ ] Repite pruebas de accesibilidad y responsive tras cada módulo.
   - [ ] Revisa y ajusta el checklist tras cada iteración.