# Portafolio Web — Jeshua Useche

Sitio web estático de presentación profesional y portafolio personal para **Jeshua Useche**, Desarrollador Junior Fullstack y estudiante de 4° Año Medio. 

El proyecto está diseñado bajo los principios de **Liquid Glass (Apple Design)**: materiales translúcidos con desenfoque de fondo (`backdrop-filter`), interacción física basada en curvas de resorte (`spring animations`), microinteracciones fluidas, accesibilidad estricta y una paleta cromática minimalista sin gradientes.

- **URL de despliegue en GitHub Pages:** [https://m00nskluch.github.io/Mi-portafolio/](https://m00nskluch.github.io/Mi-portafolio/)

---

## Características Principales

- **Arquitectura 100% Estática:** Sin pasos de compilación ni empaquetadores (`no-build-step`), optimizado para entrega ultra rápida en GitHub Pages.
- **Estética Liquid Glass:** Contenedores con clase `.glass`, material translúcido y fallback sólido para navegadores antiguos.
- **Paleta de Color Restringida:** Diseñado exclusivamente con tokens cromáticos predefinidos (`--bone`, `--bone-soft`, `--pastel`, `--pastel-deep`, `--ink`, `--ink-soft`), sin gradientes.
- **Navegación Inteligente:** Barra superior fija compactable al hacer scroll, menú desplegable para móviles y detector de sección activa (`IntersectionObserver`) con subrayado animado mediante `scaleX`.
- **Microinteracciones y Animaciones Fluidas:** Revelación escalonada (`staggered reveal`), animaciones de progreso con curvas físicas y flotación suave de formas de fondo.
- **Accesibilidad y Rendimiento:** Marcado semántico HTML5, contraste óptimo verificado (WCAG AA/AAA), soporte exhaustivo para `prefers-reduced-motion: reduce`, atributos ARIA y favicon SVG vectorial en línea.

---

## Tecnologías

- **HTML5:** Estructura semántica completa (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- **CSS3:** Variables CSS en `:root`, diseño de materiales translúcidos, transiciones de resorte (`cubic-bezier`) y media queries.
- **JavaScript (Vanilla):** Lógica sin dependencias pesadas: IntersectionObserver para scroll spy y reveal, menú hamburguesa y validación de formulario con toast feedback.
- **Tailwind CSS (CDN):** Utilidades de layout y espaciado con extensión de tema personalizada y restringida a la paleta de tokens.
- **Lucide Icons (CDN):** Iconografía outline minimalista y coherente con el estilo de Apple.
- **Git & GitHub:** Control de versiones incremental y hosting estático continuo a través de GitHub Pages.

---

## Estructura del Proyecto

```text
Mi portafolio/
├── capturas/
│   └── .gitkeep              # Directorio reservado para capturas de pantalla del proyecto
├── css/
│   └── style.css             # Variables CSS, clases Liquid Glass, animaciones y accesibilidad
├── js/
│   └── script.js             # Lógica interactiva, observer de navegación, reveal y formulario
├── index.html                # Documento HTML5 con todas las secciones integradas
└── README.md                 # Documentación técnica del portafolio
```

---

## Cómo Verlo Localmente

Al ser un proyecto estático sin etapa de construcción (`build step`), puedes visualizarlo y probarlo inmediatamente mediante cualquiera de estos métodos:

### Opción 1: Abrir directamente en el navegador
Haz doble clic sobre el archivo `index.html` o arrástralo a cualquier navegador web moderno (Safari, Chrome, Edge, Firefox).

### Opción 2: Usar un servidor HTTP local (Recomendado)

Si cuentas con Node.js o Python en tu entorno:

```bash
# Con Node.js (npx serve)
npx --yes serve .

# O con Python 3
python -m http.server 3000
```

Luego abre en tu navegador `http://localhost:3000`.

### Opción 3: Extensión Live Server de VS Code / Antigravity
Haz clic derecho en `index.html` y selecciona **"Open with Live Server"**.

---

## Uso de Inteligencia Artificial

Este portafolio fue desarrollado en colaboración técnica con el asistente de código **Google Antigravity**, empleando la skill especializada **`apple-design`** como referencia de estilo:

1. **Adherencia a Principios de Diseño:** Se tradujeron las directrices de diseño de fluid interfaces de Apple (WWDC) a la web: respuesta directa sin latencia, físicas de movimiento con `cubic-bezier(.16, 1, .3, 1)`, estados activos `scale(0.97)` y respeto estricto a las preferencias de reducción de movimiento.
2. **Desarrollo Incremental:** La construcción del proyecto se realizó sección por sección (esqueleto semántico inicial, barra de navegación + hero, trayectoria y habilidades, proyectos destacados, timeline de estudios y formulario interactivo con toast), permitiendo un historial de cambios limpio y auditable.
3. **Auditoría de Accesibilidad:** Se implementaron roles ARIA, textos descriptivos contextuales en botones/enlaces e inputs de formulario enlazados con etiquetas semánticas explícitas.
