const multerError = require('../middleWare/multer-error');
const cors = require('../middleWare/cors');
const express = require("express");
const auth = require('../routes/auth');
const mentors = require('../routes/mentors');
const students = require('../routes/students');
const sessions = require('../routes/sessions');
const programs = require('../routes/programs');
const topics = require('../routes/topics');
const error = require('../middleWare/error');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/mentors', mentors);
    app.use('/api/students', students);
    app.use('/api/sessions', sessions);
    app.use('/api/programs', programs);
    app.use('/api/topics', topics);
    app.use('/api/auth', auth);
    app.use(cors);
    app.use(multerError);
    app.use(error);
}