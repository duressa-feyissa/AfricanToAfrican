const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi'); 
const config = require('config');

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
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Student'
  },
  posts: [{
    title: { 
      type: String,
      required: true
     },
    content: { 
      type: String,
      required: true
    },
    image: {
      type: String
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }]
});

mentorSchema.methods.generateToken = function () {
  const data = {
      _id: this._id, 
      username: this.firstName, 
      role: this.role,
      image: this.image,
  }
  const token = jwt.sign(data, config.get('API_Private_Key'));
  return token;
}

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

function validatePost(post) {
  
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    image: Joi.string(),
    createdAt: Joi.date().default(Date.now),
    comment: Joi.array().items(Joi.string())
  });
  return schema.validate(post);
}

async function calculateProgramRatingsForMentor(mentorId) {
  
  const mentorPrograms = await Mentor.findById(mentorId).populate('programs');
  const programRatings = {};

  for (let program of mentorPrograms.programs) {
    const programWithRatings = await Program.findById(program._id).populate('ratings.user');

    const programAverageRating = programWithRatings.ratings.reduce((total, rating) => total + rating.value, 0) / programWithRatings.ratings.length;

    programRatings[programWithRatings.title] = programAverageRating;
  }

  return programRatings;
}


exports.Mentor = Mentor;
exports.validate = validateMentor;
exports.calculate = calculateProgramRatingsForMentor;
exports.validatePost = validatePost;

