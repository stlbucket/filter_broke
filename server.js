require('./.env')
const express = require("express");
const {postgraphile} = require("postgraphile");

const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");

const connection = process.env.POSTGRES_CONNECTION
const pgdbiPort = process.env.PGDBI_PORT || 6099
const schemas = [ 'information_schema' ]
const disableDefaultMutations = false
const watchPg = false

const app = express();

app.use(postgraphile(
  connection
  ,schemas
  ,{
    dynamicJson: true
    ,enableCors: true
    ,showErrorStack: true
    ,extendedErrors: ['severity', 'code', 'detail', 'hint', 'positon', 'internalPosition', 'internalQuery', 'where', 'schema', 'table', 'column', 'dataType', 'constraint', 'file', 'line', 'routine']
    ,disableDefaultMutations: disableDefaultMutations
    ,appendPlugins: [ConnectionFilterPlugin]
    ,watchPg: watchPg
    ,graphiql: true
    ,enhanceGraphiql: true
  }
));

app.listen(pgdbiPort)

console.log(`listening on ${pgdbiPort}`)

