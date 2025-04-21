import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

type ResponseData = {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userMessage } = req.body;
    
    if (!userMessage) {
      return res.status(400).json({ message: 'Missing userMessage in request body' });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // System prompt for the tax advisor
    const systemPrompt = "You are an expert Indian Tax Consultant for FY 2023-24. Suggest tax-saving strategies such as 80C, 80D, exemptions, HRA, and NPS. For each suggestion, explain the reason behind it. Only respond with legal tax-saving methods and provide valid sections from the Income Tax Act.";

    // Call Claude API to get the response
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      max_tokens: 2000,
    });

    // Return the AI's response
    return res.status(200).json({
      message: response.content[0].text,
    });
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return res.status(500).json({
      message: 'An error occurred while processing your request. Please try again later.',
    });
  }
} 