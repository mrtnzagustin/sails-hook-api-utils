# sails-hook-api-utils
A Sails.js hook with some useful utilities for designing a restful api backend.

## Features
-  Standard JSON responses with a basic structure
-  JWT authentication with `passport.js` using local and JWT strategies
-  Policies for checking an autheticated user and for model validation with `hapi/joi`
-  Pagination support for blueprint `find` method.

## Standard JSON responses with basic structure
Some basic standard api restful responses made by my own judgment and using some useful examples from https://medium.com/@bojanmajed/standard-json-api-response-format-c6c1aabcaa6d

- If you really like standards, take a look to the future: https://www.hydra-cg.com/

### Error Response (res.errorResponse)
A base and basic error response to be used by all your backend
``` json
{
    "success": false,
    "message" "A custom error message",
    "data": {}
}
```
#### Sails use:

```javascript
// status: Any 5xx or 4xx error
return res.errorResponse({
    status: 400,
    message: 'Oh no, you mess it up',
    data: {
        additionalData: 'Try again'
    }
})
```
### Success Response (res.errorResponse)
A base and basic success response to be used by all your backend
``` json
{
    "success": true,
    "message" "A custom info message",
    "data": {}
}
```
#### Sails use:

```javascript
// status: Any valid and successful http code
return res.successResponse({
    status: 200,
    message: 'Oh yes, you rock',
    data: {
        additionalData: 'I am proud of you'
    }
})
```

### Bad Request Response (res.badRequest) [Sails.js default `badRequest` override]
An override of sails `badRequest` using `errorResponse` as base

#### Sails use:

```javascript
return res.badRequest()
// OUTPUT -> Hardcoded code: 400 (Sorry bro, spanish for now)
{ 
    "success": false, 
    "message": "Solicitud inválida, revisar datos enviados", 
    "data": {} 
}

return res.badRequest(new Error('A nice error message'))
// OUTPUT in PRODUCTION -> Hardcoded code: 400
{ 
    "success": false, 
    "message": "A nice error message", 
    "data": {} 
}
// OUTPUT in DEVELOPMENT -> Hardcoded code: 400
{ 
    "success": false, 
    "message": "A nice error message", 
    // Stack error [nice for debug ;)], for example
    "data": "t Object.module.exports [as someFile] (/your/nice/project/src/your/well/formed/response/someFile.js:67:20)"
    
}
```

### Forbidden Response (res.forbidden) [Sails.js default `forbidden` override]
An override of sails forbidden using `errorResponse` as base

#### Sails use:

```javascript
return res.forbidden()
// OUTPUT -> Hardcoded code: 403
{ 
    "success": false, 
    "message": "Acceso prohibido", 
    "data": {} 
}

return res.forbidden(new Error('Ups, someone is trying to make bad things'))
// OUTPUT in PRODUCTION -> Hardcoded code: 403
{ 
    "success": false, 
    "message": "Acceso prohibido", 
    "data": {} 
}
// OUTPUT in DEVELOPMENT -> Hardcoded code: 403
{ 
    "success": false, 
    "message": "Acceso prohibido", 
    // Stack error [nice for debug ;)], for example
    "data": "t Object.module.exports [as someFile] (/your/nice/project/src/your/well/formed/response/someFile.js:67:20)"
    
}
```
### Not Found Response (res.notFound) [Sails.js default `notFound` override]
An override of sails notFound using `errorResponse` as base

#### Sails use:

```javascript
return res.notFound()
// OUTPUT -> Hardcoded code: 404
{ 
    "success": false, 
    "message": "Recurso no encontrado", 
    "data": {} 
}

return res.notFound(new Error('Ups, someone is trying to access /wordpress/admin.php'))
// OUTPUT in PRODUCTION -> Hardcoded code: 404
{ 
    "success": false, 
    "message": "Recurso no encontrado", 
    "data": {} 
}
// OUTPUT in DEVELOPMENT -> Hardcoded code: 404
{ 
    "success": false, 
    "message": "Recurso no encontrado", 
    // Stack error [nice for debug ;)], for example
    "data": "t Object.module.exports [as someFile] (/your/nice/project/src/your/well/formed/response/someFile.js:67:20)"
    
}
```

