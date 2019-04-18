require('./.env')
const express = require("express");
const {postgraphile, makePluginHook} = require("postgraphile");

const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const PGDBI = require('postgraphile-db-inspector-extension')
const pgdbiPluginHook = makePluginHook([PGDBI]);

const connection = process.env.POSTGRES_CONNECTION
const port = process.env.PORT || 7777
const schemas = [ 'information_schema' ]
const disableDefaultMutations = false
const watchPg = false

const app = express();

app.use(postgraphile(
  connection
  ,schemas
  ,{
    pgdbiPluginHook
    ,dynamicJson: true
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

app.listen(port)

/*
 * When being used in nodemon, SIGUSR2 is issued to restart the process. We
 * listen for this and shut down cleanly.
 */
process.once('SIGUSR2', function () {
  server.close();
  const t = setTimeout(function () {
    process.kill(process.pid, 'SIGUSR2');
  }, 200);
  // Don't prevent clean shutdown:
  t.unref();
});

console.log(`listening on ${port}`)

