const mongoose = require('mongoose');
const Joi = require('joi');

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
  announcements: [{
    content: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  ratings: {
    type: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      value: { type: Number, min: 1, max: 5 },
      comment: { type: String }
    }]
  }
});

programSchema.methods.calculateRating  = function() {
  if (this.ratings.length === 0)
    return 0;
  
  let totalRating = 0;
  this.ratings.forEach(rating => {
      totalRating += rating.value;
  });
  
  return totalRating / this.ratings.length;
};

programSchema.post('updateOne', async function(doc, next) {
  if (doc._update.$push && doc._update.$push.announcements) {
    const programId = doc._conditions._id;
    const program = await Program.findById(programId).populate('mentor');
    const announcement = program.announcements[program.announcements.length - 1];
    const studentIds = program.students;
    for (let studentId of studentIds) {
      const student = await Student.findById(studentId);
      const notification = {
        content: `New announcement in "${program.title}" by ${program.mentor.username}: ${announcement.content}`,
        createdAt: Date.now()
      };
      student.notifications.push(notification);
      await student.save();
    }
  }
  next();
});

const Program = mongoose.model('Program', programSchema);

function validateProgram(program) {
  
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    topics: Joi.array().items(Joi.string()),
    duration: Joi.object({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }),
    mentor: Joi.string().required(),
    students: Joi.array().items(Joi.string()),
    announcements: Joi.array().items(
      Joi.object({
        content: Joi.string().required(),
        createdAt: Joi.date().default(Date.now),
      })
    ),
    ratings: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),
        value: Joi.number().integer().min(1).max(5).required(),
        comment: Joi.string(),
      })
    ),
  });
  
  return schema.validate(program);
}

exports.Program = Program;
exports.validate = validateProgram;
