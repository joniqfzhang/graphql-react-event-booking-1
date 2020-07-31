const { dateToISOString } = require('../../helpers/date');
const { transformEvent } = require('./merge');
const Event = require('../../models/event');
const User = require('../../models/user');

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
};
