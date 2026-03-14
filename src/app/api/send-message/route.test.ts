import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';

// Mock dependencies
vi.mock('@/lib/dbConnect', () => ({
  default: vi.fn(),
}));

vi.mock('@/model/User', () => ({
  default: {
    findOne: vi.fn().mockReturnValue({
      exec: vi.fn(),
    }),
  },
}));

describe('send-message API route', () => {
  it('returns 404 if user not found', async () => {
    const { default: UserModel } = await import('@/model/User');
    vi.mocked(UserModel.findOne().exec).mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/send-message', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', content: 'hello' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(404);
  });

  it('returns 403 if user is not accepting messages', async () => {
    const { default: UserModel } = await import('@/model/User');
    vi.mocked(UserModel.findOne().exec).mockResolvedValueOnce({
      isAcceptingMessages: false,
    });

    const request = new Request('http://localhost:3000/api/send-message', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', content: 'hello' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
  });
});
