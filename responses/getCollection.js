//   ██████╗ ███████╗████████╗
//  ██╔════╝ ██╔════╝╚══██╔══╝
//  ██║  ███╗█████╗     ██║
//  ██║   ██║██╔══╝     ██║
//  ╚██████╔╝███████╗   ██║
//   ╚═════╝ ╚══════╝   ╚═╝
//
//   ██████╗ ██████╗ ██╗     ██╗     ███████╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
//  ██╔════╝██╔═══██╗██║     ██║     ██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
//  ██║     ██║   ██║██║     ██║     █████╗  ██║        ██║   ██║██║   ██║██╔██╗ ██║
//  ██║     ██║   ██║██║     ██║     ██╔══╝  ██║        ██║   ██║██║   ██║██║╚██╗██║
//  ╚██████╗╚██████╔╝███████╗███████╗███████╗╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
//   ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
//
//  ██████╗ ███████╗███████╗██████╗  ██████╗ ███╗   ██╗███████╗███████╗
//  ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔════╝
//  ██████╔╝█████╗  ███████╗██████╔╝██║   ██║██╔██╗ ██║███████╗█████╗
//  ██╔══██╗██╔══╝  ╚════██║██╔═══╝ ██║   ██║██║╚██╗██║╚════██║██╔══╝
//  ██║  ██║███████╗███████║██║     ╚██████╔╝██║ ╚████║███████║███████╗
//  ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚══════╝
//
//  ┬─┐┌─┐┌─┐┌─┐┌─┐┌┐┌┌─┐┌─┐  ┌─┐┌─┐┬─┐┌─┐  ┌─┐┌─┐┌┐┌┌─┐┬ ┬┬ ┌┬┐┌─┐┌─┐
//  ├┬┘├┤ └─┐├─┘│ ││││└─┐├┤   ├─┘├─┤├┬┘├─┤  │  │ ││││└─┐│ ││  │ ├─┤└─┐
//  ┴└─└─┘└─┘┴  └─┘┘└┘└─┘└─┘  ┴  ┴ ┴┴└─┴ ┴  └─┘└─┘┘└┘└─┘└─┘┴─┘┴ ┴ ┴└─┘
//  ┬─┐┌─┐┌─┐┌┬┐  ╔═╗╔═╗╔╦╗  ┌─┐┌─┐┌┐ ┬─┐┌─┐  ┌─┐┌─┐┬  ┌─┐┌─┐┌─┐┬┌─┐┌┐┌
//  ├┬┘├┤ └─┐ │   ║ ╦║╣  ║   └─┐│ │├┴┐├┬┘├┤   │  │ ││  ├┤ │  │  ││ ││││
//  ┴└─└─┘└─┘ ┴   ╚═╝╚═╝ ╩   └─┘└─┘└─┘┴└─└─┘  └─┘└─┘┴─┘└─┘└─┘└─┘┴└─┘┘└┘
//  ┌┬┐┌─┐  ┬─┐┌─┐┌─┐┬ ┬┬─┐┌─┐┌─┐┌─┐
//   ││├┤   ├┬┘├┤ │  │ │├┬┘└─┐│ │└─┐
//  ─┴┘└─┘  ┴└─└─┘└─┘└─┘┴└─└─┘└─┘└─┘
/**
 * formato de params
 * {
 *    results: array con resultados,
 *    pagination: {
 *      totalPages: 0,
 *      perPage: 0,
 *      totalEntries: 0
 *    }
 * }
 */
// TODO: Translate comments
module.exports = function getCollection (params) {
  // Get access to `req` and `res`
  const req = this.req
  const res = this.res

  // Valida los parametros de entrada
  if (params === undefined ||
      params.results === undefined ||
      !_.isArray(params.results) ||
      params.pagination === undefined ||
      params.pagination.totalPages === undefined ||
      !_.isNumber(params.pagination.totalPages) ||
      params.pagination.perPage === undefined ||
      !_.isNumber(params.pagination.perPage) ||
      params.pagination.totalEntries === undefined ||
      !_.isNumber(params.pagination.totalEntries)
  ) {
    const mensaje = 'Error en la utilizacion de response getCollection, se debe enviar parametro params, con results y pagination'
    return res.serverError(new Error(mensaje))
  }

  // Retorna la collection con un 200 (default para success)
  return res.successResponse({
    message: 'Collection resuelta correctamente',
    data: {
      results: params.results,
      pagination: params.pagination
    }
  })
}
