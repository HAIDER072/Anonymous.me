import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';
import { NextResponse } from 'next/server';

// Mock dependencies
vi.mock('@ai-sdk/openai', () => ({
  openai: vi.fn(() => 'mock-model'),
}));

vi.mock('ai', () => ({
  streamText: vi.fn().mockResolvedValue({
    toDataStreamResponse: vi.fn().mockReturnValue(new Response()),
  }),
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
