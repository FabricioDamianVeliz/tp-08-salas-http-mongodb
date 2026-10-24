# Trabajo Práctico 08 - Endpoints persistentes de reservas de salas

## 1. Origen del Proyecto y Comparación con el TP 07

- **Origen de la copia**: Este proyecto toma como punto de partida una copia funcional del Trabajo Práctico 07 (`tp-07-salas-mongodb`), renombrado según la convención a `tp-08-salas-http-mongodb`.
- **Comparación con el TP 07**: En el TP 07, las operaciones con la base de datos se limitaban a scripts independientes de consola, mientras que la aplicación web operaba de manera temporal sobre un arreglo en memoria. En este TP 08, se refactoriza el servicio completo para que sea asíncrono mediante Mongoose, conectando tanto el sitio HTML como la nueva API RESTful JSON (`/api/reservas`) a la misma base de datos real. Se eliminó la dependencia de datos semilla estáticos al arrancar el servidor persistente.

## 2. Entorno y Versiones

- **Base de datos**: MongoDB Atlas (Clúster Free M0), base de datos asignada: `reservas_salas_u8`, colección: `reservas`.
- **Dependencias principales**:
  - `express` (^4.19.2)
  - `mongoose` (^8.0.0)
  - `ejs` (^3.1.10)
  - `express-ejs-layouts` (^2.5.1)
  - `morgan` (^1.10.0)

## 3. Preparación de Atlas, Entorno y DNS

1. Clonar el repositorio y ejecutar `npm install` para instalar las dependencias manteniendo el lockfile.
2. Copiar el archivo `.env.example` y renombrarlo a `.env`. Configurar las variables `PORT`, `NODE_ENV` y `MONGODB_URI` apuntando a la base de datos `reservas_salas_u8`.
3. **Configuración DNS**: Se importó `node:dns` en `src/config/base-datos.js` configurando los resolutores públicos de Google y Cloudflare (`dns.setServers(["8.8.8.8", "1.1.1.1"])`) para evitar errores de resolución `ENOTFOUND` con los registros SRV de MongoDB Atlas.

## 4. Comando de Inicio

Para iniciar el servidor web y la API en modo de desarrollo con carga automática de variables de entorno:

```bash
npm start
```
