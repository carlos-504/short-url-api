/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  MetricsService,
  MetricsCounter,
  MetricsHistogram,
} from '../../metrics.service';

class NoopCounter implements MetricsCounter {
  inc(_value?: number, _labels?: Record<string, string>): void {
    // no-op
  }
}

class NoopHistogram implements MetricsHistogram {
  observe(_value: number, _labels?: Record<string, string>): void {
    // no-op
  }
}

/**
 * Implementação Noop de Métricas.
 * Não registra dados; usado quando observabilidade está desativada.
 */
export class NoopMetricsService implements MetricsService {
  createCounter(
    _name: string,
    _options?: { help?: string; labelNames?: string[] },
  ): MetricsCounter {
    return new NoopCounter();
  }

  createHistogram(
    _name: string,
    _options?: {
      help?: string;
      labelNames?: string[];
      buckets?: number[];
    },
  ): MetricsHistogram {
    return new NoopHistogram();
  }

  getContentType(): string {
    return 'text/plain';
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getMetrics(): Promise<string> {
    return '';
  }
}
