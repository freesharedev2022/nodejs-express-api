const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const app = express();

app.use(cors())
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
require('dotenv').config()

let app_port = process.env.SERVER_PORT || 5000;

const app_host = process.env.SERVER_DOMAIN || 'localhost:5000'

const init_swagger = () => {
  const expressSwagger = require('express-swagger-generator')(app);

  let options = {
    explorer: true,
    swaggerDefinition: {
      info: {
        description: 'RESFULL API',
        title: 'RESFULL API',
        version: '1.0',
      },
      host: app_host,
      basePath: '/api',
      produces: [
        "application/json",
        "application/xml"
      ],
      schemes: ['http', 'https'],
      securityDefinitions: {
        JWT: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: '',
        }
      }
    },
    basedir: __dirname,
    files: ['./routes/*.ts']
  };
  expressSwagger(options);
};

init_swagger();


const userModel  = require('./schema/user')

let server = null
async function startServer() {
  server = new ApolloServer({
    modules: [
      userModel
    ],
  })
  // @ts-ignore
  server.applyMiddleware({app})
}
startServer()

app.get('/', (_req, res) => {
  res.send('Success !')
})

require('./routes/user')(app)

app.listen(app_port);
console.log('Docs:', 'http://' + app_host + '/api-docs');
// @ts-ignore
console.log(`🚀 Server ready at http://${app_host}${server.graphqlPath}`)
