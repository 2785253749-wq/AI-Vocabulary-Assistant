/**
 * Token管理工具
 */

const TOKEN_KEY = 'access_token';
const USER_KEY = 'user';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
}

// Token操作
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// 用户信息操作
export function getUser(): UserInfo | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function setUser(user: UserInfo): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

// 认证状态检查
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

// 登出
export function logout(): void {
  removeToken();
  removeUser();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
