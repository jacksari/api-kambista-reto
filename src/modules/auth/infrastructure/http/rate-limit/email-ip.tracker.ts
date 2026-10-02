import { ThrottlerGetTrackerFunction } from '@nestjs/throttler';
import { Request } from 'express';

export const trackByEmailAndIp: ThrottlerGetTrackerFunction = (request) => {
  const expressRequest = request as Request;
  const body: unknown = expressRequest.body;
  const rawEmail =
    typeof body === 'object' && body !== null && 'email' in body
      ? body.email
      : undefined;
  const email =
    typeof rawEmail === 'string'
      ? rawEmail.trim().normalize('NFC').toLowerCase()
      : '';
  const ip =
    expressRequest.ip || expressRequest.socket.remoteAddress || 'unknown';

  return email ? `${email}|${ip}` : ip;
};
