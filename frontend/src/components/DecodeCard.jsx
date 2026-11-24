import { useState } from 'react';
import ImageUploader from './ImageUploader';
import ImagePreview from './ImagePreview';

export default function DecodeCard({
  imageFile,
  imagePreview,
  onImageSelect,
  password,
  setPassword,
  onSubmit,
  isLoading,
  extractedMessage,
  error,
  success,
  metadata,
  recentStegoImage,
  onDownloadStego,
  onGoToEncrypt
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="panel decode-panel">
      <div className="panel-header panel-header-row">
        <span className="panel-kicker">DECODE MESSAGE</span>
        {onGoToEncrypt && (
          <button type="button" className="secondary-link-button" onClick={onGoToEncrypt}>
            ← Encrypt another image
          </button>
        )}
      </div>

      {recentStegoImage && (
        <div className="redirect-banner">
          <div className="redirect-banner-text">
            <strong>Image encrypted successfully!</strong> Your stego image has been loaded below for decryption.
          </div>
          <button type="button" className="download-button banner-download-button" onClick={onDownloadStego}>
            ⬇ Download Stego Image
          </button>
        </div>
      )}

      <div className="upload-row">
        <ImageUploader
          label="Upload Stego Image"
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
          altText="Selected stego image"
        />
      )}

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
        {isLoading ? 'Processing...' : '🔓 Extract & Decrypt Message'}
      </button>

      {error && <div className="error-box">{error}</div>}

      {success && extractedMessage && (
        <div className="decoded-output">
          <div className="success-message">Extracted Secret Message</div>
          <textarea readOnly value={extractedMessage} rows={6} />
        </div>
      )}
    </section>
  );
}
