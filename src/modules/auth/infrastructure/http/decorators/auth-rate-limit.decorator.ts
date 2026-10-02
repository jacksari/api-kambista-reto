import { minutes, Throttle } from '@nestjs/throttler';
import { trackByEmailAndIp } from '../rate-limit/email-ip.tracker';

export function AuthRateLimit(): MethodDecorator & ClassDecorator {
  return Throttle({
    default: {
      limit: 3,
      ttl: minutes(5),
      blockDuration: minutes(5),
      getTracker: trackByEmailAndIp,
    },
  });
}
