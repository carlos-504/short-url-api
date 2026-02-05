import {
  Registry,
  Counter,
  Histogram,
  collectDefaultMetrics,
} from 'prom-client';
import type {
  MetricsService,
  MetricsCounter,
  MetricsHistogram,
} from '../../metrics.service';

export class ConsoleMetricsService implements MetricsService {
  private readonly registry: Registry;

  constructor() {
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });
  }

  createCounter(
    name: string,
    options?: { help?: string; labelNames?: string[] },
  ): MetricsCounter {
    const counter = new Counter({
      name,
      help: options?.help ?? name,
      labelNames: options?.labelNames ?? [],
      registers: [this.registry],
    });
    return {
      inc: (value = 1, labels?: Record<string, string>) => {
        if (labels && Object.keys(labels).length > 0) {
          counter.inc(labels, value);
        } else {
          counter.inc(value);
        }
      },
    };
  }

  createHistogram(
    name: string,
    options?: {
      help?: string;
      labelNames?: string[];
      buckets?: number[];
    },
  ): MetricsHistogram {
    const histogram = new Histogram({
      name,
      help: options?.help ?? name,
      labelNames: options?.labelNames ?? [],
      buckets: options?.buckets ?? [
        0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10,
      ],
      registers: [this.registry],
    });
    return {
      observe: (value: number, labels?: Record<string, string>) => {
        if (labels && Object.keys(labels).length > 0) {
          histogram.observe(labels, value);
        } else {
          histogram.observe(value);
        }
      },
    };
  }

  getContentType(): string {
    return this.registry.contentType;
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
