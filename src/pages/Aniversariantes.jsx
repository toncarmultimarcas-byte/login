import React, { useState, useEffect } from 'react';
import { emailAniversario } from '../utils/emailAniversario';
import { clientesRepository } from '../data/clientesRepository';
import { ToastNotificacao } from '../components/ToastNotificacao';
import '../styles/aniversariantes.css';

export const Aniversariantes = () => {
  const [aniversariantes, setAniversariantes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [toast, setToast] = useState(null);
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    carregarAniversariantes();
  }, []);

  const carregarAniversariantes = async () => {
    try {
      setCarregando(true);
      const aniversariantesDoMes = await emailAniversario.buscarAniversariantesDoMes();
      
      // Adicionar informações calculadas
      const aniversariantesComInfo = await Promise.all(
        aniversariantesDoMes.map(async (cliente) => {
          const jaEnviado = await emailAniversario.jaSendoEnviadoEsteAno(cliente.id);
          return {
            ...cliente,
            idade: emailAniversario.calcularIdade(cliente.data_nascimento),
            jaEnviado
          };
        })
      );

      setAniversariantes(aniversariantesComInfo);
    } catch (error) {
      console.error('Erro ao carregar aniversariantes:', error);
      setToast({
        tipo: 'erro',
        mensagem: 'Erro ao carregar aniversariantes do mês'
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleEnviarEmail = async (cliente) => {
    try {
      const jaEnviado = await emailAniversario.jaSendoEnviadoEsteAno(cliente.id);
      
      if (jaEnviado) {
        setToast({
          tipo: 'aviso',
          mensagem: `Email de aniversário já foi enviado para ${cliente.nome} este ano`
        });
        return;
      }

      // Gerar link mailto
      const mailtoLink = emailAniversario.gerarMailtoLink(cliente);
      
      // Abrir cliente de email padrão
      window.location.href = mailtoLink;

      // Registrar que email foi "enviado"
      await emailAniversario.registrarEmailEnviado(cliente.id);
      
      // Atualizar lista local
      setAniversariantes(prev =>
        prev.map(c =>
          c.id === cliente.id ? { ...c, jaEnviado: true } : c
        )
      );

      setToast({
        tipo: 'sucesso',
        mensagem: `Email de aniversário aberto para ${cliente.nome}`
      });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      setToast({
        tipo: 'erro',
        mensagem: 'Erro ao gerar email de aniversário'
      });
    }
  };

  const handleVisualizarTemplate = (cliente) => {
    const conteudo = emailAniversario.gerarConteudoEmail(cliente);
    setExpandido({
      ...cliente,
      email_conteudo: conteudo
    });
  };

  if (carregando) {
    return <div className="aniversariantes-container"><p>Carregando...</p></div>;
  }

  return (
    <div className="aniversariantes-container">
      <div className="header-section">
        <h1>🎂 Aniversariantes do Mês</h1>
        <p className="subtitle">
          {aniversariantes.length > 0
            ? `${aniversariantes.length} cliente(s) fazendo aniversário este mês`
            : 'Nenhum cliente com aniversário este mês'}
        </p>
      </div>

      {aniversariantes.length === 0 ? (
        <div className="vazio">
          <p>Nenhum aniversariante para este mês</p>
        </div>
      ) : (
        <div className="aniversariantes-grid">
          {aniversariantes.map(cliente => (
            <div key={cliente.id} className="cliente-card">
              <div className="cliente-header">
                <div className="cliente-info">
                  <h3 className="cliente-nome">{cliente.nome}</h3>
                  <p className="cliente-email">{cliente.email}</p>
                  <p className="cliente-telefone">📱 {cliente.telefone || 'N/A'}</p>
                </div>
                <div className="cliente-idade">
                  <span className="badge-idade">{cliente.idade} anos</span>
                </div>
              </div>

              <div className="cliente-detalhes">
                {cliente.modelo_interesse && (
                  <p><strong>Interesse:</strong> {cliente.modelo_interesse}</p>
                )}
                {cliente.faixa_preco && (
                  <p><strong>Faixa:</strong> {cliente.faixa_preco}</p>
                )}
              </div>

              <div className="cliente-acoes">
                <button
                  className="btn-email"
                  onClick={() => handleEnviarEmail(cliente)}
                  disabled={cliente.jaEnviado}
                  title={cliente.jaEnviado ? 'Email já enviado este ano' : 'Enviar email de aniversário'}
                >
                  {cliente.jaEnviado ? '✓ Enviado' : '📧 Enviar Email'}
                </button>
                <button
                  className="btn-visualizar"
                  onClick={() => handleVisualizarTemplate(cliente)}
                  title="Visualizar template do email"
                >
                  👁️ Visualizar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {expandido && (
        <div className="modal-overlay" onClick={() => setExpandido(null)}>
          <div className="modal-conteudo" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Preview - Email de Aniversário</h2>
              <button className="btn-fechar" onClick={() => setExpandido(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="email-container">
                <div className="email-header">
                  <p><strong>Para:</strong> {expandido.email_conteudo.para}</p>
                  <p><strong>Assunto:</strong> {expandido.email_conteudo.assunto}</p>
                </div>

                <div className="email-corpo">
                  {expandido.email_conteudo.corpo.split('\n').map((linha, idx) => (
                    <p key={idx}>{linha || <br />}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-enviar-modal"
                onClick={() => {
                  handleEnviarEmail(expandido);
                  setExpandido(null);
                }}
                disabled={expandido.jaEnviado}
              >
                {expandido.jaEnviado ? '✓ Já Enviado' : '📧 Enviar via Email'}
              </button>
              <button
                className="btn-fechar-modal"
                onClick={() => setExpandido(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <ToastNotificacao
          tipo={toast.tipo}
          mensagem={toast.mensagem}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
