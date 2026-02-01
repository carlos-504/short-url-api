/**
 * Tokens de injeção de dependência para resolução no container NestJS.
 * Centraliza os identificadores usados nos providers (useClass, useValue, etc).
 */

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export const SHORT_URL_REPOSITORY = Symbol('SHORT_URL_REPOSITORY');
