//  ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗     ███████╗██████╗ ██████╗  ██████╗ ██████╗
//  ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗    ██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
//  ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝    █████╗  ██████╔╝██████╔╝██║   ██║██████╔╝
//  ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗    ██╔══╝  ██╔══██╗██╔══██╗██║   ██║██╔══██╗
//  ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║    ███████╗██║  ██║██║  ██║╚██████╔╝██║  ██║
//  ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
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
//  ┌─┐┌─┐┬─┐┬  ┬┌─┐┬─┐  ┌─┐┬─┐┬─┐┌─┐┬─┐
//  └─┐├┤ ├┬┘└┐┌┘├┤ ├┬┘  ├┤ ├┬┘├┬┘│ │├┬┘
//  └─┘└─┘┴└─ └┘ └─┘┴└─  └─┘┴└─┴└─└─┘┴└─
module.exports = function serverError(optionalData) {
  // Get access to `req` and `res`
  var req = this.req
  var res = this.res

  // Si no se dieron datos adicionales, muestra un errorResponse tradicional
  if (optionalData === undefined) {
    sails.log.error(__('info.ranCustomResponse') + 'res.serverError()')
    return res.errorResponse()
  }
  // Si los datos adicionales son de la clase "error"
  else if (_.isError(optionalData)) {
    sails.log.error(__('info.ranCustomResponse') + ' `res.serverError()` ' + __('error.calledWithAnError'), optionalData)

    // Si el error (dato adicional) no se puede parsear a json y no estamos en produccion
    if (!_.isFunction(optionalData.toJSON) && process.env.NODE_ENV !== 'production') {
      return res.errorResponse({
        message: __('error.serverErrorWithExtras'),
        data: optionalData.stack
      })
    }
  }
  // Si se llega hasta aca es porque el dato adicional no es de la clase error o
  // tiene funcion toJSON
  // Si esta en produccion, no devuelve nada mas que un errorResponse
  if (process.env.NODE_ENV === 'production') {
    return res.errorResponse()
  } else {
    // Si NO estamos en produccion (dev, etc) se envia la info adicional
    // en el campo data
    return res.errorResponse({
      message: __('error.serverErrorWithExtras'),
      data: optionalData
    })
  }
}
