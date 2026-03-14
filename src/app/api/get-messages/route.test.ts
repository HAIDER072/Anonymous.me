import { describe, it, expect, vi } from 'vitest';
import { GET } from './route';

// Mock dependencies
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/dbConnect', () => ({
  default: vi.fn(),
}));

vi.mock('@/model/User', () => ({
  default: {
    aggregate: vi.fn().mockReturnValue({
      exec: vi.fn(),
    }),
  },
}));

describe('get-messages API route', () => {
  it('returns 401 if not authenticated', async () => {
    const { getServerSession } = await import('next-auth/next');
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/get-messages');

    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('handles getting messages successfully when authenticated', async () => {
    const { getServerSession } = await import('next-auth/next');
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { _id: '123456789012345678901234' } });

    const { default: UserModel } = await import('@/model/User');
    vi.mocked(UserModel.aggregate().exec).mockResolvedValueOnce([{ messages: [] }]);

    const request = new Request('http://localhost:3000/api/get-messages');

    const response = await GET(request);
    expect(response.status).toBe(200);
  });
});
