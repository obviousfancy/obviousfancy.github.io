---
titulo: "Clase 01 — Setup y estructura de Astro"
descripcion: "Cómo crear un proyecto desde cero con Astro y Tailwind, y entender la estructura de carpetas."
tecnologias: [Astro, Tailwind, Node.js]
hashtags: "#Astro #Tailwind #WebDev #Portfolio"
estado: Completado
orden: 1
---

## ¿Qué es Astro?

Cuando tienes un portfolio con 20 páginas — CV, proyectos, blog, wiki — y usas HTML puro, tienes que copiar el navbar en cada archivo. Si cambias una letra, editas 20 archivos.

**Astro es un framework** que resuelve eso. Te permite:

- Escribir componentes reutilizables (el navbar se escribe una vez)
- Usar Markdown para blog y wiki sin HTML manual
- Generar HTML estático listo para GitHub Pages

Astro no reemplaza HTML/CSS/JS — los genera automáticamente desde archivos más cómodos de escribir. Es como KiCad respecto a dibujar esquemáticos a mano.

## Las tres capas del desarrollo web

Esto nunca cambia sin importar la herramienta que uses:

```
HTML  →  La estructura    (los ladrillos)
CSS   →  El estilo        (la pintura)
JS    →  El comportamiento (los motores)
```

Tailwind es CSS escrito de forma diferente. Astro organiza cómo se genera todo. El navegador al final siempre recibe HTML + CSS + JS.

## Prerrequisitos

```bash
node --version   # debe ser v18 o superior
npm --version
```

## Crear el proyecto

```bash
npm create astro@latest mi-portfolio
cd mi-portfolio
npx astro add tailwind
npm run dev      # http://localhost:4321
```

Durante la instalación elegir:
- Template: **A basic, minimal starter**
- TypeScript: **No** (por ahora)
- Install dependencies: **Yes**

## Estructura de carpetas

```
mi-portfolio/
├── src/
│   ├── pages/          ← cada .astro aquí = una URL
│   ├── components/     ← piezas reutilizables
│   ├── layouts/        ← plantillas globales
│   ├── content/        ← Markdown del blog/wiki
│   └── styles/
│       └── global.css  ← CSS global con Tailwind
├── public/             ← imágenes, PDFs, favicon
└── astro.config.mjs    ← configuración
```

## Importar Tailwind en el Layout

Después de instalar Tailwind, hay que importar el CSS en el Layout principal:

```astro
---
import '../styles/global.css'
---
```

Sin este import, las clases de Tailwind no funcionan.

## Lo aprendido

- Astro genera HTML estático — perfecto para GitHub Pages
- `npm run dev` levanta el servidor en `localhost:4321`
- `npm run build` genera la carpeta `/dist` lista para producción
- La estructura de carpetas define cómo se organiza el sitio
