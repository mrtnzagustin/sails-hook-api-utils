var _ = require('@sailshq/lodash');
/**
 * PASSPORT
 */
const passport = require('./passport/passport.js')
/**
 * CUSTOM WATERLINE METHODS
 */
const methodFind = require('./waterline-methods/find.js')
/**
 * POLICIES
 */
const policies = require('./policies/index.js')
/**
 * RESPONSES
 */
const responses = require('./responses/index.js')

const i18n = require()

module.exports = function apiUtils(sails) {
  return {
    //  ██╗  ██╗ ██████╗  ██████╗ ██╗  ██╗    ██████╗ ███████╗███████╗ █████╗ ██╗   ██╗██╗  ████████╗    
    //  ██║  ██║██╔═══██╗██╔═══██╗██║ ██╔╝    ██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██║  ╚══██╔══╝    
    //  ███████║██║   ██║██║   ██║█████╔╝     ██║  ██║█████╗  █████╗  ███████║██║   ██║██║     ██║       
    //  ██╔══██║██║   ██║██║   ██║██╔═██╗     ██║  ██║██╔══╝  ██╔══╝  ██╔══██║██║   ██║██║     ██║       
    //  ██║  ██║╚██████╔╝╚██████╔╝██║  ██╗    ██████╔╝███████╗██║     ██║  ██║╚██████╔╝███████╗██║       
    //  ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝    ╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝       
    //                                                                                                   
    //   ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗                                                   
    //  ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝                                                   
    //  ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗                                                  
    //  ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║                                                  
    //  ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝                                                  
    //   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝                                                   
    //                                                                                                   
    //  ██╗   ██╗ █████╗ ██╗     ██╗   ██╗███████╗███████╗                                               
    //  ██║   ██║██╔══██╗██║     ██║   ██║██╔════╝██╔════╝                                               
    //  ██║   ██║███████║██║     ██║   ██║█████╗  ███████╗                                               
    //  ╚██╗ ██╔╝██╔══██║██║     ██║   ██║██╔══╝  ╚════██║                                               
    //   ╚████╔╝ ██║  ██║███████╗╚██████╔╝███████╗███████║                                               
    //    ╚═══╝  ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝╚══════╝                                               
    //     
    // https://sailsjs.com/documentation/concepts/extending-sails/hooks/hook-specification/defaults                                                                                              
    defaults: (config) => {
      sails.log.silly('API UTILS HOOK: Configuring defaults config variables')

      return {
        //  ┌─┐┬  ┬    ┌┬┐┬ ┬┬┌─┐  ┬  ┬┌─┐┬─┐┬┌─┐┌┐ ┬  ┌─┐┌─┐  ┬  ┬┬  ┬┌─┐┌─┐  
        //  ├─┤│  │     │ ├─┤│└─┐  └┐┌┘├─┤├┬┘│├─┤├┴┐│  ├┤ └─┐  │  │└┐┌┘├┤ └─┐  
        //  ┴ ┴┴─┘┴─┘   ┴ ┴ ┴┴└─┘   └┘ ┴ ┴┴└─┴┴ ┴└─┘┴─┘└─┘└─┘  ┴─┘┴ └┘ └─┘└─┘  
        //  ┬┌┐┌┌─┐┬┌┬┐┌─┐                                                     
        //  ││││└─┐│ ││├┤                                                      
        //  ┴┘└┘└─┘┴─┴┘└─┘                                                     
        //  ┌─┐┌─┐┌┐┌┌─┐┬┌─┐ ┌─┐┌─┐┬┬ ┬┌┬┐┬┬  ┌─┐┬ ┬┌─┐┌─┐┬┌─                  
        //  │  │ ││││├┤ ││ ┬ ├─┤├─┘││ │ │ ││  └─┐├─┤│ ││ │├┴┐                  
        //  └─┘└─┘┘└┘└  ┴└─┘o┴ ┴┴  ┴└─┘ ┴ ┴┴─┘└─┘┴ ┴└─┘└─┘┴ ┴                  
        apiUtils: {
          blueprints: {
            // UPDATE: This variable is related to DEFAULT_LIMIT of the blueprints options
            // https://github.com/balderdashy/sails/blob/master/lib/hooks/blueprints/parse-blueprint-options.js
            // this variable is used inside custom find method, just in case the request ommit the 'limit' param
            defaultLimit: 30,
            // INFO: Here you can edit each one of the customBlueprints response to be used
            customMethodsResponses: {
              find: 'getCollection' // by default, use getCollection response -> see /responses/getCollection
            }
          },
          passport: {
            // INFO: Your User model name, please use 'lower case'
            userModelName: 'user',
            jwt: {
              privateKey: '-----BEGIN ENCRYPTED PRIVATE KEY-----\n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\n-----END ENCRYPTED PRIVATE KEY-----\n',
              publicKey: '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAxHthRdnnDsP18Q2P4ZT2\nYfwikxPMmDxCXuz+CsPrQzJLPbnmfE5e2KlcuhDwHYcJxL8k/LEw9dywj3ipjCkH\nZXPjJPlseUyWv234DjywKUyDfcp4wtngAl4TMKIMk7oQyV+8ybBrDpTIRxxwykDf\nmOb86elQ9BaJ3j7EsXMWjw8/lVNX88sCm2IyBGGZL+cbJx873TOA1ntJ+PEQ10hT\nbZ6jOK+QbW0ImJhUK06wCCwq7Wo3TdVvkKezsftoVohI+xiHM8AxEojKuht/fTpX\nlox6Cc7oeREoiA4jO9J3Drua99o+Aj7tinlFJe2gfqer+EoCWLRf6h6X5I6rWbpW\nvdUNZpzqSgTLsFlmvrWVXCvciwvNp1NdQ5vyw7nBRkW5a1VR+fOvn/EmySpcOfbq\n+ablEsGEqFWMZ6rOxsQzPtwO530diQT/sW5U4PDDDNV+8xuNhsSpij2AiIhRIDG2\nm/l/SE/Eq8h9CFg1BzB4gi2je9Uo0+HeSiwG/Q8eHz7x9fVPnjW75v5Fv+NrXASz\nqdAyK5cZPwgspOFznZNWnQGzmT1spmvJoKgusVCkAG/dCPExu6shfgoGptCrFo3i\neTQwZBQWbEXOWb7dXaq6Y9n4CDPlxchqLTBcxQQpBjA+IW0ZKJIxmR9MqgH8To98\nJKMSpZKVbx2Zsq0s3QJyaVcCAwEAAQ==\n-----END PUBLIC KEY-----\n',
              passphrase: 'lectherapy',
              expiresIn: '2 days'
            }
          }
        }
      }
    },
    //   ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ ██╗   ██╗██████╗ ███████╗    
    //  ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ ██║   ██║██╔══██╗██╔════╝    
    //  ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗██║   ██║██████╔╝█████╗      
    //  ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║██║   ██║██╔══██╗██╔══╝      
    //  ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝╚██████╔╝██║  ██║███████╗    
    //   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝    
    //                                                                              
    //  ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗          
    //  ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║          
    //  █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║          
    //  ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║          
    //  ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║          
    //  ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝          
    //                                                                              
    configure: function () {
      sails.log.silly('BASE API HOOK: Initializing custom policies')
      //  ┌─┐┬ ┬┌─┐┌┬┐┌─┐┌┬┐  ┌─┐┌─┐┬  ┬┌─┐┬┌─┐┌─┐
      //  │  │ │└─┐ │ │ ││││  ├─┘│ ││  ││  │├┤ └─┐
      //  └─┘└─┘└─┘ ┴ └─┘┴ ┴  ┴  └─┘┴─┘┴└─┘┴└─┘└─┘
      // Source: https://github.com/balderdashy/sails/blob/c7900af9864a10bde3fdc83097d99b82cddc713a/test/integration/fixtures/hooks/installable/add-policy/index.js#L48
      const policiesNames = Object.keys(policies)
      for (const policyName of policiesNames) {
        sails.hooks.policies.middleware[policyName.toLowerCase()] = policies[policyName];
      }
    },
    //  ██╗  ██╗ ██████╗  ██████╗ ██╗  ██╗                                                    
    //  ██║  ██║██╔═══██╗██╔═══██╗██║ ██╔╝                                                    
    //  ███████║██║   ██║██║   ██║█████╔╝                                                     
    //  ██╔══██║██║   ██║██║   ██║██╔═██╗                                                     
    //  ██║  ██║╚██████╔╝╚██████╔╝██║  ██╗                                                    
    //  ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝                                                    
    //                                                                                        
    //  ██╗███╗   ██╗██╗████████╗██╗██╗     ██╗███████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
    //  ██║████╗  ██║██║╚══██╔══╝██║██║     ██║╚══███╔╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
    //  ██║██╔██╗ ██║██║   ██║   ██║██║     ██║  ███╔╝ ███████║   ██║   ██║██║   ██║██╔██╗ ██║
    //  ██║██║╚██╗██║██║   ██║   ██║██║     ██║ ███╔╝  ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
    //  ██║██║ ╚████║██║   ██║   ██║███████╗██║███████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
    //  ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝╚══════╝╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
    //          
    // https://sailsjs.com/documentation/concepts/extending-sails/hooks/hook-specification/initialize                                                                              
    initialize: (cb) => {
      var eventsToWaitFor = ['hook:orm:loaded', 'hook:organics:loaded', 'hook:blueprints:loaded'];
      sails.after(eventsToWaitFor, function () {
        //  ┌─┐┌┐┌┌─┐┌┬┐┬ ┬┌─┐┬─┐  ┬ ┬┌─┐┌─┐┬┌─  ┌┬┐┌─┐┌─┐┌─┐┌┐┌┌┬┐┌─┐┌┐┌┌─┐┬┌─┐┌─┐
        //  ├─┤││││ │ │ ├─┤├┤ ├┬┘  ├─┤│ ││ │├┴┐   ││├┤ ├─┘├┤ │││ ││├┤ ││││  │├┤ └─┐
        //  ┴ ┴┘└┘└─┘ ┴ ┴ ┴└─┘┴└─  ┴ ┴└─┘└─┘┴ ┴  ─┴┘└─┘┴  └─┘┘└┘─┴┘└─┘┘└┘└─┘┴└─┘└─┘
        // if we already have the 'loaded' event, why are we checking in the hooks?
        /*
        // INFO: This hook relies on blueprints, orm and organics hooks
        if (!sails.config.hooks.blueprints) {
          return cb('Cannot load api utils hook without `blueprints` hook enabled!');
        }
        // ORM is core as of 1
        if (!sails.config.hooks.orm) {
          return cb('Cannot load api utils hook without `orm` hook enabled!');
        }
        // INFO: Just for the checkPassword function used by login in passport
        if (!sails.config.hooks.organics) {
          return cb('Cannot load api utils hook without `organics` hook enabled!');
        }
        */
        sails.log.silly('BASE API HOOK: Initializing passport jwt strategy')

        //   ┬┬ ┬┌┬┐  ┌─┐┌┬┐┬─┐┌─┐┌┬┐┌─┐┌─┐┬ ┬  
        //   ││││ │   └─┐ │ ├┬┘├─┤ │ ├┤ │ ┬└┬┘  
        //  └┘└┴┘ ┴   └─┘ ┴ ┴└─┴ ┴ ┴ └─┘└─┘ ┴   
        //  ┌─┐┌─┐┌┐┌┌─┐┬┌─┐┬ ┬┬─┐┌─┐┌┬┐┬┌─┐┌┐┌ 
        //  │  │ ││││├┤ ││ ┬│ │├┬┘├─┤ │ ││ ││││ 
        //  └─┘└─┘┘└┘└  ┴└─┘└─┘┴└─┴ ┴ ┴ ┴└─┘┘└┘ 
        // MORE INFO: Reed last few lines inside passport/passport.js
        passport.configJwtStrategy(sails, passport)

        // Configure I18N
        i18n.configure({
          locales: ['en', 'es', 'fr'],
          directory: __dirname + '/locales'
        });

        // Finish initializing custom hook
        // Then call cb()
        return cb();

      });
    },
    //  ┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┬─┐┌┬┐  ┬┌┐┌┌─┐┌┬┐┌─┐┌┐┌┌─┐┌─┐
    //  ├─┘├─┤└─┐└─┐├─┘│ │├┬┘ │   ││││└─┐ │ ├─┤││││  ├┤ 
    //  ┴  ┴ ┴└─┘└─┘┴  └─┘┴└─ ┴   ┴┘└┘└─┘ ┴ ┴ ┴┘└┘└─┘└─┘
    // INFO: This will be available in sails.hook.apiUtils.passport
    passport,
    //  ┌─┐┬ ┬┌─┐┌┬┐┌─┐┌┬┐  ┌┐ ┬  ┬ ┬┌─┐┌─┐┬─┐┬┌┐┌┌┬┐  ┌┬┐┌─┐┌┬┐┬ ┬┌─┐┌┬┐┌─┐
    //  │  │ │└─┐ │ │ ││││  ├┴┐│  │ │├┤ ├─┘├┬┘││││ │   │││├┤  │ ├─┤│ │ ││└─┐
    //  └─┘└─┘└─┘ ┴ └─┘┴ ┴  └─┘┴─┘└─┘└─┘┴  ┴└─┴┘└┘ ┴   ┴ ┴└─┘ ┴ ┴ ┴└─┘─┴┘└─┘
    // INFO: This will be available in sails.hook.apiUtils.customBlueprint
    customBlueprint: {
      find: methodFind
    },
    //   ██████╗██╗   ██╗███████╗████████╗ ██████╗ ███╗   ███╗                                                 
    //  ██╔════╝██║   ██║██╔════╝╚══██╔══╝██╔═══██╗████╗ ████║                                                 
    //  ██║     ██║   ██║███████╗   ██║   ██║   ██║██╔████╔██║                                                 
    //  ██║     ██║   ██║╚════██║   ██║   ██║   ██║██║╚██╔╝██║                                                 
    //  ╚██████╗╚██████╔╝███████║   ██║   ╚██████╔╝██║ ╚═╝ ██║                                                 
    //   ╚═════╝ ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝                                                 
    //                                                                                                         
    //  ██████╗ ███████╗███████╗██████╗  ██████╗ ███╗   ██╗███████╗███████╗███████╗                            
    //  ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔════╝██╔════╝                            
    //  ██████╔╝█████╗  ███████╗██████╔╝██║   ██║██╔██╗ ██║███████╗█████╗  ███████╗                            
    //  ██╔══██╗██╔══╝  ╚════██║██╔═══╝ ██║   ██║██║╚██╗██║╚════██║██╔══╝  ╚════██║                            
    //  ██║  ██║███████╗███████║██║     ╚██████╔╝██║ ╚████║███████║███████╗███████║                            
    //  ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚══════╝╚══════╝                            
    //                                                                                                         
    //   ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ ██╗   ██╗██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
    //  ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ ██║   ██║██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
    //  ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗██║   ██║██████╔╝███████║   ██║   ██║██║   ██║██╔██╗ ██║
    //  ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║██║   ██║██╔══██╗██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
    //  ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝╚██████╔╝██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
    //   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
    //                                                                                                         
    // https://sailsjs.com/documentation/concepts/extending-sails/hooks/hook-specification/routes

    routes: {
      before: {
        /**
         * Add custom response methods to `res`.
         *
         * @param {Request} req
         * @param {Response} res
         * @param  {Function} next
         * @api private
         */
        // INFO: With this method you can add anything you want to request an response objects,
        // cause its like a middleware
        // INFO: This responses will be available in res.customResponseName
        'all /*': function addResponseMethods(req, res, next) {

          // Attach custom responses to `res` object
          // Provide access to `req` and `res` in each of their `this` contexts.
          _.each(responses, function eachMethod(responseFn, name) {
            res[name] = responseFn.bind({
              req: req,
              res: res
            });
          });

          // Proceed!
          return next();
        }
      }
    }
  }
}
