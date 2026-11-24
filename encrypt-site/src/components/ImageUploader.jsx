import { useState } from 'react';

export default function ImageUploader({ label, onFileSelect, selectedFile, accept = 'image/*' }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <label
      className={`upload-box${isDragging ? ' is-dragging' : ''}${selectedFile ? ' has-file' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" accept={accept} onChange={handleChange} hidden />
      <div className="upload-inner">
        <span className="upload-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </span>
        <div className="upload-copy">
          <span className="upload-title">{selectedFile ? selectedFile.name : label}</span>
          <span className="upload-hint">
            {selectedFile ? 'Click or drag another image to replace' : 'Drag and drop an image here, or click to browse'}
          </span>
        </div>
      </div>
    </label>
  );
}
