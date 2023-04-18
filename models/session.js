const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  programId: { 
    type: mongoose.Schema.Types.ObjectId, 
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

const session = mongoose.model('session', sessionSchema);

function validateSession(progrma) {
  
  const schema = Joi.object({
    title: Joi.string().required(),
    programId: Joi.objectId().required(),
    duration: Joi.object({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }).required(),
    status: Joi.string().valid('ongoing', 'completed', 'cancelled').required(),
  });
  return schema.validate(progrma);
}

exports.session = session;
exports.validate = validateSession;
