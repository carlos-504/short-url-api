import type { TracingService } from '../../tracing.service';

export class NoopTracingService implements TracingService {
  isEnabled(): boolean {
    return false;
  }
}
