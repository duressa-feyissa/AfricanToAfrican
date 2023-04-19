const Joi = require('joi');
const authenticate = require('../middleWare/authentication');
const authorize = require('../middleWare/authorization');
const { Student } = require('../models/student');
const { Mentor } = require('../models/mentor');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.get('/me', authenticate, authorize(['Mentor', 'Student']), async (req, res) => {
  const role = req.user.role;
  let user;
  if (role == 'Mentor') {
    user = await Mentor.findById(req.user._id).select('-password');
  } else if (role == 'Student') {
    user = await Student.findById(req.user._id).select('-password');
  }
  res.send(user);
});

router.post('/auth', async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send(error.details[0].message);
  
  const role = req.body.role;
  const email = req.body.email;
  const password = req.body.password;
  
  let user;
  if (role == 'Mentor') {
    user = await Mentor.findOne({email: email});
  } else if (role == 'Student') {
    user = await Student.findOne({email: email});
  } 
  if (!user)
    return res.status(400).send('Invalid email or password');
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).send('Invalid email or password');
  const token = user.generateToken();
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(100).required().email(),
    role: Joi.string().valid('Mentor', 'Student'),
    password: Joi.string().min(5).max(100).required(),
  });
  return schema.validate(req);
}

module.exports = router;

