var schema = require('./schema.js');
module.exports.validate = function(req) {
  if(schema.datasources[req.params.datasource]) {
    if(schema.datasources[req.params.datasource].measurements[req.params.measurement]) {
      var requiredFilters = schema.datasources[req.params.datasource].measurements[req.params.measurement].filter.required;
      for(var queryKey in requiredFilters) {
        if(!req.query[requiredFilters[queryKey]]) {
          return "Missing required filter '" + requiredFilters[queryKey] + "''";
        }
      }
      if(req.query.start && req.query.end && req.query.interval) {
        return null;
      } else {
        return "Missing time related query key";
      }
    } else {
      return "No measurement by this name";
    }
  } else {
    return "No datasource by this name";
  }
}
