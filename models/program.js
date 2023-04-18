const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: {
    type: String,
    required: true,
  },
  topics: { 
    type: [mongoose.Schema.Types.ObjectId], 
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
  mentor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Mentor' 
  },
  students: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'Student'
  },
});

const Program = mongoose.model('Program', programSchema);

function validateProgram(progrma) {
  
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    topics: Joi.array().items(Joi.objectId()),
    duration: Joi.object({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }).required(),
    mentor: Joi.objectId().required(),
    students: Joi.array().items(Joi.objectId().optional()),
  });
  return schema.validate(progrma);
}

exports.Program = Program;
exports.validate = validateProgram;
