---
titulo: "Serial USB OTG desde Android — SerialMCU y lo que aprendí"
autor: obviousfancy
fecha: 2026-04-20
descripcion: "Android puede hablar serial con tu MCU por USB OTG. Sin computadora de por medio. Aquí está cómo funciona y por qué no es tan simple como parece."
tecnologias: [Kotlin, Android, USB, Serial, STM32, ESP32]
hashtags: "#Android #USB #Serial #OTG #STM32 #ESP32 #SerialMCU"
estado: Completado
orden: 3
proyecto: serialmcu
---

## USB OTG — qué es y por qué importa

USB OTG (On-The-Go) permite que un dispositivo Android actúe como host USB — es decir, que el teléfono sea el que controla el bus, no la computadora.

Con un cable OTG + adaptador USB-A, puedes conectar tu STM32 o ESP32 directo al teléfono y hablar serial sin laptop de por medio.

```
STM32 → USB-A → Adaptador OTG → USB-C → Android
                                          ↑
                                    SerialMCU aquí
```

## El problema que nadie te dice

Android no tiene un driver genérico de CDC serial como Linux o Windows. Para que funcione necesitas una librería que implemente el protocolo USB CDC en espacio de usuario.

La más usada: `usb-serial-for-android`. Maneja CH340, CP210x, FTDI, y el CDC nativo de STM32.

```kotlin
// Detectar dispositivo conectado
val manager = getSystemService(USB_SERVICE) as UsbManager
val deviceList = manager.deviceList

// Pedir permiso al usuario
manager.requestPermission(device, pendingIntent)
```

Android requiere permiso explícito del usuario para acceder a dispositivos USB. Eso significa un diálogo la primera vez — no hay vuelta atrás.

## Lo que hace SerialMCU

- Detecta automáticamente el dispositivo conectado
- Configura baud rate, bits de datos, paridad y stop bits
- Terminal serial con scroll y timestamp
- Envío de comandos con historial
- Log a archivo para análisis posterior

## El bug más raro que encontré

Al desconectar y reconectar el cable rápido, el descriptor USB del dispositivo a veces no se limpiaba correctamente y la app crash silencioso.

La solución fue registrar un `BroadcastReceiver` para el evento `ACTION_USB_DEVICE_DETACHED` y limpiar explícitamente la conexión:

```kotlin
val detachedFilter = IntentFilter(UsbManager.ACTION_USB_DEVICE_DETACHED)
registerReceiver(usbDetachedReceiver, detachedFilter)
```

Simple, pero tomó tres horas encontrarlo.

## Diferencias entre ESP32 y STM32

| MCU | Driver | Notas |
|-----|--------|-------|
| ESP32 | CP210x o CH340 | Depende del módulo |
| STM32 | CDC nativo | Necesita configurar USB en CubeIDE |
| Arduino Uno | CH340 o FTDI | El más fácil |

El STM32 con CDC nativo es el más limpio — no necesita chip convertidor externo, el USB lo maneja el propio micro.

## Lo que aprendí

El desarrollo Android desde C++ embebido requiere cambiar el chip mental. En embebido controlas cada byte. En Android el sistema operativo puede matar tu proceso en cualquier momento, el usuario puede rotar la pantalla y destruir tu Activity, y la conexión USB puede perderse sin aviso.

El manejo de estados es completamente diferente. Pero una vez que lo entiendes, es poderoso.
