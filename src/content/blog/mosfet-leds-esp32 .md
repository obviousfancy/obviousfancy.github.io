---
titulo: "Por qué uso MOSFETs en lugar de resistencias para controlar LEDs"
autor: obviousfancy
fecha: 2026-05-10
descripcion: "La mayoría mete una resistencia y ya. Yo no. Aquí explico por qué el MOSFET es la decisión correcta cuando tu LED tiene que durar."
tecnologias: [ESP32, KiCad, Electronica, Hardware]
hashtags: "#MOSFET #LED #Hardware #ESP32 #Electronica"
estado: Completado
orden: 1
proyecto: smartlight
---

## El problema con la resistencia

Cuando alguien aprende a conectar un LED, lo primero que hace es meter una resistencia en serie. Funciona. El LED enciende. Misión cumplida.

El problema aparece cuando el LED necesita más de 20mA, cuando tienes 30 LEDs en paralelo, o cuando quieres hacer PWM a alta frecuencia. La resistencia no es el camino.

## ¿Qué hace el MOSFET aquí?

Un MOSFET de canal N actúa como un interruptor controlado por voltaje. El ESP32 manda 3.3V al gate, el MOSFET abre el canal, la corriente fluye del drain al source. El LED enciende.

La diferencia crítica: el ESP32 no maneja la corriente del LED — solo controla el gate. La corriente pesada viene directo de la fuente de alimentación. perce

```
ESP32 GPIO → Gate (MOSFET) → LED → GND
                ↑
         solo señal de control
         
VCC → LED → Drain → Source → GND
      ↑
  corriente real aquí
```

## Por qué importa en SmartLight

SmartLight tiene dos tipos de carga:

- **WS2812B** — se controlan solos, no necesitan MOSFET
- **Tira CCT** — canal frío + canal cálido, cada uno puede sacar 1-2A

Para la tira CCT uso dos IRF540N. Son baratos, aguantan 33A, y con el ESP32 haciendo PWM a 1kHz el dimming es perfectamente suave sin parpadeo visible.

## El cálculo rápido

```
Tira LED 12V CCT, 1 metro, 14W/m
Corriente = 14W / 12V = 1.16A por canal

IRF540N: Vds = 100V, Id = 33A, Rds(on) = 44mΩ
Pérdida en conducción = I² × Rds = 1.16² × 0.044 = 59mW
```

59mW de disipación. Sin disipador. Sin problema.

## Lo que aprendí haciéndolo mal primero

En el primer prototipo usé un transistor BJT NPN (2N2222). Funciona, pero necesita corriente de base, y el ESP32 apenas puede darlo. El MOSFET solo necesita voltaje — perfecto para microcontroladores con salidas débiles.

## Próximos pasos en SmartLight

El diseño del PCB ya incluye los dos MOSFETs con sus resistencias de gate (100Ω para limitar corriente de carga) y resistencias de pull-down (10kΩ para asegurar que el gate esté en LOW al arrancar).

El esquemático está en el repo.
