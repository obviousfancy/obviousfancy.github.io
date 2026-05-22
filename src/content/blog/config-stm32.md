---
titulo: "Configuración de un nuevo proyecto STM32"
autor: obviousfancy
fecha: 2026-05-22
descripcion: "Configuracion de un nuevo proyecto de STM32 con STM32CubeIDE y Bluepill"
tecnologias: [STM32, C, Debug]
hashtags: "#STM32 #Debug #MCU "
estado: En desarrollo
orden: 1
---

# Configuracion nuevo proyecto STM32

## 📌 Requisitos del Sistema

| Componente | Versión mínima | Versión recomendada | Notas |
| --- | --- | --- | --- |
| STM32CubeIDE | LastVersion | — | — |
| Bluepill | STM32F103C8T6 | STM32F103C8T6 | — |
| MultiProtocol CH552 | UNIT DevLab Multiprotocol CH552 | — | — |

> [!WARNING]
> Esta guia fue creada en ubuntu 26.04, en windows , podria requerir configuraciones adicionales

## 📌 Dependencias Previas

- STM32CubeIDE - www.st.com/en/development-tools/stm32cubeide.html
- STM32CubeMX - www.st.com/en/development-tools/stm32cubemx.html

## 📌 Codigo de instalacion

<details>
<summary>BASH</summary>

```
section "STM32CubeIDE"
    log "Buscando instalador de STM32CubeIDE..."

    # CubeIDE — zip que contiene el .sh
    INSTALLER=$(wait_for_file ~/Downloads "st-stm32cubeide_*.zip" "STM32CubeIDE")
    EXTRACTED=$(extract "$INSTALLER" "stm32cubeide")
    SH_INSTALLER=$(find "$EXTRACTED" -name "st-stm32cubeide_*.sh" | head -1)
    chmod +x "$SH_INSTALLER"
    echo "y" | sudo "$SH_INSTALLER"
    rm -rf "$EXTRACTED"

    if [ -d "/opt/st" ]; then
        success "STM32CubeIDE instalado en /opt/stm32cubeide"
    else
        error "No se encontró la instalación después de ejecutar el instalador"
        return 1
    fi

    # CubeMX — opcional
    read -rp "  ¿También instalar STM32CubeMX? [s/N]: " confirm
    if [[ "$confirm" =~ ^[sS]$ ]]; then
        INSTALLERMX=$(wait_for_file ~/Downloads "stm32cubemx-*.zip" "STM32CubeMX")
        EXTRACTED_MX=$(extract "$INSTALLERMX" "stm32cubemx")
        MX_INSTALLER=$(find "$EXTRACTED_MX" -name "SetupSTM32CubeMX*" -type f | head -1)
        chmod +x "$MX_INSTALLER"
        sudo "$MX_INSTALLER"
        rm -rf "$EXTRACTED_MX"

        # Crear .desktop para STM32CubeMX solo si no existe ya
CUBEMX_DESKTOP="/usr/share/applications/STM32CubeMX.desktop"
LOCAL_CUBEMX_DESKTOP="$HOME/.local/share/applications/STM32CubeMX.desktop"

if [ ! -f "$CUBEMX_DESKTOP" ] && [ ! -f "$LOCAL_CUBEMX_DESKTOP" ]; then
    log "Creando .desktop para STM32CubeMX..."
    mkdir -p ~/.local/share/applications
    cat > "$LOCAL_CUBEMX_DESKTOP" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=STM32CubeMX
Comment=STM32 Microcontroller Configuration Tool
Exec=/usr/local/STMicroelectronics/STM32Cube/STM32CubeMX/STM32CubeMX
Icon=/usr/local/STMicroelectronics/STM32Cube/STM32CubeMX/help/STM32CubeMX.png
Terminal=false
Categories=Development;Electronics;
StartupNotify=true
EOF
    chmod +x "$LOCAL_CUBEMX_DESKTOP"
    update-desktop-database ~/.local/share/applications
    success "STM32CubeMX .desktop creado"
else
    success "STM32CubeMX .desktop ya existe"
fi

# Symlink para terminal — solo si no existe
if [ ! -f /usr/local/bin/stm32cubemx ]; then
    sudo ln -sf /usr/local/STMicroelectronics/STM32Cube/STM32CubeMX/STM32CubeMX \
        /usr/local/bin/stm32cubemx
fi
        success "STM32CubeMX instalado"
    fi

    # Reglas udev para ST-Link sin sudo
   UDEV_RULES=$(find /opt/st -name "*.rules" 2>/dev/null | head -1)
    if [ -n "$UDEV_RULES" ]; then
        sudo cp "$UDEV_RULES" /etc/udev/rules.d/
        sudo udevadm control --reload-rules
        sudo usermod -aG plugdev "$USER"
    fi

    # Registrar .desktop sin necesidad de cerrar sesión
    update-desktop-database ~/.local/share/applications
    gtk-update-icon-cache -f -t ~/.local/share/icons 2>/dev/null || true
    # En GNOME — recargar el shell para que aparezca en el launcher
    if command -v gdbus &>/dev/null; then
        gdbus call --session \
            --dest org.gnome.Shell \
            --object-path /org/gnome/Shell \    
            --method org.gnome.Shell.Eval \
            "Main.overview.hide();" 2>/dev/null || true
    fi
    success "STM32CubeIDE instalado correctamente"
```

