import React, { useState, useEffect } from 'react';
import { notificacoesRepository } from '../data/notificacoesRepository';
import { emailAniversario } from '../utils/emailAniversario';
import { ToastNotificacao } from '../components/ToastNotificacao';
import '../styles/notificacoes.css';

const ListaNotificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [carregando, setCarregando] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    carregarNotificacoes();
    // Gerar notificações de aniversário ao carregar
    notificacoesRepository.gerarNotificacoesAniversario().catch(err => 
      console.error('Erro ao gerar aniversários:', err)
    );
    // Atualizar notificações a cada 30 segundos
    const interval = setInterval(carregarNotificacoes, 30000);
    return () => clearInterval(interval);
  }, [filtroTipo]);

  const carregarNotificacoes = async () => {
    try {
      setCarregando(true);
      console.log('📋 Carregando notificações com filtro:', filtroTipo);
      let dados = [];

      if (filtroTipo === 'interesse') {
        dados = await notificacoesRepository.listarInteresse();
      } else {
        const [todas, aniversariantesHoje] = await Promise.all([
          notificacoesRepository.listarTodas(),
          emailAniversario.buscarAniversariantesDoDia()
        ]);

        const notificacoesAniversarioInline = (aniversariantesHoje || []).map((cliente) => ({
          id: `aniver-${cliente.id}`,
          cliente_id: cliente.id,
          tipo: 'aniversario',
          titulo: `Aniversário de ${cliente.nome}`,
          descricao: `${cliente.nome} faz aniversário hoje! Envie uma mensagem especial.`,
          dados_veiculo: null,
          clientes: {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            telefone: cliente.telefone,
            data_nascimento: cliente.data_nascimento
          }
        }));

        if (filtroTipo === 'aniversario') {
          dados = [
            ...((todas || []).filter((n) => n.tipo === 'aniversario')),
            ...notificacoesAniversarioInline
          ];
        } else {
          dados = [
            ...(todas || []),
            ...notificacoesAniversarioInline
          ];
        }
      }
      
      console.log('✅ Notificações carregadas:', dados);
      console.log('📊 Total:', dados?.length || 0);
      setNotificacoes(dados || []);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      console.error('Detalhes:', error.message);
      setToast({ tipo: 'erro', mensagem: 'Erro ao carregar notificações: ' + error.message });
    } finally {
      setCarregando(false);
    }
  };

  const handleMarcarComoLida = async (notificacaoId) => {
    try {
      await notificacoesRepository.marcarComoLida(notificacaoId);
      setNotificacoes(prev => prev.filter(n => n.id !== notificacaoId));
      setToast({ tipo: 'sucesso', mensagem: 'Notificação marcada como lida.' });
    } catch (error) {
      setToast({ tipo: 'erro', mensagem: 'Erro ao atualizar notificação.' });
    }
  };

  const handleDeletar = async (notificacaoId) => {
    try {
      // Se for notificação virtual de aniversário (não salva no banco)
      if (notificacaoId.toString().startsWith('aniver-')) {
        setNotificacoes(prev => prev.filter(n => n.id !== notificacaoId));
        setToast({ tipo: 'sucesso', mensagem: 'Notificação removida da lista.' });
        return;
      }

      await notificacoesRepository.deletar(notificacaoId);
      setNotificacoes(prev => prev.filter(n => n.id !== notificacaoId));
      setToast({ tipo: 'sucesso', mensagem: 'Notificação removida.' });
    } catch (error) {
      setToast({ tipo: 'erro', mensagem: 'Erro ao remover notificação.' });
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getIconeTipo = (tipo) => {
    if (tipo === 'aniversario') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/>
          <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/>
          <path d="M2 21h20"/>
          <path d="M7 8v2"/>
          <path d="M12 8v2"/>
          <path d="M17 8v2"/>
          <path d="M7 4h.01"/>
          <path d="M12 4h.01"/>
          <path d="M17 4h.01"/>
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 1 0 4 0m0 0a2 2 0 1 0-4 0"/>
      </svg>
    );
  };

  return (
    <div className="notificacoes-container">
      <div className="notificacoes-header">
        <h1>Notificações</h1>
        <div className="notificacoes-filtros">
          <button 
            className={`btn-filtro ${filtroTipo === 'todos' ? 'ativo' : ''}`}
            onClick={() => setFiltroTipo('todos')}
          >
            Todas ({notificacoes.length})
          </button>
          <button 
            className={`btn-filtro ${filtroTipo === 'interesse' ? 'ativo' : ''}`}
            onClick={() => setFiltroTipo('interesse')}
          >
            Interesse em Veículos
          </button>
          <button 
            className={`btn-filtro ${filtroTipo === 'aniversario' ? 'ativo' : ''}`}
            onClick={() => setFiltroTipo('aniversario')}
          >
            Aniversários
          </button>
        </div>
      </div>

      {carregando ? (
        <div className="loading">Carregando notificações...</div>
      ) : notificacoes.length === 0 ? (
        <div className="vazio">
          <p>Nenhuma notificação encontrada.</p>
        </div>
      ) : (
        <div className="notificacoes-lista">
          {notificacoes.map(notificacao => (
            <div key={notificacao.id} className={`notificacao-card tipo-${notificacao.tipo}`}>
              <div className="notificacao-content">
                <div className="notificacao-tipo-icon">
                  {getIconeTipo(notificacao.tipo)}
                </div>
                <div className="notificacao-info">
                  <h3 className="notificacao-titulo">{notificacao.titulo}</h3>
                  <p className="notificacao-descricao">{notificacao.descricao}</p>
                  
                  {notificacao.clientes && (
                    <div className="notificacao-cliente">
                      <strong>{notificacao.clientes.nome}</strong>
                      {notificacao.clientes.telefone && (
                        <span className="notificacao-telefone">{notificacao.clientes.telefone}</span>
                      )}
                    </div>
                  )}
                  
                  {notificacao.dados_veiculo && notificacao.tipo === 'veiculo_novo' && (
                    <div className="notificacao-veiculo">
                      <span className="badge">
                        {notificacao.dados_veiculo.marca} {notificacao.dados_veiculo.modelo}
                      </span>
                      <span className="badge">{notificacao.dados_veiculo.ano}</span>
                      {notificacao.dados_veiculo.preco && (
                        <span className="badge preco">
                          R$ {(notificacao.dados_veiculo.preco / 1000).toFixed(0)}k
                        </span>
                      )}
                    </div>
                  )}

                  {notificacao.tipo === 'aniversario' && notificacao.clientes?.data_nascimento && (
                    <div className="notificacao-veiculo">
                      <span className="badge badge-aniversario">
                        {new Date(notificacao.clientes.data_nascimento).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                  )}
                  
                  <div className="notificacao-data">
                    {formatarData(notificacao.criada_em)}
                  </div>
                </div>
              </div>
              
              <div className="notificacao-acoes">
                {notificacao.clientes?.telefone && notificacao.tipo === 'veiculo_novo' && (
                  <>
                    <a 
                      href={`https://wa.me/55${notificacao.clientes.telefone.replace(/\D/g, '')}?text=Olá ${notificacao.clientes.nome}, vimos que você tem interesse em veículos. Chegou um novo ${notificacao.dados_veiculo.marca} ${notificacao.dados_veiculo.modelo} que pode te interessar!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp-notificacao"
                      title="Enviar WhatsApp"
                    >
                      <i className="fab fa-whatsapp"></i>
                    </a>
                    {notificacao.clientes.email && (
                      <a 
                        href={`mailto:${notificacao.clientes.email}?subject=Novidade na AutoElite: ${notificacao.dados_veiculo.marca} ${notificacao.dados_veiculo.modelo}&body=Olá ${notificacao.clientes.nome},%0D%0A%0D%0AVimos que você tem interesse em veículos e chegou uma novidade que pode te interessar:%0D%0A%0D%0A${notificacao.dados_veiculo.marca} ${notificacao.dados_veiculo.modelo} ${notificacao.dados_veiculo.ano}%0D%0A%0D%0AVenha conferir!`}
                        className="btn-email-notificacao"
                        title="Enviar Email"
                      >
                        <i className="fas fa-envelope"></i>
                      </a>
                    )}
                  </>
                )}
                
                {notificacao.tipo === 'aniversario' && (
                  <>
                    {notificacao.clientes?.telefone && (
                      <a 
                        href={`https://wa.me/55${notificacao.clientes.telefone.replace(/\D/g, '')}?text=Feliz aniversário ${notificacao.clientes.nome}! Desejamos um dia especial cheio de alegrias!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp-notificacao"
                        title="Enviar mensagem de aniversário"
                      >
                        <i className="fab fa-whatsapp"></i>
                        WhatsApp
                      </a>
                    )}
                    {notificacao.clientes?.email && (
                      <a 
                        href={emailAniversario.gerarMailtoLink(notificacao.clientes)}
                        className="btn-email-notificacao"
                        title="Enviar Email de Aniversário"
                      >
                        <i className="fas fa-envelope"></i>
                      </a>
                    )}
                  </>
                )}
                
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleMarcarComoLida(notificacao.id)}
                  title="Marcar como lida"
                  disabled={notificacao.id.toString().startsWith('aniver-')}
                  style={notificacao.id.toString().startsWith('aniver-') ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
                
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeletar(notificacao.id)}
                  title="Deletar"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
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

export { ListaNotificacoes };
