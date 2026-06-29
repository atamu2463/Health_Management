import { ConflictException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: {
    organizationName: string;
    adminEmail: string;
    adminPassword: string;
    adminName: string;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.adminEmail },
    });

    if (existingUser) {
      throw new ConflictException('このメールアドレスは既に使用されています');
    }

    const hashedPassword = await argon2.hash(dto.adminPassword);

    return this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: dto.organizationName,
          password: dto.adminPassword,
        },
      });

      const department = await tx.department.create({
        data: { name: 'デフォルト部署', organizationId: organization.id },
      });

      const user = await tx.user.create({
        data: {
          email: dto.adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
        },
      });

      const admin = await tx.admin.create({
        data: {
          name: dto.adminName,
          userId: user.id,
          departmentId: department.id,
        },
      });

      return {
        organization: { id: organization.id, name: organization.name },
        admin: { id: admin.id, email: user.email },
      };
    });
  }

  create(createOrganizationDto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: createOrganizationDto,
    });
  }

  findAll() {
    return this.prisma.organization.findMany();
  }

  update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
    });
  }

  remove(id: string) {
    return this.prisma.organization.delete({
      where: { id },
    });
  }
}