</details>

## 📌 Instalación Paso a Paso

- Descargar  STM32CubeIDE y STM32CubeMx
- Descomprimir ambos archivos y ejecutar ambos .sh de manera individual

## 📌 Configuración del IDE / Editor

**IDE o editor:** STM32CubeIDE  

Este tutorial es para poder realizar la configuracion de un proyecto STM32 con el configurador de proyecto de STM32CubeMX

1. Como paso inicial abrimos STM32CubeMX

---

2. Dentro de la interfaz veremos 3 opciones las cuales son:
     - Access to MCU Selector: Esta opcion sera en dado caso de que no tengamos una tarjeta de desarrollo propia de STM32
    - Access to Board Selector:  Esta opcion es para cuando tengamos una tarjeta de desarrollo propia de STM32
   - Access to Example Selector: Esta opcion es para ejemplos especificos incluidos especificamente para las tarjetas de desarrollo STM32

<div align="center">

<img src="/src/assets/blog/stm32cfg/options.png" alt="imagen" width="500">

*Opciones de configuracion STM32*

</div>

---

3. En este caso al usar una Bluepill, la cual no es una tarjeta de desarrollo propia de STM32, necesitaremos seleccionar la opcion 1 que es Acces to MCU Selector, y dentro buscaremos el numero de parte STM32F103C8T6
4. Seleccionaremos y daremos clic en start project

<div align="center">

<img src="/src/assets/blog/stm32cfg/mcuselect.png" alt="imagen" width="500">

*STM32F103C8T6*

</div>

---

5. Nos abrira una nueva ventana en la cual aparecen todos los pines del microcontrolador, directamente sobre los cuales podremos activar las funcionalidades de cada pin individual

<div align="center">

<img src="/src/assets/blog/stm32cfg/bluepillcfg.png" alt="imagen" width="500">

*Pantalla de configuracion*

</div>

---

6. Para el caso especifico de esta placa tenemos un led en el PC13, por lo cual buscaremos el pin PC13 dentro de la imagen de el microcontrolador que tenemos del lado derecho , y lo colocaremos como GPIO_Output

<div align="center">

<img src="/src/assets/blog/stm32cfg/pc13.png" alt="imagen" width="500">

*Pin PC13 como GPIO Output*

</div>

7. Configuraremos los relojes, para ello iremos a el apartado izquierdo y daremos clic en la pestanita que dice:
 - System Core -> RCC -> HSE/LSE
8. En estas dos opciones seleccionaremos en ambas Crystal/Ceramic Resonator

<div align="center">

<img src="/src/assets/blog/stm32cfg/hselse.png" alt="imagen" width="500">

*Relojes*

</div>

9. Posterior, iremos a la pestana **Clock Configuration**, que se encuentra en la parte superior, en la cual buscaremos, el bloque Input Frequency  de HSE y de LSE que podremos encontrar en la parte izquierda de todo el diagrama, en los cuales configuraremos respectivamente los relojes de acuerdo a los que tengamos en nuestro microcontrolador. 
En este caso y en la mayoria de bluepills contamos con un oscilador de baja frecuencia de 32.768 Khz que seria nuestro LSE, y un oscilador de alta frecuencia que seria nuestro HSE siendo este de 8 MHz segun el esquematico que podemos ver en la imagen, estos valores, verificamos que tengan su correspondiente en el mapa de relojes y procedemos.

<div align="center">

<img src="/src/assets/blog/stm32cfg/hselsesch.png" alt="imagen" width="500">

*Cristales incluidos*

</div>