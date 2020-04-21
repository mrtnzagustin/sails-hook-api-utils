//  ███╗   ███╗ ██████╗ ██████╗ ███████╗██╗
//  ████╗ ████║██╔═══██╗██╔══██╗██╔════╝██║
//  ██╔████╔██║██║   ██║██║  ██║█████╗  ██║
//  ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  ██║
//  ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗███████╗
//  ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝
//
//  ██╗   ██╗ █████╗ ██╗     ██╗██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
//  ██║   ██║██╔══██╗██║     ██║██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
//  ██║   ██║███████║██║     ██║██║  ██║███████║   ██║   ██║██║   ██║██╔██╗ ██║
//  ╚██╗ ██╔╝██╔══██║██║     ██║██║  ██║██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
//   ╚████╔╝ ██║  ██║███████╗██║██████╔╝██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
//    ╚═══╝  ╚═╝  ╚═╝╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
//
//  ██████╗  ██████╗ ██╗     ██╗ ██████╗██╗   ██╗
//  ██╔══██╗██╔═══██╗██║     ██║██╔════╝╚██╗ ██╔╝
//  ██████╔╝██║   ██║██║     ██║██║      ╚████╔╝
//  ██╔═══╝ ██║   ██║██║     ██║██║       ╚██╔╝
//  ██║     ╚██████╔╝███████╗██║╚██████╗   ██║
//  ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝   ╚═╝
//
module.exports = async function (req, res, proceed) {
  let schema = null
  //  ┌─┐┬ ┬┌─┐┌─┐┬┌─  ┌─┐┌─┐┬─┐  ┬  ┬┌─┐┬  ┬┌┬┐  
  //  │  ├─┤├┤ │  ├┴┐  ├┤ │ │├┬┘  └┐┌┘├─┤│  │ ││  
  //  └─┘┴ ┴└─┘└─┘┴ ┴  └  └─┘┴└─   └┘ ┴ ┴┴─┘┴─┴┘  
  //  ┌─┐┌─┐┬─┐┌─┐┌┬┐┌─┐┌┬┐┌─┐┬─┐┌─┐              
  //  ├─┘├─┤├┬┘├─┤│││├┤  │ ├┤ ├┬┘└─┐              
  //  ┴  ┴ ┴┴└─┴ ┴┴ ┴└─┘ ┴ └─┘┴└─└─┘      
  // TODO: get messages from hook variables        
  if (!req.options.model) { // 'model' variable need to be seted in the route
    const mensajeError = 'Falta parámetro model. Para usar la policy modelValidation se debe enviar el párametro model en la ruta (presente por defecto en blueprints)'
    sails.log.error(mensajeError)
    return res.serverError(new Error(mensajeError))
  } else if (sails.models[req.options.model]) { // model founded in sails models
    try {
      schema = sails.models[req.options.model].joiSchema() // Get the joi schema from the model
    } catch (error) { // Catch error when try to access the joi schema
      const mensajeError = `Error al intentar acceder al esquema joi del modelo ${req.options.model}`
      sails.log.error(mensajeError)
      return res.serverError(new Error(mensajeError))
    }
  } else { // model not exists
    const mensajeError = `El modelo ${req.options.model} no existe`
    sails.log.error(mensajeError)
    return res.serverError(new Error(mensajeError))
  }
  if (!schema) { // joi validation not found
    const mensajeError = 'Falta validación joi para el Modelo de la tabla req.options.model'
    sails.log.error(mensajeError)
    return res.serverError(new Error(mensajeError))
  }

  //  ┌─┐┌─┐┬ ┬┌─┐┌┬┐┌─┐   ┬┌─┐┬  ┬  ┬┌─┐┬  ┬┌┬┐┌─┐┌┬┐┬┌─┐┌┐┌
  //  └─┐│  ├─┤├┤ │││├─┤   ││ ││  └┐┌┘├─┤│  │ ││├─┤ │ ││ ││││
  //  └─┘└─┘┴ ┴└─┘┴ ┴┴ ┴  └┘└─┘┴   └┘ ┴ ┴┴─┘┴─┴┘┴ ┴ ┴ ┴└─┘┘└┘
  try {
    await schema.validateAsync(req.body)
    return proceed()
  } catch (err) { 
    const error = err.details[0] // INFO: Sends only first error in all validation, more performance
    res.badRequest(new Error(`Error en campo '${error.path[0]}': ${error.message}`)) // TODO: Make message custom by hook variable
  }
}
