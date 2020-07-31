const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const { dateToISOString } = require('../../helpers/date');
const { events } = require('./merge');

module.exports = {
  //resolvers
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
};
