const { dateToISOString } = require('../../helpers/date');
const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
  //resolvers
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        // console.log('booking._doc:', booking._doc);
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    //console.log(fetchedEvent);
    const booking = new Booking({
      event: fetchedEvent,
      user: req.userId,
    });
    //const eventCreator = fetchedEvent.creator;
    const result = await booking.save();
    //console.log('result._doc:', result._doc);
    const savedBooking = await Booking.findById({
      _id: req.userId,
    });
    //console.log('savedBooking', savedBooking);
    return transformBooking(result);
  },
  cancelBooking: async ({ bookingId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const booking = await Booking.findById(bookingId).populate('event');
      let event = booking.event;
      try {
        event = transformEvent(booking.event);
      } catch (err) {
        // deal with booking however event already deleted
        event = {
          _id: bookingId,
          title: 'not exist any more',
          description: 'not exist any more',
          price: 0,
          date: new Date(),
          creator: {},
        };
      }

      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
