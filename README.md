# Escáner Pappi

**Pappi** es una herramienta de escaneo de internet en vivo que escanea dinámicamente dispositivos expuestos y los clasifica.

## Características

- **Escaneo dinámico de puertos**: Busca dispositivos expuestos con puertos definidos en un archivo de configuración y se actualiza en tiempo real al detectar cambios [configurable desde el frontend].

- **Clasificación de servicios**: Crea y gestiona automáticamente archivos de salida basados ​​en asignaciones de puertos y servicios (p. ej., `http.txt`, `ftp.txt`) y muestra el resultado clasificado en el frontend.

- **Cracking automatizado**: Crackea servicios como SSH y FTP automáticamente (personalizable).

- **Escaneo detallado de dispositivos**: escanea IP para obtener resultados detallados y enriquecidos.

- **Administración de archivos**: Borra los archivos de registro cuando superan las 500 líneas para evitar el desbordamiento.

## Requisitos previos

- **Sistema operativo**: Probado en Kali Linux (se requiere acceso root). - **Dependencias**:
- `masscan` (instalar con `sudo apt install masscan`).
- `geoiplookup`
- `dig`
- `whois`
- `curl`
- `nc`
- `THC-Hydra`
- `bash` (preinstalado en la mayoría de las distribuciones de Linux).
- `coreutils` (para `stat`, `grep`, etc.).

- Instalar todo a la vez: `sudo apt install masscan geoip-bin dnsutils whois curl hydra util-linux coreutils`

- **Permisos**: Ejecutar como root (`sudo`) para acceder a todas las funciones de escaneo de red.

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/whxitte/pappi.git
cd pappi
```

2. Instalar `masscan` si aún no está presente:

```bash
sudo apt update
sudo apt install masscan
```

3. Hacer que el script sea ejecutable:

```bash
chmod +x masscan_live.sh
```

## Configuración

- **Establecer entorno en vivo**:
- `export KALI_SCANNER=/root/pappi/Backend`

- **Estructura de directorios**:
- `/root/pappi/Backend`: Directorio base (adapte `KALI_SCANNER` en el script si es necesario).
- `/root/pappi/Backend/config/`: Contiene `ports.conf` y `masscan_exclude.conf`.
- `/root/pappi/Backend/logs/scanner/`: Almacena los archivos de salida (p. ej., `classified/http.txt`).
- **ports.conf**: Define los puertos y servicios que se escanearán. Formato: `port # service_name` (p. ej., `80 # http` o `8080 # http-extra`). Los comentarios empiezan con `#`.
- **masscan_exclude.conf**: Archivo opcional para excluir rangos de IP (formato según la documentación de `masscan`).

### Ejemplo `ports.conf`

```
80 # http
21 # ftp
8080 # http-extra
143 # imap
```

## Uso

1. Iniciar el escáner:

```bash
./masscan_live.sh
```

2. Modificar `ports.conf` para añadir o eliminar puertos (p. ej., añadir `443 # https`).

3. Revisar la consola para ver las actualizaciones en tiempo real y los archivos de salida en `/root/pappi/Backendlogs/scanner/classified/`.

### Archivos de salida

- `http.txt`, `ftp.txt`, etc.: Registra las IP con el formato `IP:PORT:TIMESTAMP` para cada servicio.
- `all.txt`: Agrega todos los resultados del escaneo.

### Controles

- **Interrupción**: Pulsa Ctrl+C para detener el script correctamente.
- **Detección de cambios**: Edita `ports.conf` o pulsa `config/.ports_changed` para reiniciar.

## Ejemplo de salida

```
[INFO] KALI_SCANNER: /root/pappi
======================================
[INFO] Iniciando escaneo de internet en vivo el martes 29 de abril de 2025 a las 10:19:08 a. m. EDT con los puertos: 80,21
[DEBUG] Ejecutando escaneo masivo con los puertos: 80,21
# Escaneo de Masscan 1.3.2 iniciado el martes 29 de abril de 2025 a las 14:19:08
Marca de tiempo: 1745936391 Host: 54.188.126.198 () Puertos: 80/open/tcp//http//
[DEBUG] Procesando IP: ip=54.188.126.198, puerto=80, timestamp=2025-04-29T14:19:52Z
=====================================
[CAMBIO] Cambio detectado en /root/pappi/Backend/config/ports.conf el martes 29 de abril de 2025 a las 10:19:48 a. m. EDT - Esperando para procesar...
=======================================
[INFO] Escaneo completado el martes 29 de abril de 2025 a las 10:19:51 a. m. EDT - Reiniciando...
```

## Solución de problemas

- **No hay IP registradas**: Asegúrese de que `masscan` tenga acceso a internet y que ningún firewall lo bloquee. Compruebe `ports.conf` para ver si hay puertos válidos.
- **Proceso Finalizado**: El mensaje `Killed` es normal cuando `masscan` finaliza al realizar cambios de configuración; ignórelo.
- **Permiso Denegado**: Ejecute con `sudo` o ajuste los permisos de archivo.
- **Bucle Infinito**: Si los escaneos se reinician demasiado rápido, aumente el retraso de `sleep 3` en el script.

## Agradecimientos

- Creado con cariño usando `masscan` y la magia de Bash.
- Inspirado por la necesidad de una herramienta de escaneo dinámica en tiempo real.