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
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  status: { 
    type: String,
    enum: ['ongoing', 'completed', 'cancelled'],
    required: true 
  },
});

const session = mongoose.model('Session', sessionSchema);

function validateSession(session) {
  
  const schema = Joi.object({
    title: Joi.string().required(),
    programId: Joi.string().required(),
    duration: Joi.object({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }).required(),
    status: Joi.string().valid('ongoing', 'completed', 'cancelled').required(),
  });

  return schema.validate(session);
}

exports.session = session;
exports.validate = validateSession;
