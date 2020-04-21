module.exports = function find (req, res) {
  // Source: https://github.com/balderdashy/sails/tree/master/lib/hooks/blueprints/actions/find.js
  var actionUtil = require('sails/lib/hooks/blueprints/actionUtil')
  var formatUsageError = require('sails/lib/hooks/blueprints/formatUsageError')

  var parseBlueprintOptions = req.options.parseBlueprintOptions || req._sails.config.blueprints.parseBlueprintOptions

  // Set the blueprint action for parseBlueprintOptions.
  req.options.blueprintAction = 'find'

  var queryOptions = parseBlueprintOptions(req)
  var Model = req._sails.models[queryOptions.using]

  Model
    .find(queryOptions.criteria, queryOptions.populates).meta(queryOptions.meta)
    .exec(function found (err, matchingRecords) {
      if (err) {
        // If this is a usage error coming back from Waterline,
        // (e.g. a bad criteria), then respond w/ a 400 status code.
        // Otherwise, it's something unexpected, so use 500.
        switch (err.name) {
          case 'UsageError': return res.badRequest(formatUsageError(err, req))
          default: return res.serverError(err)
        }
      }// -•

      // Socket considerations
      if (req._sails.hooks.pubsub && req.isSocket) {
        Model.subscribe(req, _.pluck(matchingRecords, Model.primaryKey))
        // Only `._watch()` for new instances of the model if
        // `autoWatch` is enabled.
        if (req.options.autoWatch) { Model._watch(req) }
        // Also subscribe to instances of all associated models
        _.each(matchingRecords, function (record) {
          actionUtil.subscribeDeep(req, record)
        })
      }// >-

      //  ┬┌┐┌┬┌─┐┬┌─┐  ┌─┐┌─┐┌┬┐┬┌─┐┌─┐  ┌─┐┬ ┬┌─┐┌┬┐┌─┐┌┬┐
      //  ││││││  ││ │  │  │ │ ││││ ┬│ │  │  │ │└─┐ │ │ ││││
      //  ┴┘└┘┴└─┘┴└─┘  └─┘└─┘─┴┘┴└─┘└─┘  └─┘└─┘└─┘ ┴ └─┘┴ ┴

      // Removes not valid criteria options for count method
      const countCriteria = _.omit(queryOptions.criteria, ['select', 'omit', 'limit', 'skip', 'sort'])

      // Executes count
      Model.count(countCriteria).exec(function count (err, numRecords) {
        // Default waterline example error handler
        if (err) {
          // If this is a usage error coming back from Waterline,
          // (e.g. a bad criteria), then respond w/ a 400 status code.
          // Otherwise, it's something unexpected, so use 500.
          switch (err.name) {
            case 'UsageError': return res.badRequest(formatUsageError(err, req))
            default: return res.serverError(err)
          }
        }// -•

        //  ┌─┐┌─┐┌─┐┬┌┐┌┌─┐┌─┐┬┌─┐┌┐┌
        //  ├─┘├─┤│ ┬││││├─┤│  ││ ││││
        //  ┴  ┴ ┴└─┘┴┘└┘┴ ┴└─┘┴└─┘┘└┘
        const pagination = {}
        // If there's not limit indication in query, set default blueprint limit
        if (queryOptions.criteria.limit === undefined) {
          pagination.perPage = sails.config.apiUtilsHook.blueprints.defaultLimit
        } else { // If there's a limit indication, uses it at perPage param
          pagination.perPage = queryOptions.criteria.limit
        }
        pagination.totalPages = Math.ceil(numRecords / pagination.perPage)
        pagination.totalEntries = numRecords
        //  ┌─┐┬┌┐┌  ┌─┐┌─┐┌─┐┬┌┐┌┌─┐┌─┐┬┌─┐┌┐┌
        //  ├┤ ││││  ├─┘├─┤│ ┬││││├─┤│  ││ ││││
        //  └  ┴┘└┘  ┴  ┴ ┴└─┘┴┘└┘┴ ┴└─┘┴└─┘┘└┘
        if (queryOptions.criteria.skip && queryOptions.criteria.skip % pagination.perPage !== 0) {
          return res.badRequest(
            new Error(`El parametro skip es invalido (se envió ${queryOptions.criteria.skip}), debe ser '0' o un múltiplo de limit (limitIndicado o default = ${pagination.perPage})`)
          )
        }
        // Return your custom response, you also can use res.json with custom format
        return res[sails.config.apiUtilsHook.blueprints.customMethodsResponses.find]({
          results: matchingRecords,
          pagination
        })
      })// </ .count().exec() >
      //  ┌─┐┬┌┐┌  ┌─┐┌─┐┌┬┐┬┌─┐┌─┐  ┌─┐┬ ┬┌─┐┌┬┐┌─┐┌┬┐
      //  ├┤ ││││  │  │ │ ││││ ┬│ │  │  │ │└─┐ │ │ ││││
      //  └  ┴┘└┘  └─┘└─┘─┴┘┴└─┘└─┘  └─┘└─┘└─┘ ┴ └─┘┴ ┴
    })// </ .find().exec() >
}
