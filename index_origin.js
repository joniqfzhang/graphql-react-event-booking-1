const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { dateToISOString } = require('../../helpers/date');

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToISOString(booking._doc.createdAt),
    updatedAt: dateToISOString(booking._doc.updatedAt),
  };
};
const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToISOString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw error;
  }
};

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};
const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};
module.exports = {
  //resolvers
  events: async () => {
    try {
      let events = await Event.find();
      // .populate('creator')
      events = events.map((event) => {
        //return { ...event._doc, _id: event._doc._id.toString() };
        return transformEvent(event);
      });
      return events;
    } catch (err) {
      throw err;
    }
  },

  users: () => {
    return User.find()
      .populate('createdEvents')
      .then((users) => {
        //return users;
        return users.map((user) => {
          //return { ...event._doc, _id: event._doc._id.toString() };
          return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents),
          };
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        //console.log('booking._doc:', booking._doc);
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5f2137d53da9277ac87a860f',
    });

    try {
      const result = await event.save();

      const creator = await User.findById('5f2137d53da9277ac87a860f');
      if (!creator) {
        throw new Error('User dose not exist');
      }
      creator.createdEvents.push(result);
      await creator.save();

      const createdEvent = transformEvent(result);

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createUser: async ({ userInput }) => {
    try {
      const existingUser = await User.findOne({ email: userInput.email });
      if (existingUser) {
        throw new Error('User exists already');
      }

      const hashedPassword = await bcrypt.hash(userInput.password, 12);
      const newUser = new User({
        email: userInput.email,
        password: hashedPassword,
      });
      const result = await newUser.save();
      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    //console.log(fetchedEvent);
    const booking = new Booking({
      event: fetchedEvent,
      user: '5f2137d53da9277ac87a860f',
    });
    //const eventCreator = fetchedEvent.creator;
    const result = await booking.save();
    //console.log('result._doc:', result._doc);
    const savedBooking = await Booking.findById({
      _id: '5f22b3e6c0fc062bcc81a9d3',
    });
    //console.log('savedBooking', savedBooking);
    return transformBooking(result);
  },
  cancelBooking: async ({ bookingId }) => {
    try {
      const booking = await Booking.findById(bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
