import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Mock dependencies
vi.mock('openai', () => {
  const mockCreate = vi.fn().mockResolvedValue({});
  
  class MockOpenAI {
    completions = { create: mockCreate };
  }
  
  class MockAPIError extends Error {
    status = 500;
  }
  
  // Attach APIError directly as a static property
  (MockOpenAI as any).APIError = MockAPIError;

  return {
    default: MockOpenAI,
    OpenAI: MockOpenAI, // also export it as named OpenAI to handle 'import OpenAI from ...' and 'instanceof OpenAI.APIError'
  };
});

vi.mock('ai', () => ({
  OpenAIStream: vi.fn(),
  StreamingTextResponse: class MockStreamingTextResponse extends Response {
    constructor() {
      super();
    }
  },
}));

describe('suggest-messages API route', () => {
  it('calls openai to suggest messages', async () => {
    const request = new Request('http://localhost:3000/api/suggest-messages', {
      method: 'POST',
    });

    const response = await POST(request);
    expect(response).toBeDefined();
  });
});
