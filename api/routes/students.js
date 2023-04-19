const {Student, validate } = require('../models/student');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const upload = require('../middleWare/upload');
const authenticate = require('../middleWare/authentication');
const authorize = require('../middleWare/authorization');
const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {
  const student = await Student.find().select('-password');
  res.send(student);
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({error: 'Invalid student Id'}); 
  
  let student = await Student.findById(req.params.id).select('-password');

  if (!student)
      return res.status(404).json({error: 'student not found'});
  res.json(student);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) 
    return res.status(400).json({error :error.details[0].message});
  
  let student = await Student.findOne({email: req.body.email}); 
  if (student)
    return res.status(400).json({error: 'student already registered!'});

  student = new Student(_.pick(req.body, ['username','email', 'password']));
  const salt = await bcrypt.genSalt(10);
  student.password = await bcrypt.hash(student.password, salt);
  student = await student.save();
  const token = student.generateToken();
  student = _.omit(student.toObject(), 'password');
  res.header('x-auth-token', token).json(student);
});

router.put('/:id', authenticate, authorize(['Student']),  async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send('Invalid student Id');
  
  let student = await Student.findById(req.params.id).select('-password');

  if (!student)
      return res.status(404).send('student not found');
  
  if (!req.body.username)
    return res.status(400).send('required student username');
  student.username = req.body.username;
  student = await student.save();
  student = _.omit(student.toObject(), 'password');
  res.send(student);
});

router.post('/:id/image', authenticate, authorize(['Student']), upload.single('image'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send('Invalid customer Id');
  
  let student = await Student.findById(req.params.id);
  if (!student)
      return res.status(404).json({ error: 'student not found' });
  
  const file = req.file;
  const newImage = req.file.filename;

  if (!file)
      return res.status(400).send('No file found');
  student.image = newImage;
  student = await student.save();
  res.status(200).send('Profile image uploaded successfully');
});

router.post('/enroll', authenticate, authorize(['Student']), async (req, res) => {
  const { programId } = req.body;

  if (!mongoose.isValidObjectId(programId))
    return res.status(400).send('Invalid program Id');

  const program = await Program.findById(programId);

  if (!program)
    return res.status(404).send('Program not found');

  const student = await Student.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { enrolled: programId } },
    { new: true }
  );

  if (!student)
    return res.status(404).send('Student not found');

  res.json(student);
});

router.delete('/students/:studentId/enrolled/:programId', authenticate, async (req, res) => {
  const { studentId, programId } = req.params;

  if (!mongoose.isValidObjectId(studentId) || !mongoose.isValidObjectId(programId)) {
    return res.status(400).send('Invalid student or program Id');
  }

  const student = await Student.findById(studentId).populate('enrolled');

  if (!student) {
    return res.status(404).send('Student not found');
  }

  const programIndex = student.enrolled.findIndex(p => p._id.toString() === programId);

  if (programIndex === -1) {
    return res.status(404).send('Program not found in student enrollment');
  }

  student.enrolled.splice(programIndex, 1);

  await student.save();

  res.send(student.enrolled);
});

module.exports = router;
