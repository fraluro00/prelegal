import { clearAuth, getEmail, getToken, setAuth } from '../../app/lib/auth';

const STORE: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => STORE[key] ?? null,
  setItem: (key: string, value: string) => { STORE[key] = value; },
  removeItem: (key: string) => { delete STORE[key]; },
  clear: () => { Object.keys(STORE).forEach((k) => delete STORE[k]); },
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

beforeEach(() => localStorageMock.clear());

describe('setAuth / getToken / getEmail', () => {
  it('stores and retrieves token and email', () => {
    setAuth('tok123', 'user@example.com');
    expect(getToken()).toBe('tok123');
    expect(getEmail()).toBe('user@example.com');
  });
});

describe('clearAuth', () => {
  it('removes token and email', () => {
    setAuth('tok123', 'user@example.com');
    clearAuth();
    expect(getToken()).toBeNull();
    expect(getEmail()).toBeNull();
  });
});

describe('getToken', () => {
  it('returns null when nothing stored', () => {
    expect(getToken()).toBeNull();
  });
});
