const express = require('express');
const router = express.Router();
const authenticate = require('../middleWare/authentication');
const authorize = require('../middleWare/authorization');
const { Program } = require('../models/program');
const { Session, validate } = require('../models/session');

router.get('/', async (req, res) => {
  const sessions = await Session.find();
  res.status(200).send(sessions);
});

router.get('/:id', async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) 
    return res.status(404).send('Session not found');
  res.status(200).send(session);
});

router.post('/',  authenticate, authorize(['Mentor']), async (req, res) => {
  const { error } = validate(req.body);
  if (error) 
    return res.status(400).send(error.details[0].message);  
  const { title, programId, link, duration, status } = req.body;

  if (!mongoose.isValidObjectId(programId))
    return res.status(400).send('Invalid program Id');
  
  let program = await Program.findById(programId);
  if (!program)
      return res.status(404).send('Program not found');

  const session = new Session({
    title,
    programId,
    link,
    duration,
    status
  });
  await session.save();
  res.status(201).send(session);
});

router.put('/:id',  authenticate, authorize(['Mentor']), async (req, res) => {
  const { error } = validate(req.body);
  if (error) 
    return res.status(400).send(error.details[0].message);  

  const { title, programId, link, duration, status } = req.body;
  if (!mongoose.isValidObjectId(programId))
    return res.status(400).send('Invalid program Id');
  
  let program = await Program.findById(programId);
  if (!program)
      return res.status(404).send('Program not found');

  const session = await Session.findByIdAndUpdate(req.params.id, {
    title,
    programId,
    link,
    duration,
    status
  }, { new: true });
  if (!session) 
      return res.status(404).send('Session not found'); 
  res.status(200).send(session);
});

router.delete('/:id',  authenticate, authorize(['Mentor']), async (req, res) => {
  const session = await Session.findByIdAndRemove(req.params.id);
  if (!session) 
    return res.status(404).send('Session not found');
  res.status(204).send(session);
});

module.exports = router;
