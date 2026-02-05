/**
 * Abstração de Métricas para observabilidade.
 * Usa prom-client internamente nos providers não-noop; endpoint /metrics.
 */
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
  /** Retorna o conteúdo Prometheus para o endpoint /metrics. */
  getContentType(): string;
  /** Retorna as métricas em formato Prometheus. */
  getMetrics(): Promise<string>;
}
