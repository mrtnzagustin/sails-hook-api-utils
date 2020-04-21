//  ██████╗  █████╗ ██████╗     ██████╗ ███████╗ ██████╗ ██╗   ██╗███████╗███████╗████████╗
//  ██╔══██╗██╔══██╗██╔══██╗    ██╔══██╗██╔════╝██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝
//  ██████╔╝███████║██║  ██║    ██████╔╝█████╗  ██║   ██║██║   ██║█████╗  ███████╗   ██║
//  ██╔══██╗██╔══██║██║  ██║    ██╔══██╗██╔══╝  ██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║
//  ██████╔╝██║  ██║██████╔╝    ██║  ██║███████╗╚██████╔╝╚██████╔╝███████╗███████║   ██║
//  ╚═════╝ ╚═╝  ╚═╝╚═════╝     ╚═╝  ╚═╝╚══════╝ ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝
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
//  ┌┐ ┌─┐┌┬┐  ┬─┐┌─┐┌─┐ ┬ ┬┌─┐┌─┐┌┬┐
//  ├┴┐├─┤ ││  ├┬┘├┤ │─┼┐│ │├┤ └─┐ │
//  └─┘┴ ┴─┴┘  ┴└─└─┘└─┘└└─┘└─┘└─┘ ┴
// TODO: Translate comments
module.exports = function badRequest (optionalData) {
  // Get access to `req` and `res`
  var req = this.req
  var res = this.res

  // Status por defecto
  const statusCodeToSet = 400
  const defaultMessage = 'Solicitud inválida, revisar datos enviados'

  // Si no se dieron params, solo manda un mensaje de solicitud invalida
  if (optionalData === undefined) {
    sails.log.info('Ran custom response: res.badRequest()')
    return res.errorResponse({
      status: statusCodeToSet,
      message: defaultMessage
    })
  } else if (_.isError(optionalData)) { // Si los datos adicionales son de la clase "error"
    sails.log.error('Custom response `res.badRequest()` called with an Error:', optionalData)

    // Si el error (dato adicional) no se puede parsear a json
    if (!_.isFunction(optionalData.toJSON)) {
      // Si esta en modo prod, envia ademas el stack para que sea mas facil debug
      if (process.env.NODE_ENV !== 'production') {
        return res.errorResponse({
          status: statusCodeToSet,
          message: optionalData.message,
          data: optionalData.stack
        })
      } else {
        return res.errorResponse({
          status: statusCodeToSet,
          message: optionalData.message
        })
      }
    } else {
      // Si esta en modo prod, envia ademas el stack para que sea mas facil debug
      if (process.env.NODE_ENV !== 'production') {
        return res.errorResponse({
          status: statusCodeToSet,
          message: optionalData.message,
          data: optionalData
        })
      } else {
        return res.errorResponse({
          status: statusCodeToSet,
          message: optionalData.message
        })
      }
    }
  }
  // Si se llega hasta aca es porque el dato adicional no es de la clase error
  return res.errorResponse({
    status: statusCodeToSet,
    message: defaultMessage
  })
}
