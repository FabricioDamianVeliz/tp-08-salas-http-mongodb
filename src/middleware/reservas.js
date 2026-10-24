const SALAS_VALIDAS = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const TURNOS_VALIDOS = ["Mañana", "Tarde", "Noche"];

function extraerYValidarDatos(body) {
  const errores = [];

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).length === 0
  ) {
    return {
      errores: [
        "El cuerpo de la solicitud es obligatorio y debe ser un objeto válido.",
      ],
      datosLimpios: {},
    };
  }

  const estudiante =
    typeof body.estudiante === "string" ? body.estudiante.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const sala = typeof body.sala === "string" ? body.sala.trim() : "";
  const fecha = typeof body.fecha === "string" ? body.fecha.trim() : "";
  const turno = typeof body.turno === "string" ? body.turno.trim() : "";

  const personasRaw = body.personas;
  let personas = NaN;
  if (typeof personasRaw === "number") {
    personas = personasRaw;
  } else if (typeof personasRaw === "string" && personasRaw.trim() !== "") {
    personas = Number(personasRaw.trim());
  }

  if (!estudiante) {
    errores.push("El nombre del estudiante es obligatorio.");
  }
  if (!email || !email.includes("@")) {
    errores.push('El email es obligatorio y debe contener "@".');
  }
  if (!SALAS_VALIDAS.includes(sala)) {
    errores.push("La sala seleccionada no es válida.");
  }
  if (!fecha) {
    errores.push("La fecha es obligatoria.");
  }
  if (!TURNOS_VALIDOS.includes(turno)) {
    errores.push("El turno seleccionado no es válido.");
  }
  if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    errores.push(
      "La cantidad de personas debe ser un número entero entre 1 y 6.",
    );
  }

  return {
    errores,
    datosLimpios: {
      estudiante,
      email,
      sala,
      fecha,
      turno,
      personas,
    },
  };
}

function validarReservaHTML(req, res, next) {
  const { errores, datosLimpios } = extraerYValidarDatos(req.body);

  if (errores.length > 0) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Reservas de Salas",
      seccion: "Nueva reserva",
      error: errores.join(" "),
      errores,
      valores: req.body || {},
    });
  }

  req.datosReserva = datosLimpios;
  next();
}

function validarReservaAPI(req, res, next) {
  const { errores, datosLimpios } = extraerYValidarDatos(req.body);

  if (errores.length > 0) {
    return res.status(400).json({
      error: "Datos de reserva inválidos",
      detalles: errores,
    });
  }

  req.datosReserva = datosLimpios;
  next();
}

module.exports = {
  validarReservaHTML,
  validarReservaAPI,
  validarReserva: validarReservaHTML,
};
