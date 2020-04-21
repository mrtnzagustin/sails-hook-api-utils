
//   ██████╗ ██╗  ██╗    ██████╗ ███████╗███████╗██████╗  ██████╗ ███╗   ██╗███████╗███████╗
//  ██╔═══██╗██║ ██╔╝    ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔════╝
//  ██║   ██║█████╔╝     ██████╔╝█████╗  ███████╗██████╔╝██║   ██║██╔██╗ ██║███████╗█████╗
//  ██║   ██║██╔═██╗     ██╔══██╗██╔══╝  ╚════██║██╔═══╝ ██║   ██║██║╚██╗██║╚════██║██╔══╝
//  ╚██████╔╝██║  ██╗    ██║  ██║███████╗███████║██║     ╚██████╔╝██║ ╚████║███████║███████╗
//   ╚═════╝ ╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚══════╝
//
//  ┌─┐┬  ┬┌─┐┬─┐┬─┐┬┌┬┐┌─┐  ┌┬┐┌─┐  ┌─┐┌─┐┬┬  ┌─┐  ┌┬┐┌─┐┌─┐┌─┐┬ ┬┬ ┌┬┐
//  │ │└┐┌┘├┤ ├┬┘├┬┘│ ││├┤    ││├┤   └─┐├─┤││  └─┐   ││├┤ ├┤ ├─┤│ ││  │
//  └─┘ └┘ └─┘┴└─┴└─┴─┴┘└─┘  ─┴┘└─┘  └─┘┴ ┴┴┴─┘└─┘  ─┴┘└─┘└  ┴ ┴└─┘┴─┘┴
//  ┌─┐┬┌─  ┬─┐┌─┐┌─┐┌─┐┌─┐┌┐┌┌─┐┌─┐
//  │ │├┴┐  ├┬┘├┤ └─┐├─┘│ ││││└─┐├┤
//  └─┘┴ ┴  ┴└─└─┘└─┘┴  └─┘┘└┘└─┘└─┘
// TODO: Translate comments
module.exports = function ok (optionalData) {
  // Get access to `req` and `res`
  var req = this.req
  var res = this.res

  // Define the status code to send in the response.
  var statusCodeToSet = 400

  // Si se retorna un array o si no existe la option blueprintAction, estamos ante un uso indebido
  if (_.isArray(optionalData) || !req.options.blueprintAction) {
    // TODO: No deberia haber algun caso donde se retorne un array mas que un item, salvo el find,
    // pero puede ser que se este escapando alguna condicion no analizada
    const mensaje = 'Caso no tenido en cuenta para la utilizacion de response ok'
    sails.log.error(mensaje, optionalData)
    return res.serverError(new Error(mensaje))
  } else { // Si no es array y existe la option blueprintAction estamos en un caso valido
    let message = ''
    switch (req.options.blueprintAction) {
      case 'findOne': // GET a /model/:id
        message = `Operacion '${req.options.blueprintAction}' sobre la entidad '${req.options.model}'`
        break
      case 'update': // PATCH a /model/:id
        message = `Operacion '${req.options.blueprintAction}' sobre la entidad '${req.options.model}'`
        break
      case 'destroy': // DELETE a /model/:id
        message = `Operacion '${req.options.blueprintAction}' sobre la entidad '${req.options.model}'`
        break
      case 'create': // POST a /model
        message = `Operacion '${req.options.blueprintAction}' sobre la entidad '${req.options.model}'`
        break
      case 'add': // PUT a /model/:id/relationToMany/:id
        message = `Operacion '${req.options.blueprintAction}' sobre la entidad '${req.options.model}' y la relation '${req.options.alias}'`
        break
      case 'remove': // DELETE a /model/:id/relationToMany/:id
        message = `Operacion '${req.options.blueprintAction}' sobre la entidad '${req.options.model}' y la relation '${req.options.alias}'`
        break
      case 'replace': // PUT a /model/:id/relationToMany
        message = `Operacion '${req.options.blueprintAction}' sobre la entidad '${req.options.model}' y la relation '${req.options.alias}'`
        break
    }

    // Retorna una respuesta custom
    return res.successResponse({
      message,
      data: {
        result: optionalData
      }
    })
  }
}
