import 'server-only';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ZodError, type ZodSchema } from 'zod';

export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
  }
}

/** Parse + validate a JSON body; throws 400 with field errors on failure. */
export async function parseBody<T>(req: Request, schema: ZodSchema<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new HttpError(400, 'Invalid JSON body');
  }
  return schema.parse(raw);
}

/** Recursively converts Prisma Decimal values to numbers so responses are plain JSON. */
export function serialize<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_k, v) => (v instanceof Prisma.Decimal ? v.toNumber() : v)),
  );
}

type Handler<C> = (req: Request, ctx: C) => Promise<unknown>;

/**
 * Wraps a route handler with uniform error handling and JSON serialization.
 * Return a value to send it as JSON, or return a Response to send it as-is.
 */
export function route<C = unknown>(handler: Handler<C>) {
  return async (req: Request, ctx: C) => {
    try {
      const result = await handler(req, ctx);
      if (result instanceof Response) return result;
      return NextResponse.json(serialize(result ?? { ok: true }));
    } catch (err) {
      if (err instanceof HttpError) {
        return NextResponse.json({ error: err.message, details: err.details }, { status: err.status });
      }
      if (err instanceof ZodError) {
        return NextResponse.json({ error: 'Validation failed', details: err.flatten().fieldErrors }, { status: 400 });
      }
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') return NextResponse.json({ error: 'Already exists' }, { status: 409 });
        if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      console.error('[api]', req.method, new URL(req.url).pathname, err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}
