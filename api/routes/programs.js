const { Program, validate } = require('../models/program');
const mongoose = require('mongoose');
const upload = require('../middleWare/upload');
const authenticate = require('../middleWare/authentication');
const authorize = require('../middleWare/authorization');
const express = require('express');
const router = express.Router();

router.get('/', authenticate, authorize(['Mentor']), async (req, res) => {
  const programs = await Program.find({mentor: req.user._id});
  res.send(programs);
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send('Invalid program Id');

  const program = await Program.findById(req.params.id);
  if (!program)
    return res.status(404).send('Program not found');  
  res.send(program);
});

router.post('/', authenticate, authorize(['Mentor']), async (req, res) => {
  const { error } = validate(req.body);
  if (error) 
    return res.status(400).send(error.details[0].message);

  const { title, description, topics, duration, mentor } = req.body;

  let program = new Program({
      title,
      description,
      topics,
      duration,
      mentor,
  });
  program = await program.save();
  res.send(program);
});

router.delete('/:id', authenticate, authorize(['Mentor']), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send('Invalid program Id');

  const program = await Program.findByIdAndRemove(req.params.id)
  if (!program)
    return res.status(404).send('Program not found');  
  res.send(program);
});



router.post('/:id/announcements', authenticate, authorize(['Mentor']), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send('Invalid program Id');

  const { content } = req.body;
  const program = await Program.findById(req.params.id);

  if (!program)
    return res.status(404).send('Program not found');
    
  const announcement = {
    content,
    createdAt: Date.now(),
  };

  program.announcements.push(announcement);
  await program.save();
  res.json(program.announcements);
});


router.post('/programs/:id/ratings', async (req, res) => {
  const { value, comment } = req.body;
  
  const program = await Program.findById(req.params.id);
  if (!program)
    return res.status(404).send('Program not found');

  const rating = {
    user: req.user._id,
    value,
    comment,
  };
  program.ratings.push(rating);
  await program.save();
  res.json(program.ratings);
});

router.put('/programs/:id', authenticate, authorize(['Mentor']), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send('Invalid program Id');

  const { error } = validate(req.body);
  if (error) 
    return res.status(400).send(error.details[0].message);

  const { title, description, topics, duration, mentor } = req.body;

  const program = await Program.findByIdAndUpdate(
    req.params.id,
    { title, description, topics, duration, mentor },
    { new: true }
  );

  if (!program)
    return res.status(404).send('Program not found');

  res.send(program);
});

router.delete('/programs/:id', authenticate, authorize(['Mentor']), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send('Invalid program Id');

  const program = await Program.findByIdAndRemove(req.params.id);

  if (!program)
    return res.status(404).send('Program not found');

  res.send(program);
});


router.put('/programs/:programId/announcements/:announcementId', authenticate, authorize(['Mentor']), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.programId) || !mongoose.isValidObjectId(req.params.announcementId))
    return res.status(400).send('Invalid ID');

  const program = await Program.findById(req.params.programId);
  if (!program)
    return res.status(404).send('Program not found');

  const announcement = program.announcements.id(req.params.announcementId);
  if (!announcement)
    return res.status(404).send('Announcement not found');

  announcement.content = req.body.content;
  await program.save();
  res.json(program.announcements);
});


router.delete('/programs/:programId/announcements/:announcementId', authenticate, authorize(['Mentor']), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.programId) || !mongoose.isValidObjectId(req.params.announcementId))
    return res.status(400).send('Invalid ID');

  const program = await Program.findById(req.params.programId);
  if (!program)
    return res.status(404).send('Program not found');

  const announcement = program.announcements.id(req.params.announcementId);
  if (!announcement)
    return res.status(404).send('Announcement not found');

  announcement.remove();
  await program.save();
  res.json(program.announcements);
});


router.put('/programs/:programId/ratings/:ratingId', authenticate, authorize(['Student']), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.programId) || !mongoose.isValidObjectId(req.params.ratingId))
    return res.status(400).send('Invalid ID');

  const program = await Program.findById(req.params.programId);
  if (!program)
    return res.status(404).send('Program not found');

  const rating = program.ratings.id(req.params.ratingId);
  if (!rating)
    return res.status(404).send('Rating not found');

  if (!rating.user.equals(req.user._id))
    return res.status(401).send('Unauthorized');

  rating.value = req.body.value;
  rating.comment = req.body.comment;
  await program.save();
  res.json(program.ratings);
});


router.delete('/programs/:programId/ratings/:ratingId', authenticate, authorize(['Student']), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.programId) || !mongoose.isValidObjectId(req.params.ratingId))
    return res.status(400).send('Invalid ID');

  const program = await Program.findById(req.params.programId);
  if (!program)
    return res.status(404).send('Program not found');

  const rating = program.ratings.id(req.params.ratingId);
  if (!rating)
    return res.status(404).send('Rating not found');

  if (!rating.user.equals(req.user._id))
    return res.status(401).send('Unauthorized');

  rating.remove();
  await program.save();
  res.json(program.ratings);
});

module.exports = router;

