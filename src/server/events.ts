import 'server-only';
import { prisma } from '@/lib/prisma';

export async function audit(adminId: string, action: string, entity: string, entityId: string, details?: unknown) {
  await prisma.auditLog.create({
    data: { adminId, action, entity, entityId, details: details === undefined ? null : JSON.stringify(details) },
  });
}

export async function notify(userId: string, title: string, message: string, link?: string) {
  await prisma.notification.create({ data: { userId, title, message, link } });
}
