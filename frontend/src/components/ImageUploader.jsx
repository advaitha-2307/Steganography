export default function ImageUploader({ label, onFileSelect, selectedFile, previewUrl, accept = 'image/*' }) {
  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <label className="upload-box">
      <input type="file" accept={accept} onChange={handleChange} hidden />
      <div className="upload-inner">
        <span className="upload-icon">⬆</span>
        <span>{selectedFile ? selectedFile.name : label}</span>
      </div>
      {previewUrl && (
        <img src={previewUrl} alt="Preview" className="upload-thumb" />
      )}
    </label>
  );
}
