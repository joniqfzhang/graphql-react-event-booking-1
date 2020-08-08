const express = require('express');
const bodyPaser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongooes = require('mongoose');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResovlers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();
app.use(bodyPaser.json());
app.use((req, res, next) => {
  //config cors access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Method', 'POST,GET,OPTIONS'); //browsers send options before send post
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  if (req.method === 'OPTIONS') {
    //graphql cannot handle options correctly
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth); // will run in very incoming request, and can access req.isAuth

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResovlers,
    graphiql: true,
  })
);

app.get('/', (req, res, next) => {
  res.send('Hello world!');
});

const PORT = 8000;
const mongodbUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ubmg3.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`;
mongooes
  .connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, console.log(`Start server at port ${PORT}`));
  })
  .catch((err) => console.log(err));
