---
titulo: "Clase 02 — El sistema de clases de Tailwind"
descripcion: "Cómo funciona Tailwind, su sistema de escala numérica y las categorías principales de clases."
tecnologias: [Tailwind, CSS]
hashtags: "#Tailwind #CSS #WebDev"
estado: Completado
orden: 2
---

## ¿Qué es Tailwind?

Bootstrap te da componentes preconstruidos — todos los sitios se ven igual y personalizarlo es pelear contra sus estilos.

Tailwind te da **clases pequeñas y específicas** que describes directamente en tu HTML:

```html
<!-- Bootstrap -->
<button class="btn btn-primary btn-lg">Click</button>

<!-- Tailwind -->
<button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
  Click
</button>
```

Con Tailwind tú controlas todo — por eso los diseños quedan únicos.

## Anatomía de una clase

```
[propiedad]-[valor]

bg-blue-500    → background, blue, intensidad 500
text-2xl       → tamaño de texto, extra large 2
p-4            → padding, 4 unidades (16px)
mt-8           → margin-top, 8 unidades (32px)
```

## La escala numérica — regla de los 4px

En Tailwind **1 unidad = 4px**:

| Clase | Píxeles |
|-------|---------|
| `p-1` | 4px |
| `p-2` | 8px |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |
| `p-16` | 64px |

## Colores

Los colores siguen el patrón `[prefijo]-[color]-[intensidad]`:

| Prefijo | Aplica a |
|---------|----------|
| `bg-`   | Background |
| `text-` | Color de texto |
| `border-` | Color de borde |

Intensidades van del 50 al 950. Colores especiales `black` y `white` no llevan intensidad:

```html
<div class="bg-black text-white">       <!-- negro y blanco -->
<div class="bg-blue-500 text-gray-300"> <!-- con intensidad -->
```

## Clases esenciales

### Texto
```html
<h1 class="text-4xl font-bold text-center">Título</h1>
<p class="text-sm text-gray-400 italic">Secundario</p>
```

### Espaciado
```html
<!-- Padding -->
<div class="p-4">         <!-- todos los lados -->
<div class="px-6 py-2">   <!-- horizontal y vertical -->
<div class="mt-8 mb-4">   <!-- top y bottom por separado -->

<!-- Margin para centrar -->
<div class="mx-auto">     <!-- centra horizontalmente -->
```

### Tamaño
```html
<div class="w-full h-screen">      <!-- ancho total, alto de pantalla -->
<div class="max-w-4xl mx-auto">    <!-- ancho máximo centrado -->
```

### Bordes
```html
<div class="rounded-lg border border-gray-700">
<div class="rounded-full">   <!-- círculo -->
```

## Lo aprendido

- Tailwind escribe CSS directamente en el HTML — no hay que ir al archivo CSS
- Cada clase hace una sola cosa — se combinan para construir cualquier diseño
- La escala 1 unidad = 4px es consistente en todo el sistema
- `black` y `white` son especiales — no llevan intensidad
