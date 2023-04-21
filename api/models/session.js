const mongoose = require('mongoose');
const Joi = require('joi');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  programId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  link: {
    type: String,
    required: true
  },
  duration: {
    type: Date,
    required: true
  },
  status: { 
    type: String,
    enum: ['ongoing', 'completed', 'cancelled', 'schedule'],
  },
});


const Session = mongoose.model('Session', sessionSchema);

function validateSession(session) {
  
  const schema = Joi.object({
    title: Joi.string().required(),
    link: Joi.string().required(),
    programId: Joi.string().required(),
    duration: Joi.date().required(),
    status: Joi.string().valid('ongoing', 'completed', 'cancelled', 'schedule'),
  });

  return schema.validate(session);
}

exports.Session = Session;
exports.validate = validateSession;
