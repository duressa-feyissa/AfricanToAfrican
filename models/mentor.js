const mongoose = require('mongoose');
const Joi = require('joi');

const mentorSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String,
    required: true,
    unique: true
  },
  expertise: {   
    type: [String]
  },
  programs: { 
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'Program' 
  },
  role: {
    type: String,
    default: 'Mentor'
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 100,
    required: true
  },
  image: {
    type: String,
    default: 'user.png' 
  }
});

const Mentor = mongoose.model('Mentor', mentorSchema);

function validateMentor(mentor) {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    expertise: Joi.array().items(Joi.string()),
    programs: Joi.array().items(Joi.objectId()),
    role: Joi.string().default('Mentor'),
    password: Joi.string().min(6).max(100).required(),
    image: Joi.string().default('user.png')
  });
  return schema.validate(mentor);
}

exports.Mentor = Mentor;
exports,validate = validateMentor;


