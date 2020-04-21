//  ███████╗██╗   ██╗ ██████╗ ██████╗███████╗███████╗███████╗
//  ██╔════╝██║   ██║██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝
//  ███████╗██║   ██║██║     ██║     █████╗  ███████╗███████╗
//  ╚════██║██║   ██║██║     ██║     ██╔══╝  ╚════██║╚════██║
//  ███████║╚██████╔╝╚██████╗╚██████╗███████╗███████║███████║
//  ╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝
//
//  ██████╗ ███████╗███████╗██████╗  ██████╗ ███╗   ██╗███████╗███████╗
//  ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔════╝
//  ██████╔╝█████╗  ███████╗██████╔╝██║   ██║██╔██╗ ██║███████╗█████╗
//  ██╔══██╗██╔══╝  ╚════██║██╔═══╝ ██║   ██║██║╚██╗██║╚════██║██╔══╝
//  ██║  ██║███████╗███████║██║     ╚██████╔╝██║ ╚████║███████║███████╗
//  ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚══════╝
//
//  ┬─┐┌─┐┌─┐┌─┐┬ ┬┌─┐┌─┐┌┬┐┌─┐  ┌─┐┌─┐┌┬┐┌─┐┌┐┌┌┬┐┌─┐┬─┐  ┌┬┐┌─┐
//  ├┬┘├┤ └─┐├─┘│ │├┤ └─┐ │ ├─┤  ├┤ └─┐ │ ├─┤│││ ││├─┤├┬┘   ││├┤
//  ┴└─└─┘└─┘┴  └─┘└─┘└─┘ ┴ ┴ ┴  └─┘└─┘ ┴ ┴ ┴┘└┘─┴┘┴ ┴┴└─  ─┴┘└─┘
//  ┌─┐┬ ┬┌─┐┌─┐┌─┐┌─┐┌─┐  ┌─┐┌─┐┬─┐┌─┐  ┌┬┐┌─┐┌┬┐┌─┐  ┬  ┌─┐
//  └─┐│ ││  │  ├┤ └─┐└─┐  ├─┘├─┤├┬┘├─┤   │ │ │ ││├─┤  │  ├─┤
//  └─┘└─┘└─┘└─┘└─┘└─┘└─┘  ┴  ┴ ┴┴└─┴ ┴   ┴ └─┘─┴┘┴ ┴  ┴─┘┴ ┴
//  ┌─┐┌─┐┬  ┬┌─┐┌─┐┌─┐┬┌─┐┌┐┌
//  ├─┤├─┘│  ││  ├─┤│  ││ ││││
//  ┴ ┴┴  ┴─┘┴└─┘┴ ┴└─┘┴└─┘┘└┘
/**
 * Formato general:
 * {
 *    success: true,
 *    message: 'El mensaje que se deberia mostrar',
 *    data: diccionario js con data adicional
 * }
 */
// TODO: Translate comments
module.exports = function successResponse (params) {
  // Get access to `req` and `res`
  const req = this.req
  const res = this.res

  // Define the status code to send in the response.
  let statusCodeToSet = 200
  if (params.status !== undefined) { // Si se envio un status especifico, lo agrega
    statusCodeToSet = params.status
  }

  // Si no se envia mensaje, enviar error por uso incorrecto del response
  if (params.message === undefined) {
    sails.log.error('Se utilizó una successResponse sin message, revisar ejecución')
    return res.serverError(new Error('Se utilizó una successResponse sin message, revisar ejecución'))
  }

  // Si no se envia data extra, se envia solo con mensaje
  if (params.data === undefined) {
    return res.status(statusCodeToSet).json({
      success: true,
      message: params.message,
      data: {}
    })
  } else { // Si existe la data, la agrega
    return res.status(statusCodeToSet).json({
      success: true,
      message: params.message,
      data: params.data
    })
  }
}
