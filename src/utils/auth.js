// Credenciais predefinidas (em produção usar Supabase Auth)
const ADMIN_CREDENTIALS = {
  email: 'admin@toncar.com.br',
  password: 'admin123456'
};

export const validarLogin = (email, password) => {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
};

export const criarSessao = (email) => {
  const token = btoa(`${email}:${Date.now()}`);
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_email', email);
  return token;
};

export const obterSessao = () => {
  const token = localStorage.getItem('auth_token');
  const email = localStorage.getItem('user_email');
  return token && email ? { token, email } : null;
};

export const verificarSessao = () => {
  return obterSessao() !== null;
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_email');
};
