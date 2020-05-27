
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
module.exports = function ok(optionalData) {
  // Get access to `req` and `res`
  var req = this.req
  var res = this.res

  // Define the status code to send in the response.
  var statusCodeToSet = 400

  // Si se retorna un array o si no existe la option blueprintAction, estamos ante un uso indebido
  // If an array is returned or if the option blueprintAction does not exist, we are facing an improper use
  if (_.isArray(optionalData) || !req.options.blueprintAction) {
    // TODO: No deberia haber algun caso donde se retorne un array mas que un item, salvo el find,
    // pero puede ser que se este escapando alguna condicion no analizada
    // TODO: There should be no case where an array is returned rather than an item, except find,
    // but it could be that some unanalyzed condition is escaping

    const mensaje = __('info.successUnknown')
    sails.log.error(mensaje, optionalData)
    return res.serverError(new Error(mensaje))
  } else { // Si no es array y existe la option blueprintAction estamos en un caso valido
    let message = ''
    switch (req.options.blueprintAction) {
      case 'findOne': // GET a /model/:id
      case 'update': // PATCH a /model/:id
      case 'destroy': // DELETE a /model/:id
      case 'create': // POST a /model
        message = __('word.action') + req.options.blueprintAction + __('info:aboutModel') + req.options.model
        break
      case 'add': // PUT a /model/:id/relationToMany/:id
      case 'remove': // DELETE a /model/:id/relationToMany/:id
      case 'replace': // PUT a /model/:id/relationToMany
        message = __('word.action') + req.options.blueprintAction + __('info:aboutModel') + req.options.model +
          __('info.andTheRelation') + req.options.alias
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
