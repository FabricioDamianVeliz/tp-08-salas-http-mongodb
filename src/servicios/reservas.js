const mongoose = require("mongoose");
const Reserva = require("../modelos/reserva.js");

function mapearDocumento(doc) {
  return {
    id: doc._id.toString(),
    estudiante: doc.estudiante,
    email: doc.email,
    sala: doc.sala,
    fecha: doc.fecha,
    turno: doc.turno,
    personas: doc.personas,
    estado: doc.estado,
  };
}

function crearServicioReservas() {
  return {
    obtenerTodas: async (filtroSala) => {
      const criterio = {};
      if (filtroSala !== undefined) {
        criterio.sala = String(filtroSala);
      }
      const docs = await Reserva.find(criterio);
      return docs.map(mapearDocumento);
    },

    obtenerPorId: async (id) => {
      if (!mongoose.isValidObjectId(id)) {
        const error = new Error("ID de reserva mal formado");
        error.tipo = "ID_INVALIDO";
        throw error;
      }
      const doc = await Reserva.findById(id);
      if (!doc) {
        return null;
      }
      return mapearDocumento(doc);
    },

    contar: async () => {
      return await Reserva.countDocuments();
    },

    crear: async (datos) => {
      // Copiamos explícitamente solo los 6 campos admitidos (ignora estado o _id del cliente)
      const camposPermitidos = {
        estudiante: datos.estudiante,
        email: datos.email,
        sala: datos.sala,
        fecha: datos.fecha,
        turno: datos.turno,
        personas: datos.personas,
      };
      const nueva = new Reserva(camposPermitidos);
      const guardada = await nueva.save();
      return mapearDocumento(guardada);
    },
  };
}

module.exports = { crearServicioReservas };
