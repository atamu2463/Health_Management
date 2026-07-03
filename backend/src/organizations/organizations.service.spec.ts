import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrganizationsService } from './organizations.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  organization: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
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
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('name を指定して organization を作成すること', async () => {
      const dto = { name: 'テスト株式会社' };
      const expected = { id: 'org-id', name: dto.name };
      mockPrismaService.organization.create.mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(mockPrismaService.organization.create).toHaveBeenCalledWith({
        data: { name: dto.name },
      });
      expect(result).toEqual(expected);
    });
  });

  describe('findAll()', () => {
    it('organization の一覧を返すこと', async () => {
      const expected = [{ id: 'org-id', name: 'テスト株式会社' }];
      mockPrismaService.organization.findMany.mockResolvedValue(expected);

      const result = await service.findAll();

      expect(result).toEqual(expected);
    });
  });

  describe('update()', () => {
    it('name が指定された場合、更新データに含めること', async () => {
      const id = 'org-id';
      const dto = { name: '更新後の会社名' };
      const expected = { id, name: dto.name };
      mockPrismaService.organization.update.mockResolvedValue(expected);

      const result = await service.update(id, dto);

      expect(mockPrismaService.organization.update).toHaveBeenCalledWith({
        where: { id },
        data: { name: dto.name },
      });
      expect(result).toEqual(expected);
    });

    it('対象が存在しない場合、NotFoundException をスローすること', async () => {
      const id = 'not-exist-id';
      const dto = { name: '更新後の会社名' };
      mockPrismaService.organization.update.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Not found', {
          code: 'P2025',
          clientVersion: '5.0.0',
        }),
      );

      await expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('id を指定して organization を削除すること', async () => {
      const id = 'org-id';
      const expected = { id, name: 'テスト株式会社' };
      mockPrismaService.organization.delete.mockResolvedValue(expected);

      const result = await service.remove(id);

      expect(mockPrismaService.organization.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(expected);
    });

    it('対象が存在しない場合、NotFoundException をスローすること', async () => {
      const id = 'not-exist-id';
      mockPrismaService.organization.delete.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Not found', {
          code: 'P2025',
          clientVersion: '5.0.0',
        }),
      );

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});