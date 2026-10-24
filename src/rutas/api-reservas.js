const express = require("express");
const { validarReservaAPI } = require("../middleware/reservas.js");

function crearRutasApiReservas(controlador) {
  const router = express.Router();

  router.get("/reservas", controlador.listarReservasAPI);
  router.get("/reservas/:id", controlador.obtenerReservaPorIdAPI);
  router.post("/reservas", validarReservaAPI, controlador.crearReservaAPI);

  return router;
}

module.exports = { crearRutasApiReservas };
