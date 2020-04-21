//  ███╗   ██╗ ██████╗ ████████╗    ███████╗ ██████╗ ██╗   ██╗███╗   ██╗██████╗
//  ████╗  ██║██╔═══██╗╚══██╔══╝    ██╔════╝██╔═══██╗██║   ██║████╗  ██║██╔══██╗
//  ██╔██╗ ██║██║   ██║   ██║       █████╗  ██║   ██║██║   ██║██╔██╗ ██║██║  ██║
//  ██║╚██╗██║██║   ██║   ██║       ██╔══╝  ██║   ██║██║   ██║██║╚██╗██║██║  ██║
//  ██║ ╚████║╚██████╔╝   ██║       ██║     ╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝
//  ╚═╝  ╚═══╝ ╚═════╝    ╚═╝       ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝
//
//  ██████╗ ███████╗███████╗██████╗  ██████╗ ███╗   ██╗███████╗███████╗
//  ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔════╝
//  ██████╔╝█████╗  ███████╗██████╔╝██║   ██║██╔██╗ ██║███████╗█████╗
//  ██╔══██╗██╔══╝  ╚════██║██╔═══╝ ██║   ██║██║╚██╗██║╚════██║██╔══╝
//  ██║  ██║███████╗███████║██║     ╚██████╔╝██║ ╚████║███████║███████╗
//  ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚══════╝
//

//  ┌─┐┬  ┬┌─┐┬─┐┬─┐┬┌┬┐┌─┐  ┌┬┐┌─┐  ┌─┐┌─┐┬┬  ┌─┐  ┌┬┐┌─┐┌─┐┌─┐┬ ┬┬ ┌┬┐
//  │ │└┐┌┘├┤ ├┬┘├┬┘│ ││├┤    ││├┤   └─┐├─┤││  └─┐   ││├┤ ├┤ ├─┤│ ││  │
//  └─┘ └┘ └─┘┴└─┴└─┴─┴┘└─┘  ─┴┘└─┘  └─┘┴ ┴┴┴─┘└─┘  ─┴┘└─┘└  ┴ ┴└─┘┴─┘┴
//  ┌┐┌┌─┐┌┬┐  ┌─┐┌─┐┬ ┬┌┐┌┌┬┐
//  ││││ │ │   ├┤ │ ││ ││││ ││
//  ┘└┘└─┘ ┴   └  └─┘└─┘┘└┘─┴┘
// TODO: Translate comments
module.exports = function notFound (optionalData) {
  // Get access to `req` and `res`
  const req = this.req
  const res = this.res

  // Define the status code to send in the response.
  const statusCodeToSet = 404

  // Defines default message
  const message = 'Recurso no encontrado'

  // Si no hay datos adicionales, envia un error 404 con el mensaje determinado
  if (optionalData === undefined) {
    sails.log.error('Ran custom response: res.notFound()')
    return res.errorResponse({
      status: statusCodeToSet,
      message
    })
  }
  // Si los datos adicionales son de la clase error
  else if (_.isError(optionalData)) {
    sails.log.error('Custom response `res.notFound()` called with an Error:', optionalData)

    // Si los datos adicionales se pueden parsear a json y no estamos en produccion
    if (!_.isFunction(optionalData.toJSON) && process.env.NODE_ENV !== 'production') {
      // Si NO estamos en produccion (dev, etc) se envia la info adicional
      // en el campo data
      return res.errorResponse({
        status: statusCodeToSet,
        message,
        data: optionalData.stack
      })
    }
  }
  // Si se llega hasta aca es porque el dato adicional no es de la clase error o
  // tiene funcion toJSON
  // Si esta en produccion, no devuelve nada mas que un errorResponse con el mensaje
  if (process.env.NODE_ENV === 'production') {
    return res.errorResponse({
      status: statusCodeToSet,
      message
    })
  } else {
    // Si NO estamos en produccion (dev, etc) se envia la info adicional
    // en el campo data
    return res.errorResponse({
      status: statusCodeToSet,
      message,
      data: optionalData
    })
  }
}
