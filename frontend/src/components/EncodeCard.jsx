import { useState } from 'react';
import ImageUploader from './ImageUploader';
import ImagePreview from './ImagePreview';

export default function EncodeCard({
  imageFile,
  imagePreview,
  onImageSelect,
  message,
  setMessage,
  password,
  setPassword,
  onSubmit,
  isLoading,
  success,
  stegoImage,
  onDownload,
  metadata,
  error
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="panel encode-panel">
      <div className="panel-header">
        <span className="panel-kicker">ENCODE MESSAGE</span>
      </div>

      <div className="upload-row">
        <ImageUploader
          label="Upload Image"
          onFileSelect={onImageSelect}
          selectedFile={imageFile}
          previewUrl={imagePreview}
        />
      </div>

      {imageFile && (
        <ImagePreview
          imageSrc={imagePreview}
          fileName={imageFile.name}
          dimensions={metadata?.dimensions || '—'}
          size={metadata?.size || '—'}
          altText="Selected input image"
        />
      )}

      <label className="field-label">Secret Message</label>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type your secret message here..."
        rows={6}
      />

      <label className="field-label">Password</label>
      <div className="password-wrap">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
        />
        <button type="button" className="toggle-password" onClick={() => setShowPassword((value) => !value)}>
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <button type="button" className="primary-button" onClick={onSubmit} disabled={isLoading}>
        {isLoading ? 'Processing...' : '🔐 Encrypt & Hide Message'}
      </button>

      {error && <div className="error-box">{error}</div>}

      {success && stegoImage && (
        <div className="success-panel">
          <div className="success-message">Your message has been encrypted and hidden inside the image.</div>
          <img src={stegoImage} alt="Stego preview" className="stego-preview" />
          <button type="button" className="download-button" onClick={onDownload}>
            ⬇ Download Stego Image
          </button>
        </div>
      )}
    </section>
  );
}
