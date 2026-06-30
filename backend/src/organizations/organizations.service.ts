import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: {
        name: createOrganizationDto.name,
      },
    });
  }

  findAll() {
    return this.prisma.organization.findMany();
  }

  update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return this.prisma.organization.update({
      where: { id },
      data: {
        ...(updateOrganizationDto.name !== undefined
          ? { name: updateOrganizationDto.name }
          : {}),
      },
    });
  }

  remove(id: string) {
    return this.prisma.organization.delete({
      where: { id },
    });
  }
}
