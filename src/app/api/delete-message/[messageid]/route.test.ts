import { describe, it, expect, vi } from 'vitest';
import { DELETE } from './route';

// Mock dependencies
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/dbConnect', () => ({
  default: vi.fn(),
}));

vi.mock('@/model/User', () => ({
  default: {
    updateOne: vi.fn(),
  },
}));

describe('delete-message API route', () => {
  it('returns 401 if not authenticated', async () => {
    const { getServerSession } = await import('next-auth/next');
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/delete-message/123', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { messageid: '123' } });
    expect(response.status).toBe(401);
  });

  it('deletes a message successfully when authenticated', async () => {
    const { getServerSession } = await import('next-auth/next');
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { _id: 'user123' } });

    const { default: UserModel } = await import('@/model/User');
    vi.mocked(UserModel.updateOne).mockResolvedValueOnce({ modifiedCount: 1 } as any);

    const request = new Request('http://localhost:3000/api/delete-message/123', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { messageid: '123' } });
    expect(response.status).toBe(200);
  });
});
