import React, { useState } from 'react';
import '../styles/toast.css';

export const ToastNotificacao = ({ mensagem, tipo = 'info', duracao = 3000, onFechar }) => {
  const [visivel, setVisivel] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisivel(false);
      onFechar?.();
    }, duracao);

    return () => clearTimeout(timer);
  }, [duracao, onFechar]);

  if (!visivel) return null;

  return (
    <div className={`toast toast-${tipo}`}>
      {mensagem}
      <button className="toast-close" onClick={() => setVisivel(false)}>×</button>
    </div>
  );
};
