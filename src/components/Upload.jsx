import React, { useRef, useState } from 'react';
import '../styles/upload.css';

export const Upload = ({ onUpload, aceita = 'image/*', multiplo = false, erro, label = 'Upload de Fotos' }) => {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const arquivos = Array.from(e.target.files || []);
    processarArquivos(arquivos);
  };

  const processarArquivos = (arquivos) => {
    if (!multiplo && arquivos.length > 1) {
      arquivos.splice(1);
    }

    // Apenas mostra preview da primeira imagem (para upload único)
    if (!multiplo && arquivos.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(arquivos[0]);
    }

    onUpload(arquivos);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const arquivos = Array.from(e.dataTransfer.files || []);
    processarArquivos(arquivos);
  };

  return (
    <div className="upload-container">
      <input
        ref={inputRef}
        type="file"
        accept={aceita}
        multiple={multiplo}
        onChange={handleChange}
        className="upload-input"
      />
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${erro ? 'upload-erro' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="upload-preview" />
        ) : (
          <>
            <div className="upload-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <p>Clique ou arraste arquivos aqui</p>
            <span className="upload-info">Formatos: JPG, PNG, GIF</span>
          </>
        )}
      </div>
      {erro && <span className="erro-mensagem">{erro}</span>}
    </div>
  );
};
