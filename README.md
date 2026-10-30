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

## 5. Guía de Postman y Endpoints

La API puede probarse utilizando la colección de Postman incluida, la cual cuenta con peticiones preparadas para listar, crear, filtrar y simular errores de validación.

### Endpoints Disponibles

- **GET `/api/reservas`**: Listado general. Admite filtrado (ej. `?sala=Sala Norte`).
- **GET `/api/reservas/:id`**: Consulta el detalle de una reserva por ID.
- **POST `/api/reservas`**: Crea una reserva y retorna el header `Location`.
- **GET `/estado`**: Retorna metadatos del servicio, cantidad de registros y `solicitudId`.

### Ejemplo de Payload JSON (POST)

```json
{
  "estudiante": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "sala": "Sala Norte",
  "fecha": "2026-11-20",
  "turno": "Mañana",
  "personas": 4
}
```

## 6. Límites de Validación y Arquitectura

- **Límites:** El sistema rechaza cuerpos vacíos y valida estrictamente que la cantidad de personas sea un número entero entre 1 y 6. El email debe contener un `@` y las salas/turnos deben coincidir exactamente con los valores permitidos (`enum`). Los campos adicionales enviados en el POST son ignorados para proteger la base de datos.
- **Imports retirados:** Se eliminó cualquier uso del módulo `fs` (File System) y de arreglos en memoria que se utilizaban en versiones anteriores. Toda la persistencia ahora recae exclusivamente en MongoDB.

## 7. Matriz de Pruebas: Ensayo de Persistencia

Para demostrar la persistencia en MongoDB y el correcto manejo de estado, se ejecutó el siguiente flujo de pruebas:

1. **Lectura inicial:** Se ejecutó `GET /api/reservas` arrojando un total de registros previos.
2. **Creación:** Se envió un `POST /api/reservas` con un payload válido. La API respondió con estado `201 Created`, incluyendo el header `Location` (ej: `/api/reservas/654a1...`) y el nuevo `id` textual en el cuerpo de la respuesta.
3. **Validación en caliente:** Se consultó ese mismo recurso mediante `GET /api/reservas/:id`, devolviendo estado `200` y confirmando la inserción.
4. **Reinicio del servidor:** Se detuvo el proceso de Node.js en la terminal (`Ctrl + C`) cortando la conexión a la base de datos, y se volvió a arrancar con `npm start`.
5. **Comprobación de persistencia:** **Sin repetir la petición POST**, se volvió a ejecutar el `GET` sobre el mismo ID generado en el paso 2. El recurso respondió correctamente con estado `200` y el endpoint `/estado` mantuvo el conteo actualizado, demostrando que los datos sobreviven al ciclo de vida de la aplicación.
