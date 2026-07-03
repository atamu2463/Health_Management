import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    try {
      return await this.prisma.organization.create({
        data: {
          name: createOrganizationDto.name,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Organization name already exists');
      }
      throw e;
    }
  }

  async findAll() {
    return await this.prisma.organization.findMany();
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    try {
      return await this.prisma.organization.update({
        where: { id },
        data: {
          ...(updateOrganizationDto.name !== undefined
            ? { name: updateOrganizationDto.name }
            : {}),
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`Organization ${id} not found`);
      }
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.organization.delete({
        where: { id },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`Organization ${id} not found`);
      }
      throw e;
    }
  }
}