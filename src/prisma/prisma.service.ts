import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'info' | 'warn' | 'error' | 'beforeExit'> implements OnModuleInit {
  private static instance: PrismaService;

  constructor() {
    const url = process.env.NODE_ENV === 'LOCAL' ? process.env.LOCAL_DATABASE_URL : process.env.DATABASE_URL;
    super({
      datasources: {
        db: {
          url: url as string,
        },
      } as Prisma.Datasources,
    });
  }

  static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
      PrismaService.instance.$connect();
    }
    return PrismaService.instance;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
