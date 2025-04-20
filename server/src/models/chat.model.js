/**
 * Chat Model
 * Defines the schema for storing chat history and interactions
 */

const mongoose = require('mongoose');

// Message schema for individual chat messages
const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Chat session schema
const ChatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: function() {
      const date = new Date();
      return `Chat ${date.toLocaleString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
      })}`;
    }
  },
  messages: [MessageSchema],
  tags: [{
    type: String
  }],
  taxContext: {
    regime: {
      type: String,
      enum: ['old', 'new', 'undecided'],
      default: 'undecided'
    },
    income: {
      type: Number,
      default: 0
    },
    deductions: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create text index for searching in chat content
ChatSchema.index({ 'messages.content': 'text', 'title': 'text' });

// Update lastUpdated when chat is modified
ChatSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Method to add a new message to the chat
ChatSchema.methods.addMessage = function(role, content) {
  this.messages.push({
    role,
    content,
    timestamp: new Date()
  });
  this.lastUpdated = Date.now();
  return this.save();
};

// Method to update chat title based on content
ChatSchema.methods.updateTitle = async function() {
  if (this.messages.length > 0) {
    // Get the first user message for title generation
    const firstUserMessage = this.messages.find(msg => msg.role === 'user');
    
    if (firstUserMessage) {
      // Truncate and use as title if not too long
      if (firstUserMessage.content.length <= 50) {
        this.title = firstUserMessage.content;
      } else {
        this.title = `${firstUserMessage.content.substring(0, 47)}...`;
      }
      return this.save();
    }
  }
  return this;
};

// Method to get context messages for AI
ChatSchema.methods.getContextMessages = function(limit = 10) {
  // Get the most recent messages, limited to the specified amount
  return this.messages
    .slice(-limit)
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }));
};

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat; 