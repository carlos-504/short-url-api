/**
 * Tipo de retorno do use case de login.
 * Representa os dados do usuário autenticado (sem expor senha ou dados sensíveis).
 */
export interface LoginResult {
  userId: number;
  email: string;
}
