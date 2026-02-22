// 1. 数据访问层 (用于后续 Mock)
export class UserRepository {
  // Hard-coded mock users
  private users = new Map<string, string>([
      ['test@example.com', 'Password123!'],
      ['admin@pawchio.com', 'Admin@2026#']
  ]);

  findUserPassword(email: string): string | undefined {
      return this.users.get(email);
  }

  saveUser(email: string, password: string): void {
      this.users.set(email, password);
  }
}

// 2. 核心认证逻辑层
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  validateEmail(email: string): boolean {
      // 标准的邮箱验证正则
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
      // 至少8个字符，包含大写、小写、数字和特殊符号
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
  }

  login(email: string, password: string): { success: boolean; message: string } {
      if (!this.validateEmail(email)) return { success: false, message: 'Invalid email' };
      
      const storedPassword = this.userRepository.findUserPassword(email);
      if (!storedPassword) return { success: false, message: 'User not found' };
      if (storedPassword !== password) return { success: false, message: 'Incorrect password' };

      return { success: true, message: 'Login successful' };
  }

  register(email: string, password: string): { success: boolean; message: string } {
      if (!this.validateEmail(email)) return { success: false, message: 'Invalid email' };
      if (!this.validatePassword(password)) return { success: false, message: 'Weak password' };
      
      if (this.userRepository.findUserPassword(email)) {
          return { success: false, message: 'User already exists' };
      }

      this.userRepository.saveUser(email, password);
      return { success: true, message: 'Registration successful' };
  }
}