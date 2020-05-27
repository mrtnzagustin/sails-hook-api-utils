//  ███████╗ ██████╗ ██████╗ ██████╗ ██╗██████╗ ██████╗ ███████╗███╗   ██╗
//  ██╔════╝██╔═══██╗██╔══██╗██╔══██╗██║██╔══██╗██╔══██╗██╔════╝████╗  ██║
//  █████╗  ██║   ██║██████╔╝██████╔╝██║██║  ██║██║  ██║█████╗  ██╔██╗ ██║
//  ██╔══╝  ██║   ██║██╔══██╗██╔══██╗██║██║  ██║██║  ██║██╔══╝  ██║╚██╗██║
//  ██║     ╚██████╔╝██║  ██║██████╔╝██║██████╔╝██████╔╝███████╗██║ ╚████║
//  ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝
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
//  ┌─┐┌─┐┬─┐┌┐ ┬┌┬┐┌┬┐┌─┐┌┐┌
//  ├┤ │ │├┬┘├┴┐│ ││ ││├┤ │││
//  └  └─┘┴└─└─┘┴─┴┘─┴┘└─┘┘└┘
module.exports = function forbidden(optionalData) {
  // Get access to `req` and `res`
  var req = this.req
  var res = this.res

  // Define the status code to send in the response.
  const statusCodeToSet = 403

  // Defines default message
  const message = __("error:accessDenied")

  // Si no se envian datos, se muestra un prohibido tradicional
  if (optionalData === undefined) {
    sails.log.error(__('info.ranCustomResponse') + 'res.forbidden()')
    return res.errorResponse({
      status: statusCodeToSet,
      message
    })
  } else if (_.isError(optionalData)) { // Si el dato adicional es de tipo error
    sails.log.error(__('info.ranCustomResponse') + ' `res.forbidden()` ' + __('error.calledWithAnError'), optionalData)

    // Si el error se puede parsear a json y no estamos en produccion
    if (!_.isFunction(optionalData.toJSON) && process.env.NODE_ENV !== 'production') {
      // Si estamos en produccion, sin data adicional
      return res.errorResponse({
        status: statusCodeToSet,
        message,
        data: optionalData.stack
      })
    }
  }

  // Si se llega hasta aca es porque el dato adicional no es de la clase error o
  // tiene funcion toJSON
  if (process.env.NODE_ENV === 'production') {
    return res.errorResponse({
      status: statusCodeToSet,
      message
    })
  } else {
    return res.errorResponse({
      status: statusCodeToSet,
      message,
      data: optionalData
    })
  }
}
