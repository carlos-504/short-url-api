/**
 * Abstração de Tracing para observabilidade.
 * Com auto-instrumentação OTEL, não expõe spans manuais.
 * Aplicação nunca cria spans; tracing vem 100% da auto-instrumentação HTTP/DB/etc.
 * Este serviço existe para simetria e futura extensibilidade (ex: getCurrentTraceId para logs).
 */
export interface TracingService {
  /** Indica se o tracing está ativo (ex: auto-instrumentação OTEL). */
  isEnabled(): boolean;
}
