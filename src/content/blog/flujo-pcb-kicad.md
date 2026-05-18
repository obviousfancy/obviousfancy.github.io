---
titulo: "Mi flujo de diseño PCB en KiCad 10 — de esquemático a Gerber"
autor: obviousfancy
fecha: 2026-04-05
descripcion: "No hay una forma correcta de diseñar PCBs. Hay formas que te hacen perder menos placas. Esta es la mía después de varios horno de reflow y un par de cortocircuitos."
tecnologias: [KiCad, PCB, Hardware, Electronica]
hashtags: "#KiCad #PCB #Hardware #Electronica #EmbeddedSystems"
estado: Completado
orden: 4
---

## Por qué KiCad y no Altium

Altium es la industria. Si trabajas en una empresa de hardware mediana para arriba, vas a usar Altium. Pero KiCad 10 cerró la brecha a un punto donde para proyectos personales y universitarios no tiene sentido pagar licencia.

Lo que KiCad 10 tiene que Altium no: es gratis, el formato de archivo es texto plano (git-friendly), y la comunidad de symbols y footprints es enorme.

## Mi flujo completo

```
1. Definir la función del circuito
2. Buscar datasheets y seleccionar componentes
3. Esquemático en KiCad
4. Asignar footprints
5. Layout del PCB
6. Design Rule Check (DRC)
7. Generar Gerbers
8. Ordenar en JLCPCB o PCBWay
```

Parece lineal. No lo es. Entre el paso 5 y el 6 hay varios ciclos de "esto no cabe" y "este componente no existe en SMD".

## El esquemático primero — siempre

El error más común que veo: empezar por el layout. El esquemático es el diseño. El layout es solo cómo lo organizas físicamente.

Si el esquemático está bien, el layout es trabajo mecánico. Si el esquemático está mal, ningún layout te salva.

## Reglas que sigo en el layout

**Desacoplamiento primero** — los capacitores de desacoplamiento van lo más cerca posible del pin VCC del IC. No a 2cm de distancia porque "se ve más ordenado".

```
❌ VCC ──────────── IC.VCC
             |
            C1 (lejos)

✅ VCC ── C1 ── IC.VCC
               (C1 pegado al pin)
```

**Plano de tierra** — siempre uso plano de tierra en la capa inferior de un PCB de 2 capas. Reduce inductancia, simplifica el ruteo, y hace el DRC más fácil.

**Traza de potencia primero** — ruteo VCC y GND antes que las señales. Las señales se adaptan, la potencia no.

## Lo que aprendí con SmartLight

El primer prototipo de SmartLight tenía los MOSFETs demasiado lejos de los conectores de la tira LED. Las trazas de potencia tenían 8cm de largo y 0.5mm de ancho.

```
Resistencia de traza = ρ × L / A
= 1.72×10⁻⁸ × 0.08 / (0.5×10⁻³ × 0.035×10⁻³)
= 78.6 mΩ por traza

A 1A → caída de voltaje = 78.6mV
```

No catastrófico, pero visible en el brillo de la tira. En la versión 2 las trazas de potencia miden 2cm y tienen 2mm de ancho.

## DRC antes de los Gerbers — obligatorio

El DRC de KiCad te dice si hay pads sin conectar, trazas demasiado juntas, o vías mal configuradas. Un error en los Gerbers significa una placa mala y 2 semanas de espera.

Reglas mínimas para JLCPCB:
- Ancho mínimo de traza: 0.127mm (uso 0.2mm mínimo)
- Separación mínima: 0.127mm
- Tamaño mínimo de vía: 0.6mm diámetro, 0.3mm drill

## Dónde ordeno

JLCPCB para prototipos — 5 placas de 10×10cm por menos de $5 USD con envío. El tiempo es 7-15 días a México dependiendo del método de envío.

Para tiradas más grandes o placas con impedancia controlada: PCBWay.
