//  ██████╗  █████╗ ███████╗███████╗██████╗  ██████╗ ██████╗ ████████╗
//  ██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝
//  ██████╔╝███████║███████╗███████╗██████╔╝██║   ██║██████╔╝   ██║
//  ██╔═══╝ ██╔══██║╚════██║╚════██║██╔═══╝ ██║   ██║██╔══██╗   ██║
//  ██║     ██║  ██║███████║███████║██║     ╚██████╔╝██║  ██║   ██║
//  ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝
//
//   █████╗ ██╗   ██╗████████╗██╗  ██╗
//  ██╔══██╗██║   ██║╚══██╔══╝██║  ██║
//  ███████║██║   ██║   ██║   ███████║
//  ██╔══██║██║   ██║   ██║   ██╔══██║
//  ██║  ██║╚██████╔╝   ██║   ██║  ██║
//  ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝
//

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

//  ╦  ╔═╗╔═╗╔═╗╦    ╔═╗╔╦╗╦═╗╔═╗╔╦╗╔═╗╔═╗╦ ╦
//  ║  ║ ║║  ╠═╣║    ╚═╗ ║ ╠╦╝╠═╣ ║ ║╣ ║ ╦╚╦╝
//  ╩═╝╚═╝╚═╝╩ ╩╩═╝  ╚═╝ ╩ ╩╚═╩ ╩ ╩ ╚═╝╚═╝ ╩

// This function handles login, recieves username and password
// This will be injected to the passport local strategy constructor
const loginFunction = (username, password, cb) => {
  // Search for user using the userModelName parameter inside hook config
  const UserModel = sails.models[sails.config.apiUtils.passport.userModelName]
  UserModel.findOne({ username }).exec(async function (error, user) {
    if (error) { // If theres an error in the query
      return cb(error)
    }
    if (!user) { // If no user is found
      return cb(null, false)
    }
    // If user is found
    await sails.helpers.passwords.checkPassword(password, user.password).switch({
  		error: function (error) { // Error case
  			return cb(error)
  		},
  		incorrect: function () { // Incorrect password
  			return cb(null, false)
  		},
  		success: function () { // Success password check 
  			return cb(null, user)
  		}
  	})
  })
}
//  Local strategy creation
const estrategia = new LocalStrategy({
  usernameField: 'username', // TODO: Make this a parameter inside the hook
  passportField: 'password', // TODO: Make this a parameter inside the hook
  session: false
}, loginFunction)

// Make passport uses the strategy
passport.use(estrategia)

//  ╦ ╦╔═╗╔╗╔╔╦╗╦  ╔═╗  ╦  ╔═╗╔═╗╦╔╗╔
//  ╠═╣╠═╣║║║ ║║║  ║╣   ║  ║ ║║ ╦║║║║
//  ╩ ╩╩ ╩╝╚╝═╩╝╩═╝╚═╝  ╩═╝╚═╝╚═╝╩╝╚╝
// This is a high order function -> https://es.wikipedia.org/wiki/John_Bercow
// Its being used to be called from a handler in express and before that
// by passport from their authenticate function (with error and user)
// TODO: Get messages from config variables
const handleLogin = (req, res) => (error, user) => {
  if (error) {
    res.serverError(error)
  }
  if (!user) {
    res.errorResponse({ // TODO: cambiar a respuesta estandard de badRequest
      message: 'El usuario o la contraseña ingresados son inválidos',
      status: 400
    })
  } else {
    sails.log.info(`Usuario logueado correctamente: ${user.username}`)
    const jwt = require('jsonwebtoken')
    const token = jwt.sign(
      {
        sub: user.id,
        username: user.username
      },
      {
        key: sails.config.apiUtils.passport.jwt.privateKey,
        passphrase: sails.config.apiUtils.passport.jwt.passphrase
      },
      {
        algorithm: 'RS256',
        expiresIn: sails.config.apiUtils.passport.jwt.expiresIn
      }
    )
    res.successResponse({
      message: 'Sesión iniciada correctamente',
      data: {
        token
      }
    })
  }
}
// Save the function to be used from your login action
passport.handleLogin = handleLogin

//   ╦╦ ╦╔╦╗  ╔═╗╔╦╗╦═╗╔═╗╔╦╗╔═╗╔═╗╦ ╦
//   ║║║║ ║   ╚═╗ ║ ╠╦╝╠═╣ ║ ║╣ ║ ╦╚╦╝
//  ╚╝╚╩╝ ╩   ╚═╝ ╩ ╩╚═╩ ╩ ╩ ╚═╝╚═╝ ╩
// TODO: Make possible to extract jwt with other strategy, config this inside hook parameters
const configJwtStrategy = function (sails, passport) {
  const optsJwt = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // By default, extract the token from Authorization header, as a Bearer token
    secretOrKey: sails.config.apiUtils.passport.jwt.publicKey,
    algorithms: ['RS256']
  }
  // Check function to search for user before passport exctracts and validate the token
  const checkFunction = (jwtPayload, cb) => {
    // Search for user using the userModelName parameter inside hook config
    const UserModel = sails.models[sails.config.apiUtils.passport.userModelName]
    UserModel.findOne({ id: jwtPayload.sub }).exec((error, user) => {
      if (error) { // If there is an error in the query
        return cb(error)
      } else if (user) { // If there is no error and user is found
        return cb(null, user)
      } else { // If user is not found
        return cb(null, false)
      }
    })
  }
  const estrategiaJwt = new JwtStrategy(optsJwt, checkFunction)
  passport.use(estrategiaJwt)
}

//  ┬┌┬┐┌─┐┌─┐┬─┐┌┬┐┌─┐┌┐┌┌┬┐  ┬┌┐┌┌─┐┌─┐┬─┐┌┬┐┌─┐┌┬┐┬┌─┐┌┐┌
//  ││││├─┘│ │├┬┘ │ ├─┤│││ │   ││││├┤ │ │├┬┘│││├─┤ │ ││ ││││
//  ┴┴ ┴┴  └─┘┴└─ ┴ ┴ ┴┘└┘ ┴   ┴┘└┘└  └─┘┴└─┴ ┴┴ ┴ ┴ ┴└─┘┘└┘
// This configJwtStrategy lives here to be executed from the hook initilization
// cause from here you dont have accesss the the default hook variables (located at sails.apiUtils)
passport.configJwtStrategy = configJwtStrategy

module.exports = passport
