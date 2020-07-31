const express = require('express');
const bodyPaser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongooes = require('mongoose');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResovlers = require('./graphql/resolvers/index');

const app = express();
app.use(bodyPaser.json());

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

const PORT = 3000;
const mongodbUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ubmg3.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`;
mongooes
  .connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3000, console.log(`Start server at port ${PORT}`));
  })
  .catch((err) => console.log(err));
