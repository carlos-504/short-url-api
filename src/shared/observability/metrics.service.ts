export interface MetricsCounter {
  inc(value?: number, labels?: Record<string, string>): void;
}

export interface MetricsHistogram {
  observe(value: number, labels?: Record<string, string>): void;
}

export interface MetricsService {
  createCounter(
    name: string,
    options?: { help?: string; labelNames?: string[] },
  ): MetricsCounter;
  createHistogram(
    name: string,
    options?: { help?: string; labelNames?: string[]; buckets?: number[] },
  ): MetricsHistogram;
  getContentType(): string;
  getMetrics(): Promise<string>;
}
