// backend/src/organizations/organizations.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

// argon2 モジュール全体をモック化
jest.mock('argon2');

// PrismaService のモック定義
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('OrganizationsService', () => {
  let service: OrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);

    // 各テスト前にモックをリセット
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────
  // テストケース 1: メールアドレス重複 → ConflictException
  // ─────────────────────────────────────────────────────────
  describe('register()', () => {
    it('メールアドレスがすでに存在する場合、ConflictExceptionをスローする', async () => {
      // Arrange: 既存ユーザーが見つかるようにモック設定
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-user-id',
        email: 'admin@test.com',
      });

      const dto = {
        organizationName: 'テスト株式会社',
        adminEmail: 'admin@test.com',
        adminPassword: 'password123',
        adminName: '山田太郎',
      };

      // Act & Assert: ConflictException がスローされることを確認
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@test.com' },
      });
    });

    // ─────────────────────────────────────────────────────────
    // テストケース 2: パスワードが argon2 でハッシュ化される
    // ─────────────────────────────────────────────────────────
    it('パスワードが argon2 でハッシュ化されること', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null); // メール重複なし
      (argon2.hash as jest.Mock).mockResolvedValue('hashed_password');

      const mockOrg = { id: 'org-id', name: 'テスト株式会社' };
      const mockDept = { id: 'dept-id', name: 'デフォルト部署' };
      const mockUser = { id: 'user-id', email: 'admin@test.com', role: 'ADMIN' };
      const mockAdmin = { id: 'admin-id', name: '山田太郎' };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          organization: { create: jest.fn().mockResolvedValue(mockOrg) },
          department: { create: jest.fn().mockResolvedValue(mockDept) },
          user: { create: jest.fn().mockResolvedValue(mockUser) },
          admin: { create: jest.fn().mockResolvedValue(mockAdmin) },
        };
        return callback(tx);
      });

      const dto = {
        organizationName: 'テスト株式会社',
        adminEmail: 'admin@test.com',
        adminPassword: 'password123',
        adminName: '山田太郎',
      };

      // Act
      await service.register(dto);

      // Assert: argon2.hash が平文パスワードで呼ばれたことを確認
      expect(argon2.hash).toHaveBeenCalledWith('password123');
    });

    // ─────────────────────────────────────────────────────────
    // テストケース 3: トランザクション内で一括作成される
    // ─────────────────────────────────────────────────────────
    it('トランザクション内で Organization→Department→User→Admin が順番に作成されること', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed_password');

      const mockOrg = { id: 'org-id', name: 'テスト株式会社' };
      const mockDept = { id: 'dept-id', name: 'デフォルト部署', organizationId: 'org-id' };
      const mockUser = { id: 'user-id', email: 'admin@test.com', role: 'ADMIN' };
      const mockAdmin = { id: 'admin-id', name: '山田太郎', userId: 'user-id', departmentId: 'dept-id' };

      const txOrganizationCreate = jest.fn().mockResolvedValue(mockOrg);
      const txDepartmentCreate = jest.fn().mockResolvedValue(mockDept);
      const txUserCreate = jest.fn().mockResolvedValue(mockUser);
      const txAdminCreate = jest.fn().mockResolvedValue(mockAdmin);

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          organization: { create: txOrganizationCreate },
          department: { create: txDepartmentCreate },
          user: { create: txUserCreate },
          admin: { create: txAdminCreate },
        };
        return callback(tx);
      });

      const dto = {
        organizationName: 'テスト株式会社',
        adminEmail: 'admin@test.com',
        adminPassword: 'password123',
        adminName: '山田太郎',
      };

      // Act
      await service.register(dto);

      // Assert: 各作成メソッドが正しい引数で呼ばれたことを確認
      expect(txOrganizationCreate).toHaveBeenCalledWith({
        data: { name: 'テスト株式会社', password: 'password123' },
      });
      expect(txDepartmentCreate).toHaveBeenCalledWith({
        data: { name: 'デフォルト部署', organizationId: 'org-id' },
      });
      expect(txUserCreate).toHaveBeenCalledWith({
        data: { email: 'admin@test.com', password: 'hashed_password', role: 'ADMIN' },
      });
      expect(txAdminCreate).toHaveBeenCalledWith({
        data: { name: '山田太郎', userId: 'user-id', departmentId: 'dept-id' },
      });
    });

    // ─────────────────────────────────────────────────────────
    // テストケース 4: 成功時のレスポンス形式
    // ─────────────────────────────────────────────────────────
    it('成功時に organization と admin の情報を返すこと', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed_password');

      const mockOrg = { id: 'org-id', name: 'テスト株式会社' };
      const mockDept = { id: 'dept-id', name: 'デフォルト部署' };
      const mockUser = { id: 'user-id', email: 'admin@test.com', role: 'ADMIN' };
      const mockAdmin = { id: 'admin-id', name: '山田太郎' };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          organization: { create: jest.fn().mockResolvedValue(mockOrg) },
          department: { create: jest.fn().mockResolvedValue(mockDept) },
          user: { create: jest.fn().mockResolvedValue(mockUser) },
          admin: { create: jest.fn().mockResolvedValue(mockAdmin) },
        };
        return callback(tx);
      });

      const dto = {
        organizationName: 'テスト株式会社',
        adminEmail: 'admin@test.com',
        adminPassword: 'password123',
        adminName: '山田太郎',
      };

      // Act
      const result = await service.register(dto);

      // Assert: レスポンス形式を確認
      expect(result).toEqual({
        organization: { id: 'org-id', name: 'テスト株式会社' },
        admin: { id: 'admin-id', email: 'admin@test.com' },
      });
    });
  });
});