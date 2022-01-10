const router = require('express').Router();

const authRoutes = require('./auth');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const notFound = require('./not-found');

// middleweares
const auth = require('../middlewares/auth');

router.use('/', authRoutes);

router.use(auth);

router.use('/', usersRoutes);
router.use('/', moviesRoutes);
router.use(notFound);
