const { Mentor, validate } = require('../models/mentor');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const upload = require('../middleWare/upload');
const authenticate = require('../middleWare/authentication');
const authorize = require('../middleWare/authorization');
const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {
  const mentor = await Mentor.find().select('-password');
  res.send(mentor);
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send('Invalid mentor Id');
  
  let mentor = await Mentor.findById(req.params.id).select('-password');

  if (!mentor)
      return res.status(404).send('Mentor not found');
  res.send(mentor);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) 
    return res.status(400).send(error.details[0].message);
  
  let mentor = await Mentor.findOne({email: req.body.email}); 
  if (mentor)
    return res.status(400).send('Mentor already registered!');

  mentor = new Mentor(_.pick(req.body, ['username','email', 'password']));
  const salt = await bcrypt.genSalt(10);
  mentor.password = await bcrypt.hash(mentor.password, salt);
  mentor = await mentor.save();
  const token = mentor.generateToken();
  mentor = _.omit(mentor.toObject(), 'password');
  res.header('x-auth-token', token).send(mentor);
});

router.put('/:id', authenticate, authorize(['Mentor']),  async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send('Invalid Mentor Id');
  
  let mentor = await Mentor.findById(req.params.id).select('-password');

  if (!mentor)
      return res.status(404).send('Mentor not found');
  
  if (!req.body.username)
    return res.status(400).send('required mentor username');
  mentor.username = req.body.username;
  mentor = await mentor.save();
  mentor = _.omit(mentor.toObject(), 'password');
  res.send(mentor);
});

router.post('/id:/image', authenticate, authorize(['Mentor']), upload.single('image'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send('Invalid mentor Id');
  
  let mentor = await Mentor.findById(req.params.id);
  if (!mentor)
      return res.status(404).json({ error: 'Mentor not found' });
  
  const file = req.file;
  const newImage = req.file.filename;

  if (!file)
      return res.status(400).send('No file found');
  mentor.image = newImage;
  mentor = await Mentor.save();
  res.status(200).send('Profile image uploaded successfully');
});

router.post('/:mentorId/posts', async (req, res) => {
  const mentor = await Mentor.findById(req.params.mentorId);
  if (!mentor)
    return res.status(404).send('Mentor not found');

  const { title, content, image } = req.body;
  const post = { title, content, image };
  mentor.posts.push(post);
  await mentor.save();
  res.status(201).send('Post created successfully');
});

router.get('/:mentorId/posts', async (req, res) => {
  const mentor = await Mentor.findById(req.params.mentorId);
  if (!mentor)
    return res.status(404).json({ message: 'Mentor not found' });
  const posts = mentor.posts;
  res.json(posts);
});

router.put('/:mentorId/posts/:postId', async (req, res) => {
  const mentor = await Mentor.findById(req.params.mentorId);
  if (!mentor) 
    return res.status(404).json({ message: 'Mentor not found' });
    
  const post = mentor.posts.id(req.params.postId);
  if (!post)
    return res.status(404).json({ message: 'Post not found' });
    
  const { title, content, image } = req.body;
  post.title = title;
  post.content = content;
  post.image = image;

  await mentor.save();
  res.json({ message: 'Post updated successfully', post });
});


router.delete('/:mentorId/posts/:postId', async (req, res) => {
  const mentor = await Mentor.findById(req.params.mentorId);
  if (!mentor) 
    return res.status(404).json({ message: 'Mentor not found' });
    
  const post = mentor.posts.id(req.params.postId);
  if (!post)
    return res.status(404).json({ message: 'Post not found' });

  post.remove();
  await mentor.save();
  res.json({ message: 'Post deleted successfully' });
});

module.exports = router;


module.exports = router;
