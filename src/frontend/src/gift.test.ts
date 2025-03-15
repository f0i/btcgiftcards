import { describe, it, expect } from 'vitest';
import { Principal } from '@dfinity/principal';
import { 
  isRevoked, 
  isClaimed, 
  canRequestSend,
  canCancelSend,
  statusText,
  getSendStatus
} from './gift';
import type { Gift, SendStatusEntry } from '../../declarations/backend/backend.did';

describe('Gift Card Status Management', () => {
  const mockGift: Gift = {
    id: 'test123',
    creator: Principal.fromText('2vxsx-fae'),
    to: 'test@example.com',
    sender: 'Sender Name',
    message: 'Test message',
    amount: 1000n,
    created: 1234567890n,
    design: 'default'
  };

  describe('isRevoked', () => {
    it('returns true for revoked status', () => {
      const sendStatus: SendStatusEntry[] = [{
        id: 'test123',
        status: { revoked: 123456n }
      }];
      expect(isRevoked(mockGift, sendStatus)).toBe(true);
    });

    it('returns true for revoking status', () => {
      const sendStatus: SendStatusEntry[] = [{
        id: 'test123',
        status: { revoking: 123456n }
      }];
      expect(isRevoked(mockGift, sendStatus)).toBe(true);
    });

    it('returns false for other statuses', () => {
      const sendStatus: SendStatusEntry[] = [{
        id: 'test123',
        status: { init: null }
      }];
      expect(isRevoked(mockGift, sendStatus)).toBe(false);
    });
  });

  describe('isClaimed', () => {
    it('returns true for claimed status', () => {
      const sendStatus: SendStatusEntry[] = [{
        id: 'test123',
        status: { claimed: 123456n }
      }];
      expect(isClaimed(mockGift, sendStatus)).toBe(true);
    });

    it('returns false for non-claimed status', () => {
      const sendStatus: SendStatusEntry[] = [{
        id: 'test123',
        status: { init: null }
      }];
      expect(isClaimed(mockGift, sendStatus)).toBe(false);
    });
  });

  describe('canRequestSend', () => {
    const creator = Principal.fromText('2vxsx-fae');
    const nonCreator = Principal.fromText('aaaaa-aa');

    it('allows creator to request send for init status', () => {
      const sendStatus: SendStatusEntry[] = [{
        id: 'test123',
        status: { init: null }
      }];
      expect(canRequestSend(creator, mockGift, sendStatus)).toBe(true);
    });

    it('allows creator to request send after sendCanceled', () => {
      const sendStatus: SendStatusEntry[] = [{
        id: 'test123',
        status: { sendCanceled: null }
      }];
      expect(canRequestSend(creator, mockGift, sendStatus)).toBe(true);
    });

    it('prevents non-creator from requesting send', () => {
      const sendStatus: SendStatusEntry[] = [{
        id: 'test123',
        status: { init: null }
      }];
      expect(canRequestSend(nonCreator, mockGift, sendStatus)).toBe(false);
    });

    it('prevents request when already sent', () => {
      const sendStatus: SendStatusEntry[] = [{
        id: 'test123',
        status: { send: 123456n }
      }];
      expect(canRequestSend(creator, mockGift, sendStatus)).toBe(false);
    });
  });

  describe('canCancelSend', () => {
    const creator = Principal.fromText('2vxsx-fae');
    
    it('allows creator to cancel when send is requested', () => {
      const sendStatus: SendStatusEntry[] = [{
        id: 'test123',
        status: { sendRequested: 123456n }
      }];
      expect(canCancelSend(creator, mockGift, sendStatus)).toBe(true);
    });

    it('prevents canceling when not in sendRequested state', () => {
      const sendStatus: SendStatusEntry[] = [{
        id: 'test123',
        status: { init: null }
      }];
      expect(canCancelSend(creator, mockGift, sendStatus)).toBe(false);
    });
  });

  describe('statusText', () => {
    it('returns human readable status', () => {
      const testCases = [
        { status: { init: null }, expected: 'created' },
        { status: { claimed: 123456n }, expected: 'claimed' },
        { status: { sendRequested: 123456n }, expected: 'sendRequested' },
        { status: { revoked: 123456n }, expected: 'revoked' }
      ];

      testCases.forEach(({ status, expected }) => {
        const sendStatus: SendStatusEntry[] = [{
          id: 'test123',
          status
        }];
        expect(statusText(mockGift, sendStatus)).toBe(expected);
      });
    });
  });
});