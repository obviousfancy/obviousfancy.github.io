---
titulo: "Debugging de MCUs desde Android — por qué construí HexConverter"
autor: obviousfancy
fecha: 2026-05-03
descripcion: "Cuando estás en el taller con el osciloscopio en una mano y el celular en la otra, no tienes tiempo de abrir la laptop. Así nació HexConverter."
tecnologias: [Kotlin, Android, STM32, Debug]
hashtags: "#Android #Kotlin #STM32 #Debug #MCU #HexConverter"
estado: Completado
orden: 2
proyecto: hexconverter
---

## El problema real

Imagina que estás midiendo una señal SPI. El analizador lógico te muestra bytes en hex: `0x4A 0x32 0xFF 0x01`. Quieres saber qué significa ese `0x4A` en decimal, en binario, y si corresponde a algún registro de tu MCU.

La solución habitual: abrir el IDE en la laptop, usar la consola, o buscar una calculadora hex online. Todo lento. Todo fuera de contexto.

## La solución obvia que nadie hace

Un teléfono Android siempre está en el taller. Tiene pantalla grande, corre Kotlin, y puede abrir una app en un segundo.

HexConverter nació de esa necesidad: conversión instantánea entre hex, decimal, binario y ASCII. Sin internet, sin laptop, sin distracciones.

## Lo que hace la app

```
Input:  0x4A
Output: 
  decimal  → 74
  binario  → 0100 1010
  ASCII    → 'J'
  
Input:  01001010 (binario)
Output:
  hex      → 0x4A
  decimal  → 74
  ASCII    → 'J'
```

La conversión es bidireccional — puedes empezar desde cualquier formato.

## Por qué Kotlin y no una web app

Consideré hacer una PWA. El problema: sin conexión en el taller (mi laboratorio no tiene WiFi en el banco de trabajo), y una app nativa responde en milisegundos.

Kotlin es el lenguaje correcto para Android hoy. La curva de aprendizaje desde C++ embebido es real — el manejo de memoria es completamente diferente — pero el sistema de tipos es más estricto que Java y eso se agradece.

## Lo más difícil

El input de formato libre. El usuario puede escribir `4A`, `0x4A`, `0X4A`, o `4a` — todos válidos. El parser tiene que manejar todos los casos sin romper.

```kotlin
fun parseHex(input: String): Int {
    val clean = input
        .trim()
        .removePrefix("0x")
        .removePrefix("0X")
        .lowercase()
    return clean.toInt(16)
}
```

Simple en retrospectiva. No tan simple a las 2am con el MCU quemado sobre el banco.

## Estado actual

La app funciona para el caso de uso básico. Lo que viene:

- Tabla de registros por MCU (STM32F4, ESP32)
- Historial de conversiones
- Modo oscuro (sí, también en la app)
- Lookup de opcodes ARM Thumb
