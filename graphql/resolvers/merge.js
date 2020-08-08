const { dateToISOString } = require('../../helpers/date');
const Event = require('../../models/event');
const User = require('../../models/user');
const Dataloader = require('dataloader');

const eventLoader = new Dataloader((enentIds) => {
  return events(enentIds);
});

const userLoader = new Dataloader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString()); // User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents), //() => eventLoader.loadMany(user._doc.createdEvents), //events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw error;
  }
};

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    // events order synchranize with eventIds order to match dataloder request
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId); //eventLoader.load(eventId.toString()); //
    //console.log('singleEvent', event);
    if (event == null) {
      // take care delete event but linked with booking
      return {
        _id: eventId,
        title: 'DELETE',
        description: 'DELETE',
        price: 0,
        date: new Date().toLocaleDateString(),
        user: {},
      };
    }
    return transformEvent(event); //updated by enentLoader
  } catch (err) {
    throw err;
  }
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToISOString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};

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
//exports.user = user;
exports.events = events;
//exports.singleEvent = singleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
