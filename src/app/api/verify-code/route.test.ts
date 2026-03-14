import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';

// Mock dependencies
vi.mock('@/lib/dbConnect', () => ({
  default: vi.fn(),
}));

vi.mock('@/model/User', () => ({
  default: {
    findOne: vi.fn(),
  },
}));

describe('verify-code API route', () => {
  it('returns 404 if user not found', async () => {
    const { default: UserModel } = await import('@/model/User');
    vi.mocked(UserModel.findOne).mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/verify-code', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', code: '123456' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(404);
  });

  it('verifies code successfully', async () => {
    const { default: UserModel } = await import('@/model/User');
    vi.mocked(UserModel.findOne).mockResolvedValueOnce({
      verifyCode: '123456',
      verifyCodeExpiry: new Date(Date.now() + 1000000), // future date
      save: vi.fn(),
    });

    const request = new Request('http://localhost:3000/api/verify-code', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', code: '123456' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
