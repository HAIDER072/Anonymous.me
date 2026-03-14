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

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashedPassword'),
  },
}));

vi.mock('@/helpers/sendVerificationEmail', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue({ success: true, message: 'Success' }),
}));

describe('sign-up API route', () => {
  it('returns 400 if username is already taken by a verified user', async () => {
    const { default: UserModel } = await import('@/model/User');
    vi.mocked(UserModel.findOne).mockResolvedValueOnce({ username: 'testuser', isVerified: true });

    const request = new Request('http://localhost:3000/api/sign-up', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', email: 'test@test.com', password: 'password123' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  // Additional tests could go here for successful signup
});
