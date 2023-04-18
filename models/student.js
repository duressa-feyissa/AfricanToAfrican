const mongoose = require('mongoose');

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
    type: 'String',
    default: 'user.png'
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
