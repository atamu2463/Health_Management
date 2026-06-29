// backend/src/organizations/organizations.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

// OrganizationsService のモック
const mockOrganizationsService = {
  register: jest.fn(),
};

describe('OrganizationsController', () => {
  let controller: OrganizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        { provide: OrganizationsService, useValue: mockOrganizationsService },
      ],
    }).compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────
  // テストケース 1: DTO をそのままサービスに渡すこと
  // ─────────────────────────────────────────────────────────
  describe('register()', () => {
    it('受け取った DTO を OrganizationsService.register() に渡すこと', async () => {
      // Arrange
      const dto = {
        organizationName: 'テスト株式会社',
        adminEmail: 'admin@test.com',
        adminPassword: 'password123',
        adminName: '山田太郎',
      };
      const expectedResponse = {
        organization: { id: 'org-id', name: 'テスト株式会社' },
        admin: { id: 'admin-id', email: 'admin@test.com' },
      };
      mockOrganizationsService.register.mockResolvedValue(expectedResponse);

      // Act
      await controller.register(dto as any);

      // Assert: サービスが DTO を受け取って呼ばれたことを確認
      expect(mockOrganizationsService.register).toHaveBeenCalledWith(dto);
    });

    // ─────────────────────────────────────────────────────────
    // テストケース 2: サービスの戻り値をそのまま返すこと
    // ─────────────────────────────────────────────────────────
    it('OrganizationsService.register() の戻り値をそのまま返すこと', async () => {
      // Arrange
      const dto = {
        organizationName: 'テスト株式会社',
        adminEmail: 'admin@test.com',
        adminPassword: 'password123',
        adminName: '山田太郎',
      };
      const expectedResponse = {
        organization: { id: 'org-id', name: 'テスト株式会社' },
        admin: { id: 'admin-id', email: 'admin@test.com' },
      };
      mockOrganizationsService.register.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.register(dto as any);

      // Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});