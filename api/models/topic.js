const mongoose = require('mongoose');
const Joi = require('joi');

const topicSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true,
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
  resources: {
    links: [
      { title: 
        { 
          type: String, 
          required: true 
        }, 
        url: 
        { 
          type: String,
          required: true
        }
      }
    ],
    files: 
    [
      { title:
        { 
          type: String, 
          required: true 
        }, 
        name: 
        { 
          type: String,
          required: true
        }
      }
    ]
  }
});

const Topic = mongoose.model('Topic', topicSchema);

function validateTopic(topic) {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    duration: Joi.object().keys({
      start: Joi.date().required(),
      end: Joi.date().required()
      }).required(),
    resources: Joi.object().keys({
      links: Joi.array().items(Joi.object().keys({
        title: Joi.string().required(),
        url: Joi.string().required()
      })).required(),
      files: Joi.array().items(Joi.object().keys({
        title: Joi.string().required(),
        name: Joi.string().required()
      })).required()
    }).required()
  });

  return schema.validate(topic)
}

exports.Topic = Topic;
exports.validate = validateTopic;
