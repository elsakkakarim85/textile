import type { Factory, PrismaClient, User } from '@prisma/client';

/** Context passed from prisma/seed.ts to each module seed in prisma/seeds/*. */
export type SeedCtx = {
  users: {
    admin: User;
    owner1: User; // Misr Spinning & Weaving (large anchor firm)
    owner2: User; // Al-Rowad Advanced Dyeing
    buyer1: User;
    buyer2: User;
    worker1: User;
    expert1: User;
    expert2: User;
    smeOwners: User[]; // owners of the SME factories below (same order)
  };
  /** factories[0] = Misr Spinning, [1] = Al-Rowad Dyeing, [2..] = SMEs (weaving, knitting, garments, printing…) */
  factories: Factory[];
};

export type ModuleSeed = (prisma: PrismaClient, ctx: SeedCtx) => Promise<void>;
