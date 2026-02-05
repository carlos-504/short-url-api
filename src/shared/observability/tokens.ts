/**
 * Tokens de injeção de dependência para os services de observabilidade.
 * A aplicação depende apenas desses tokens e das interfaces, nunca de implementações concretas.
 */
export const LOGGER_SERVICE = Symbol('LOGGER_SERVICE');
export const METRICS_SERVICE = Symbol('METRICS_SERVICE');
export const TRACING_SERVICE = Symbol('TRACING_SERVICE');
