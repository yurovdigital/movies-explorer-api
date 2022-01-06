const mongoose = require('mongoose');
const { isURL } = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (i) => isURL(i),
      message: 'Поле должно содержать URL',
    },
    trailer: {
      type: String,
      required: true,
      validate: {
        validator: (i) => isURL(i),
        message: 'Поле должно содержать URL',
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (i) => isURL(i),
        message: 'Поле должно содержать URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      rew: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model('movies', movieSchema);
