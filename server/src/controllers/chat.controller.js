/**
 * Chat Controller
 * Handles AI chatbot interactions for tax consultation
 */

const Chat = require('../models/chat.model');
const { generateCompletion, generateStreamingCompletion, fallbackToLocalModel } = require('../config/openai');
const { getRedisClient } = require('../config/database');
const { ApiError } = require('../middleware/error.middleware');

/**
 * Send a message to the chatbot and get a response
 * @route POST /api/chat
 * @access Private
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { message, chatId, taxContext } = req.body;
    const userId = req.user.id;

    // Validate request
    if (!message) {
      return next(new ApiError('Message is required', 400));
    }

    let chat;

    // If chatId is provided, find the existing chat, otherwise create a new one
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: userId });
      
      if (!chat) {
        return next(new ApiError('Chat not found or unauthorized', 404));
      }
    } else {
      // Create new chat
      chat = new Chat({
        user: userId,
        messages: [],
        taxContext: taxContext || {}
      });
    }

    // Add user message to chat
    await chat.addMessage('user', message);

    // Get the recent message history for context
    const contextMessages = chat.getContextMessages(10);

    try {
      // Generate AI response
      const completion = await generateCompletion(
        message,
        {
          previousMessages: contextMessages,
          taxContext: chat.taxContext
        }
      );

      const aiResponse = completion.choices[0].message.content;

      // Add AI response to chat
      await chat.addMessage('assistant', aiResponse);

      // If this is a new chat, generate a title based on first message
      if (!chatId) {
        await chat.updateTitle();
      }

      // Save the chat
      await chat.save();

      // Return response
      res.status(200).json({
        success: true,
        data: {
          message: aiResponse,
          chatId: chat._id
        }
      });
    } catch (error) {
      console.error('AI generation error:', error);

      // Try fallback to local model if OpenAI fails
      try {
        const fallbackResponse = await fallbackToLocalModel(message);
        const fallbackMessage = fallbackResponse.choices[0].message.content;

        // Add fallback response to chat
        await chat.addMessage('assistant', fallbackMessage);
        await chat.save();

        // Return fallback response
        return res.status(200).json({
          success: true,
          data: {
            message: fallbackMessage,
            chatId: chat._id,
            note: 'This response was generated using a fallback model.'
          }
        });
      } catch (fallbackError) {
        console.error('Fallback model error:', fallbackError);
        return next(new ApiError('Failed to generate response. Please try again later.', 500));
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Stream a response from the chatbot
 * @route POST /api/chat/stream
 * @access Private
 */
exports.streamResponse = async (req, res, next) => {
  try {
    const { message, chatId, taxContext } = req.body;
    const userId = req.user.id;

    // Validate request
    if (!message) {
      return next(new ApiError('Message is required', 400));
    }

    let chat;

    // If chatId is provided, find the existing chat, otherwise create a new one
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: userId });
      
      if (!chat) {
        return next(new ApiError('Chat not found or unauthorized', 404));
      }
    } else {
      // Create new chat
      chat = new Chat({
        user: userId,
        messages: [],
        taxContext: taxContext || {}
      });
      await chat.save();
    }

    // Add user message to chat
    await chat.addMessage('user', message);

    // Get the recent message history for context
    const contextMessages = chat.getContextMessages(10);

    try {
      // Set up SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      // Start with a data event containing the chat ID
      res.write(`data: ${JSON.stringify({ chatId: chat._id })}\n\n`);

      // Generate streaming response
      const stream = await generateStreamingCompletion(
        message,
        {
          previousMessages: contextMessages,
          taxContext: chat.taxContext
        }
      );

      let fullResponse = '';

      // Process the stream
      for await (const chunk of stream) {
        // Extract content from the chunk
        const content = chunk.choices[0]?.delta?.content || '';
        
        if (content) {
          fullResponse += content;
          // Send the chunk to the client
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // Add AI response to chat
      await chat.addMessage('assistant', fullResponse);

      // If this is a new chat, generate a title based on first message
      if (!chatId) {
        await chat.updateTitle();
      }

      // Save the chat
      await chat.save();

      // End the stream
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error) {
      console.error('Streaming error:', error);
      
      // Try to send an error event
      res.write(`data: ${JSON.stringify({ error: 'Failed to generate streaming response' })}\n\n`);
      res.end();
      
      // Don't call next() as we've already started sending the response
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific chat
 * @route GET /api/chat/:chatId
 * @access Private
 */
exports.getChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({ _id: chatId, user: userId });

    if (!chat) {
      return next(new ApiError('Chat not found or unauthorized', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        chat
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a chat
 * @route DELETE /api/chat/:chatId
 * @access Private
 */
exports.deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOneAndDelete({ _id: chatId, user: userId });

    if (!chat) {
      return next(new ApiError('Chat not found or unauthorized', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update chat properties (title, status, etc.)
 * @route PATCH /api/chat/:chatId
 * @access Private
 */
exports.updateChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { title, isStarred, taxContext } = req.body;
    const userId = req.user.id;

    // Find chat
    const chat = await Chat.findOne({ _id: chatId, user: userId });

    if (!chat) {
      return next(new ApiError('Chat not found or unauthorized', 404));
    }

    // Update fields if provided
    if (title !== undefined) chat.title = title;
    if (isStarred !== undefined) chat.isStarred = isStarred;
    if (taxContext) chat.taxContext = { ...chat.taxContext, ...taxContext };

    // Save changes
    await chat.save();

    res.status(200).json({
      success: true,
      data: {
        chat
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Regenerate the last AI response in a chat
 * @route POST /api/chat/:chatId/regenerate
 * @access Private
 */
exports.regenerateResponse = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Find chat
    const chat = await Chat.findOne({ _id: chatId, user: userId });

    if (!chat) {
      return next(new ApiError('Chat not found or unauthorized', 404));
    }

    // Check if there are messages to regenerate
    if (chat.messages.length < 2) {
      return next(new ApiError('Not enough messages to regenerate', 400));
    }

    // Get the last user message
    const lastUserMessageIndex = chat.messages
      .map((msg, index) => ({ role: msg.role, index }))
      .filter(msg => msg.role === 'user')
      .pop();

    if (!lastUserMessageIndex) {
      return next(new ApiError('No user message found', 400));
    }

    const lastUserMessage = chat.messages[lastUserMessageIndex.index].content;

    // Remove the last AI response
    chat.messages = chat.messages.filter((_, i) => i <= lastUserMessageIndex.index);
    await chat.save();

    // Get context for AI
    const contextMessages = chat.getContextMessages(10);

    // Generate new AI response
    try {
      const completion = await generateCompletion(
        lastUserMessage,
        {
          previousMessages: contextMessages,
          taxContext: chat.taxContext
        },
        false // Skip cache for regeneration
      );

      const aiResponse = completion.choices[0].message.content;

      // Add new AI response to chat
      await chat.addMessage('assistant', aiResponse);
      await chat.save();

      // Return response
      res.status(200).json({
        success: true,
        data: {
          message: aiResponse,
          chatId: chat._id
        }
      });
    } catch (error) {
      console.error('AI regeneration error:', error);
      return next(new ApiError('Failed to regenerate response', 500));
    }
  } catch (error) {
    next(error);
  }
}; 