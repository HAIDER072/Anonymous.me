import { describe, it, expect, vi } from 'vitest';
import { POST, GET } from './route';

// Mock dependencies
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/dbConnect', () => ({
  default: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/model/User', () => ({
  default: {
    findByIdAndUpdate: vi.fn(),
    findById: vi.fn(),
  },
}));

describe('accept-messages API route', () => {
  describe('POST', () => {
    it('returns 401 if not authenticated', async () => {
      // Mock session as null
      const { getServerSession } = await import('next-auth/next');
      vi.mocked(getServerSession).mockResolvedValueOnce(null);

      const request = new Request('http://localhost:3000/api/accept-messages', {
        method: 'POST',
        body: JSON.stringify({ acceptMessages: true }),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });
  });

  describe('GET', () => {
    it('returns 401 if not authenticated', async () => {
      // Mock session as null
      const { getServerSession } = await import('next-auth/next');
      vi.mocked(getServerSession).mockResolvedValueOnce(null);

      const request = new Request('http://localhost:3000/api/accept-messages');

      const response = await GET(request);
      expect(response.status).toBe(401);
    });
  });
});
