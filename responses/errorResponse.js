//  ███████╗██████╗ ██████╗  ██████╗ ██████╗
//  ██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
//  █████╗  ██████╔╝██████╔╝██║   ██║██████╔╝
//  ██╔══╝  ██╔══██╗██╔══██╗██║   ██║██╔══██╗
//  ███████╗██║  ██║██║  ██║╚██████╔╝██║  ██║
//  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
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
//  ┌─┐┬─┐┬─┐┌─┐┬─┐  ┌─┐┌─┐┬─┐┌─┐  ┌┬┐┌─┐┌┬┐┌─┐  ┬  ┌─┐
//  ├┤ ├┬┘├┬┘│ │├┬┘  ├─┘├─┤├┬┘├─┤   │ │ │ ││├─┤  │  ├─┤
//  └─┘┴└─┴└─└─┘┴└─  ┴  ┴ ┴┴└─┴ ┴   ┴ └─┘─┴┘┴ ┴  ┴─┘┴ ┴
//  ┌─┐┌─┐┬  ┬┌─┐┌─┐┌─┐┬┌─┐┌┐┌
//  ├─┤├─┘│  ││  ├─┤│  ││ ││││
//  ┴ ┴┴  ┴─┘┴└─┘┴ ┴└─┘┴└─┘┘└┘
module.exports = function errorResponse(params) {
  // Get access to `req` and `res`
  const req = this.req
  const res = this.res

  // Define the status code to send in the response.
  let statusCodeToSet = 500
  if (params && params.status !== undefined) { // Si se enviaron params y ademas un status especifico, lo agrega
    statusCodeToSet = params.status
  }
  // Si no se enviaron params o no se mando mensaje enviar un interal error tradicional
  if (!params || (params && params.message === undefined)) {
    sails.log.error(__("error:noExtraData"))
    return res.status(statusCodeToSet).json({
      success: false,
      message: __('error.calledWithAnError'),
      data: {}
    })
  }

  // Si no se envia data extra, se envia solo con mensaje
  if (params.data === undefined) {
    return res.status(statusCodeToSet).json({
      success: false,
      message: params.message,
      data: {}
    })
  } else { // Si existe la data, la agrega
    return res.status(statusCodeToSet).json({
      success: false,
      message: params.message,
      data: params.data
    })
  }
}
