const express = require('express');
const router = express.Router();
const authenticate = require('../middleWare/authentication');
const authorize = require('../middleWare/authorization');
const { Topic, validate } = require('../models/topic');

router.get('/', async (req, res) => {
  const topics = await Topic.find();
  res.json(topics);
});

router.get('/:id', async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  if (!topic) 
    return res.status(404).send('Tpoic not found');
  res.status(200).send(topic);
});

router.post('/', authenticate, authorize(['Mentor']), async (req, res) => {
  const { error } = validate(req.body);
  if (error) 
    return res.status(400).send(error.details[0].message);  

  const topic = new Topic({
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration,
    resources: req.body.resources
  });
  const newTopic = await topic.save();
  res.status(201).send(newTopic);
});


router.delete('/:id', authenticate, authorize(['Mentor']), async (req, res) => {
  const session = await Topic.findByIdAndRemove(req.params.id);
  if (!session) 
    return res.status(404).send('Session not found');
  res.send(session)
});

module.exports = router;
