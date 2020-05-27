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
 * Formato general:  ( General Format: )
 * {
 *    success: true,
 *    message: 'El mensaje que se deberia mostrar',   <--- The message that should be displayed
 *    data: diccionario js con data adicional         <--- JS Dictionary with Additional Data
 * }
 *
 */
module.exports = function successResponse(params) {
  // Get access to `req` and `res`
  const req = this.req
  const res = this.res

  // Define the status code to send in the response.
  let statusCodeToSet = 200
  if (params.status !== undefined) { // Si se envio un status especifico, lo agrega
    statusCodeToSet = params.status
  }

  // Si no se envia mensaje, enviar error por uso incorrecto del response
  // If no message is sent, send error due to incorrect use of the response
  if (params.message === undefined) {
    sails.log.error(__('info.successNoData'))
    return res.serverError(new Error(__('info.successNoData')))
  }

  // Si no se envia data extra, se envia solo con mensaje
  // If no extra data is sent, it is sent only with a message
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
