//   █████╗ ██╗   ██╗████████╗██╗  ██╗███████╗███╗   ██╗████████╗██╗ ██████╗ █████╗ ████████╗███████╗██████╗
//  ██╔══██╗██║   ██║╚══██╔══╝██║  ██║██╔════╝████╗  ██║╚══██╔══╝██║██╔════╝██╔══██╗╚══██╔══╝██╔════╝██╔══██╗
//  ███████║██║   ██║   ██║   ███████║█████╗  ██╔██╗ ██║   ██║   ██║██║     ███████║   ██║   █████╗  ██║  ██║
//  ██╔══██║██║   ██║   ██║   ██╔══██║██╔══╝  ██║╚██╗██║   ██║   ██║██║     ██╔══██║   ██║   ██╔══╝  ██║  ██║
//  ██║  ██║╚██████╔╝   ██║   ██║  ██║███████╗██║ ╚████║   ██║   ██║╚██████╗██║  ██║   ██║   ███████╗██████╔╝
//  ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═════╝
//
//  ██████╗  ██████╗ ██╗     ██╗ ██████╗██╗   ██╗
//  ██╔══██╗██╔═══██╗██║     ██║██╔════╝╚██╗ ██╔╝
//  ██████╔╝██║   ██║██║     ██║██║      ╚████╔╝
//  ██╔═══╝ ██║   ██║██║     ██║██║       ╚██╔╝
//  ██║     ╚██████╔╝███████╗██║╚██████╗   ██║
//  ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝   ╚═╝
//
// TODO: get messages from config variables
module.exports = async function (req, res, proceed) {
  // Uses the hook passport instance to try authentication
  sails.hooks.apiUtils.passport.authenticate('jwt', (error, user, info) => {
    if (error) {
      return res.serverError(error)
    } else if (info) { // If info variable is not undefined or null, there is an error with some extra info
      let message = ''
      switch (info.name) { // Check info data
        case 'TokenExpiredError':
          message = 'Tu sesión ha expirado, inicia nuevamente'
          break
        case 'JsonWebTokenError': // Invalid token
          message = 'Tu sesión es inválida'
          break
        case 'Error': // By try and error, the only error y found was "token not included in the request"
          message = 'No se incluyó token en la solicitud'
          break
        default:
          res.serverError(info)
          break
      }
      // Sends bad request with error message
      res.badRequest(new Error(message))
    } else if (!user) { // If the token is valid but there is no user with that username. VERY WEIRD SITUATION
      sails.log.error('Error improbable, un token fue firmado por el servidor pero el usuario no fue encontrado')
      res.badRequest(new Error('El user o la contraseña ingresados son inválidos'))
    } else { // Valid token and user found
      req.user = user // IMPORTANTE: Here the user is added to the request object to be used in actions
      return proceed()
    }
  })(req, res)
}
