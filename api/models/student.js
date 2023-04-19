const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi'); 
const config = require('config');

const studentSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  password: { 
    type: String, 
    required: true 
  },
  enrolled: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'Program' 
  },
  image: {
    type: String,
    default: 'user.png'
  },
  notifications: [{
      content: { type: String },
      createdAt: { type: Date, default: Date.now },
      isRead: { type: Boolean, default: false }
  }]
});

studentSchema.methods.generateToken = function () {
  const data = {
      _id: this._id, 
      username: this.firstName, 
      role: this.role,
      image: this.image,
  }
  const token = jwt.sign(data, config.get('API_Private_Key'));
  return token;
}
const Student = mongoose.model('Student', studentSchema);

function validateStudent(student) {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    enrolled: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)),
    image: Joi.string(),
    notifications: Joi.array().items(Joi.object({
      content: Joi.string().required(),
      createdAt: Joi.date().default(Date.now),
      isRead: Joi.boolean().default(false)
    }))
  });
  return schema.validate(student);
}

exports.Student = Student;
exports.validate = validateStudent