### OK Response (res.ok) [Sails.js default ok override]
An override of sails ok response, using `successResponse` as base. In this hook, this response is intended to be used to override the use in blueprints actions. All methods are considered, please read: https://sailsjs.com/documentation/concepts/blueprints/blueprint-routes#?restful-blueprint-routes 

To be more specific, I created this override to avoid using the `ok` response in other places, and instead just making blueprint responses more standard.
I strongly recommend you to read the [`./responses/ok.js`](https://github.com/mrtnzagustin/sails-hook-api-utils/blob/master/responses/ok.js) file to make it clear.
#### Sails blueprints output examples:

```javascript
// OUTPUT for findOne -> GET /boat/1  -> Hardcoded code: 200
{ 
    "success": true, 
    "message": "Operacion 'findOne' sobre la entidad 'boat'", 
    "data": {
        "result": {
            "id": 1,
            "name": "Malbec",
            "city": "Santa Fe, Argentina"
            "drivers": [1, 2]
        }
    } 
}
// OUTPUT for remove -> DELETE /boat/1/drivers/2  -> Hardcoded code: 200
{ 
    "success": true, 
    "message": "Operacion 'remove' sobre la entidad 'boat' y la relation 'drivers'", 
    "data": {
        "result": {
            "id": 1,
            "name": "Malbec",
            "city": "Santa Fe, Argentina"
            "drivers": [1]
        }
    } 
}
// All other variants are the same
```

### Get Collection Response (res.getCollection) [custom response]
A custom response for restful Get Collection endpoints

#### Sails use:

```javascript
let responseData = {
    results: myEntityCollectionArrayEtc,
    pagination: {
        totalPages: 1,
        perPage: 20,
        totalEntries: 2
    }
}
return res.getCollection(responseData)
// OUTPUT -> Hardcoded code: 200
{ 
    "success": false, 
    "message": "Collection resuelta correctamente", 
    "data": {
        "results": [
            {
                "id": 1,
                "name": "Malbec",
                "city": "Santa Fe, Argentina"
                "drivers": [1, 2]
            },
            {
                "id": 2,
                "name": "Lecth",
                "city": "Santa Fe, Argentina"
                "drivers": [3]
            }
        ],
        "pagination": {
            "totalPages": 1,
            "perPage": 20,
            "totalEntries": 2
        }
    }
}
```

## JWT authentication with passport.js
JWT authentication ready with:
- One method to use in logIn actions
- One policy to check if user isAuthenticated (see next section)

To use passport you need to:

### Config hook variables
1.  Create a file `your-project/config/apiUtils.js` with
```javascript
module.exports.apiUtils = {
    passport: {
            userModelName: 'user', // Your User model name, please use 'lower case' 
            jwt: {
              privateKey: 'your-4096-bits-aes256-private-key'
              publicKey: 'your-public-key',
              passphrase: 'your-passphrase',
              expiresIn: '2 days' // expression of expires time of the token otherExamples: '60 minutes', '12 hours', etc.
            }
          }
}
```
- Generate keys with:
```
$ openssl genpkey -out private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
$ openssl pkey -in private.pem -out config/jwt/public.pem -pubout
```
2.  Inside your login action use it like this:
```javascript
// UserController
module.exports = {
    login: (req, res) => {
        sails.hooks.apiUtils.passport.authenticate('local', sails.hooks.apiUtils.passport.handleLogin(req, res))(req, res)
    }
}
```
Seems too easy? `passport.authenticate()` recieves two parameters: first, the strategy, in this case 'local'; second, a function to handle that authentication that recieves (error, user). Seems noisy because `handleLogin` is a high order function that recieves `req` and `res` and returns that function passport needs. [Example here](https://dev.to/damcosset/higher-order-functions-in-javascript-4j8b). You can check both implementations at [`./passport/passport.js`](https://github.com/mrtnzagustin/sails-hook-api-utils/blob/master/passport/passport.js).

## Policies for check autheticated user and for model validation with `hapi/joi`
You have the next custom policies to be used with this hook:

### `isAuthenticated`
To protect endpoints that must, at least, have a logged in user.
`Important: in many situations yo will need to add more than this policy, for example isAuthenticated and isAdmin(you must implement your owm isAdmin policy) ` 
#### Validations
- Check if JWT token is present in the authorization header of the request
- Check if the JWT token is valid
- Check if the user inside the JWT payload is a valid user
- PLUS: If the user is present in the request header, add the user object related in the req express object.
   - Too hard to understand this last point? Easy -> if you use this policy in one of your actions, inside that action you can access req.user and you will have the user logged in :)

### modelValidation
This policy has been created to be used in blueprints actions for create and update, but you can use it in any custom action. 
`IMPORTANT: this policy works only if you adjust your sails model to use hapi/joi validations`
#### How to use
- Blueprint Variant: You can add this policy to any blueprint action that requires validation, you online need to add 'modelValidation' as policy.
- Custom Action Variant: Another action that recibes a req where the req.body corresponds to a model. For example if you create your own create (or update) action to create (or update) a model entity, you have to: 
    1. Add 'modelValidation' policy to that route (/config/policies.js)
    2. Add a 'model' property to the bind route-action ( for example inside your routes.js file `'GET /api/v1/cat': { controller: 'CatController', action:'create', model:'youlowercasecatmodel' }`)
#### Validations
Checks whatever joi schema validation you add to your sails model and outputs a res.badRequest response with the text of the first error of the schema, otherwise proceed with the action. You just need to do something like this:
```javascript
/**
 * Usuario.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

//  ╦╔╦╗╔═╗╔═╗╦═╗╔╦╗   ╦╔═╗╦
//  ║║║║╠═╝║ ║╠╦╝ ║    ║║ ║║
//  ╩╩ ╩╩  ╚═╝╩╚═ ╩   ╚╝╚═╝╩
const Joi = require('@hapi/joi')
//  ╦╔╦╗╔═╗╔═╗╦═╗╔╦╗  ╔═╗╦ ╦╔═╗╔╦╗╔═╗╔╦╗  ╦  ╔═╗╔╗╔╔═╗     
//  ║║║║╠═╝║ ║╠╦╝ ║   ║  ║ ║╚═╗ ║ ║ ║║║║  ║  ╠═╣║║║║ ╦     
//  ╩╩ ╩╩  ╚═╝╩╚═ ╩   ╚═╝╚═╝╚═╝ ╩ ╚═╝╩ ╩  ╩═╝╩ ╩╝╚╝╚═╝     
//  ╔╦╗╔═╗╔═╗╔═╗╔═╗╔═╗╔═╗╔═╗  ╦╔═╗  ╦ ╦╔═╗╦ ╦  ╦ ╦╔═╗╔╗╔╔╦╗
//  ║║║║╣ ╚═╗╚═╗╠═╣║ ╦║╣ ╚═╗  ║╠╣   ╚╦╝║ ║║ ║  ║║║╠═╣║║║ ║ 
//  ╩ ╩╚═╝╚═╝╚═╝╩ ╩╚═╝╚═╝╚═╝  ╩╚     ╩ ╚═╝╚═╝  ╚╩╝╩ ╩╝╚╝ ╩ 
// Spanish source: https://gist.github.com/mrtnzagustin/a11823c32ba4957f68df52952f62d415
const spanishErrors = require('../../config/locales/joi_es_ES.json')

module.exports = {

  attributes: {

    id: {
      columnName: 'id',
      columnType: 'bigint(20)',
      type: 'number',
      autoIncrement: true
    },

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    username: {
      type: 'string',
      columnType: 'varchar(50)',
      minLength: 6,
      required: true
    },

    password: {
      type: 'string',
      columnType: 'varchar(255)',
      required: true
    },

    nombre: {
      type: 'string',
      columnType: 'varchar(255)',
      required: true
    },

    apellido: {
      type: 'string',
      columnType: 'varchar(255)',
      required: true
    },

    email: {
      type: 'string',
      columnType: 'varchar(255)',
      required: true
    },

    telefono: {
      type: 'string',
      columnType: 'varchar(255)',
      required: true
    }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },
  //   ╦╔═╗╦  ╔═╗╔═╗╦ ╦╔═╗╔╦╗╔═╗  ╔╦╗╔═╗╔═╗╦╔╗╔╦╔╦╗╦╔═╗╔╗╔
  //   ║║ ║║  ╚═╗║  ╠═╣║╣ ║║║╠═╣   ║║║╣ ╠╣ ║║║║║ ║ ║║ ║║║║
  //  ╚╝╚═╝╩  ╚═╝╚═╝╩ ╩╚═╝╩ ╩╩ ╩  ═╩╝╚═╝╚  ╩╝╚╝╩ ╩ ╩╚═╝╝╚╝
  joiSchema: function () {
    return Joi.object({
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(50)
        .required()
        .messages(spanishErrors),
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2 })
        .messages(spanishErrors),
      password: Joi.string()
        .required()
        .messages(spanishErrors),
      nombre: Joi.string()
        .required()
        .messages(spanishErrors),
      apellido: Joi.string()
        .required()
        .messages(spanishErrors),
      telefono: Joi.string()
        .required()
        .messages(spanishErrors)
    })
  },
  customToJSON: function () {
    return _.omit(this, ['password'])
  },
  beforeCreate: function (valuesToSet, proceed) {
    // Hash password
    // This helper is included with sails-hook-organics
    sails.helpers.passwords.hashPassword(valuesToSet.password).exec((err, hashedPassword) => {
      if (err) { return proceed(err) }
      valuesToSet.password = hashedPassword
      return proceed()
    })
  }
}
``` 
Example success response:
```json
{ 
    "success": true, 
    "message": "Operacion 'create' sobre la entidad 'cat'", 
    "data": {
        "result": {
            "id": 1,
            "name": "Pompón",
            "owner": "Juan Agustín Martínez",
            "favoriteSong": "Soft kitty. Warm kitty. Little ball of fur."
        }
    } 
}
```
Example error (validation working) response:
```json
{
  "success": false,
  "message": "Error en campo 'apellido': es requerido",
  "data": {}
}
```
## Pagination support for blueprint find method.
Theres is a simple but powerful find.js re-implementation to add pagination capatilties. Its just a expand of the original [find.js](https://github.com/balderdashy/sails/tree/master/lib/hooks/blueprints/actions/find.js)

### How to use it
Just call it from your action:
```javascript
/**
 * CatController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  find: (req, res) => {
    sails.hooks.apiUtils.customBlueprint.find(req, res)
  }
}

```

Also you can set wich response should the method use, to customize this set this variable inside your hook config.

```javascript
module.exports.apiUtils = {
    blueprints: {
        // UPDATE: This variable is related to DEFAULT_LIMIT of the blueprints options
        // https://github.com/balderdashy/sails/blob/master/lib/hooks/blueprints/parse-blueprint-options.js
        // this variable is used inside custom find method, just in case the request ommit the 'limit' param
        defaultLimit: 30,
        // INFO: Here you can edit each one of the customBlueprints response to be used
        customMethodsResponses: {
            find: 'yourCustomResponse' // by default, uses a getCollection response -> see /responses/getCollection
        }
    }
}
```

The `find` method will end sending the next object to your response:
```javascript
let object = {
    results: matchingRecords,
    pagination
}
return res.yourCustomResponse(object)
```
