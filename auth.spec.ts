import { describe, it, expect, beforeEach } from 'vitest';
import { mock, instance, when, verify, anything } from 'ts-mockito';
import { AuthService, UserRepository } from './auth';

describe('AuthService', () => {
  let mockedUserRepository: UserRepository;
  let authService: AuthService;

  beforeEach(() => {
    // 创建 UserRepository 的 Mock 对象
    mockedUserRepository = mock(UserRepository);
    // 实例化 AuthService，注入 mock 后的 repository
    authService = new AuthService(instance(mockedUserRepository));
  });

  // --- 格式验证测试 ---
  it('should validate email format correctly', () => {
    expect(authService.validateEmail('invalid-email')).toBe(false);
    expect(authService.validateEmail('valid@example.com')).toBe(true);
  });

  it('should validate password complexity', () => {
    expect(authService.validatePassword('weak')).toBe(false); // 太短
    expect(authService.validatePassword('NoSpecialChar1')).toBe(false); // 缺特殊字符
    expect(authService.validatePassword('StrongPass1!')).toBe(true); // 符合要求
  });

  // --- 登录逻辑测试 ---
  it('should fail login if user not found', () => {
    // 模拟：当查找 'unknown@email.com' 时，返回 undefined
    when(mockedUserRepository.findUserPassword('unknown@email.com')).thenReturn(
      undefined
    );

    const result = authService.login('unknown@email.com', 'AnyPass1!');
    expect(result.success).toBe(false);
    expect(result.message).toBe('User not found');
  });

  it('should successfully login with correct credentials', () => {
    // 模拟：当查找 'test@example.com' 时，返回正确的密码
    when(mockedUserRepository.findUserPassword('test@example.com')).thenReturn(
      'CorrectPass1!'
    );

    const result = authService.login('test@example.com', 'CorrectPass1!');
    expect(result.success).toBe(true);
  });

  // --- 注册逻辑测试 ---
  it('should register a new user successfully', () => {
    // 模拟：新用户不存在
    when(mockedUserRepository.findUserPassword('new@example.com')).thenReturn(
      undefined
    );

    const result = authService.register('new@example.com', 'ValidPass1!');

    expect(result.success).toBe(true);
    // 验证 saveUser 方法是否被正确调用了一次
    verify(
      mockedUserRepository.saveUser('new@example.com', 'ValidPass1!')
    ).once();
  });
});
