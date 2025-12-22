import React from 'react';
import '../styles/inputs.css';

export const Input = ({ label, tipo = 'text', placeholder, valor, onChange, erro, obrigatorio = false, disabled = false, name }) => {
  return (
    <div className="form-group">
      <label>
        {label}
        {obrigatorio && <span className="obrigatorio">*</span>}
      </label>
      <input
        type={tipo}
        name={name}
        className={`input ${erro ? 'input-erro' : ''}`}
        placeholder={placeholder}
        value={valor}
        onChange={onChange}
        disabled={disabled}
      />
      {erro && <span className="erro-mensagem">{erro}</span>}
    </div>
  );
};

export const TextArea = ({ label, placeholder, valor, onChange, erro, obrigatorio = false, linhas = 5, name }) => {
  return (
    <div className="form-group">
      <label>
        {label}
        {obrigatorio && <span className="obrigatorio">*</span>}
      </label>
      <textarea
        name={name}
        className={`textarea ${erro ? 'input-erro' : ''}`}
        placeholder={placeholder}
        value={valor}
        onChange={onChange}
        rows={linhas}
      />
      {erro && <span className="erro-mensagem">{erro}</span>}
    </div>
  );
};

export const Select = ({ label, opcoes, valor, onChange, erro, obrigatorio = false, name }) => {
  return (
    <div className="form-group">
      <label>
        {label}
        {obrigatorio && <span className="obrigatorio">*</span>}
      </label>
      <select
        name={name}
        className={`select ${erro ? 'input-erro' : ''}`}
        value={valor}
        onChange={onChange}
      >
        <option value="">Selecione...</option>
        {opcoes.map(opcao => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.label}
          </option>
        ))}
      </select>
      {erro && <span className="erro-mensagem">{erro}</span>}
    </div>
  );
};
