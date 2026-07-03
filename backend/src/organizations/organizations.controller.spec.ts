// backend/src/organizations/organizations.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

// OrganizationsService のモック
const mockOrganizationsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
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
  // create()
  // ─────────────────────────────────────────────────────────
  describe('create()', () => {
    it('受け取った DTO を OrganizationsService.create() に渡すこと', async () => {
      const dto = { name: 'テスト株式会社' };
      const expectedResponse = { id: 'org-id', name: 'テスト株式会社' };
      mockOrganizationsService.create.mockResolvedValue(expectedResponse);

      await controller.create(dto);

      expect(mockOrganizationsService.create).toHaveBeenCalledWith(dto);
    });

    it('OrganizationsService.create() の戻り値をそのまま返すこと', async () => {
      const dto = { name: 'テスト株式会社' };
      const expectedResponse = { id: 'org-id', name: 'テスト株式会社' };
      mockOrganizationsService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedResponse);
    });
  });


  // ─────────────────────────────────────────────────────────
  // findAll()
  // ─────────────────────────────────────────────────────────
  describe('findAll()', () => {
    it('OrganizationsService.findAll() を呼び出すこと', async () => {
      const expectedResponse = [{ id: 'org-id', name: 'テスト株式会社' }];
      mockOrganizationsService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll();

      expect(mockOrganizationsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  // ─────────────────────────────────────────────────────────
  // update()
  // ─────────────────────────────────────────────────────────
  describe('update()', () => {
    it('id と DTO を OrganizationsService.update() に渡すこと', async () => {
      const id = 'org-id';
      const dto = { name: '更新後の会社名' };
      const expectedResponse = { id, name: '更新後の会社名' };
      mockOrganizationsService.update.mockResolvedValue(expectedResponse);

      const result = await controller.update(id, dto);

      expect(mockOrganizationsService.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  // ─────────────────────────────────────────────────────────
  // remove()
  // ─────────────────────────────────────────────────────────
  describe('remove()', () => {
    it('id を OrganizationsService.remove() に渡すこと', async () => {
      const id = 'org-id';
      const expectedResponse = { id, name: 'テスト株式会社' };
      mockOrganizationsService.remove.mockResolvedValue(expectedResponse);

      const result = await controller.remove(id);

      expect(mockOrganizationsService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
    });
  });
});