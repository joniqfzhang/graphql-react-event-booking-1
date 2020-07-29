const express = require('express');
const bodyPaser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongooes = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();
app.use(bodyPaser.json());
//temp variable
//const events = [];
const user = (userId) => {
  return User.findById(userId)
    .then((user) => {
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents),
      };
    })
    .catch((err) => {
      throw error;
    });
};

const events = (eventIds) => {
  return (
    Event.find({ _id: { $in: eventIds } })
      // .then((events) => {
      //   return events;
      // })
      // .catch((err) => {
      //   throw err;
      // });
      .then((events) => {
        return events.map((event) => {
          return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event._doc.creator),
          };
        });
      })
      .catch((err) => {
        throw err;
      })
  );
};

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User!
        }
        type User {
          _id:ID!
          email: String!
          password: String
          createdEvents:[Event!]
        }
        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        input UserInput{
          email: String!
          password: String!
        }

        type RootQuery {
            events: [Event!]!
            users: [User!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery,
            mutation: RootMutation
        }
    `),
    rootValue: {
      //resolvers
      events: () => {
        return (
          Event.find()
            // .populate('creator')
            .then((events) => {
              //return events;
              return events.map((event) => {
                //return { ...event._doc, _id: event._doc._id.toString() };
                return {
                  ...event._doc,
                  _id: event.id,
                  creator: user.bind(this, event._doc.creator),
                };
              });
            })
            .catch((err) => {
              throw err;
            })
        );
      },
      users: () => {
        return User.find()
          .populate('createdEvents')
          .then((users) => {
            return users;
            // return events.map((event) => {
            //   return { ...event._doc, _id: event._doc._id.toString() };
            //   return { ...event._doc, _id: event.id };
            // });
          })
          .catch((err) => {
            throw err;
          });
      },
      createEvent: (args) => {
        // const event = {
        //   _id: Math.random().toString(),
        //   title: args.eventInput.title,
        //   description: args.eventInput.description,
        //   price: +args.eventInput.price,
        //   date: args.eventInput.date,
        // };
        // events.push(event);
        // console.log(args);
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: '5f2137d53da9277ac87a860f',
        });
        let createdEvent;
        return event
          .save()
          .then((result) => {
            //createdEvent = result;
            createdEvent = {
              ...result._doc,
              _id: result._doc._id.toString(),
              creator: user.bind(this, result._doc.creator),
            };
            //console.log(result);
            //return { ...result._doc };
            //return result;
            return User.findById('5f2137d53da9277ac87a860f');
          })
          .then((user) => {
            if (!user) {
              throw new Error('User dose not exist');
            }
            user.createdEvents.push(createdEvent); //user.createdEvents.push(event);
            return user.save();
          })
          .then((result) => {
            return createdEvent;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
        return event;
      },
      createUser: ({ userInput }) => {
        return User.findOne({ email: userInput.email })
          .then((user) => {
            if (user) {
              throw new Error('User exists already');
            }
            return bcrypt.hash(userInput.password, 12);
          })
          .then((hashedPassword) => {
            const user = new User({
              email: userInput.email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((result) => {
            return { ...result._doc, password: null };
          })
          .catch((err) => {
            throw err;
          });
      },
    },
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
