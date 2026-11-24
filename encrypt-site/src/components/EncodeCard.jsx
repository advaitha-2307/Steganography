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
  onReset,
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
      <div className="panel-header panel-header-row">
        <div>
          <h2 className="panel-title">Encrypt a message</h2>
          <p className="panel-subtitle">Choose a cover image, write your message, and protect it with a password.</p>
        </div>
        {(imageFile || message || password || stegoImage) && (
          <button type="button" className="secondary-link-button" onClick={onReset}>
            Start over
          </button>
        )}
      </div>

      <div className="upload-row">
        <ImageUploader
          label="Choose a cover image"
          onFileSelect={onImageSelect}
          selectedFile={imageFile}
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

      <div className="form-group">
        <label className="field-label" htmlFor="encode-message">Secret message</label>
        <textarea
          id="encode-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write the message you want to hide..."
          rows={5}
        />
      </div>

      <div className="form-group">
        <label className="field-label" htmlFor="encode-password">Password</label>
        <div className="password-wrap">
          <input
            id="encode-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password to protect this message"
          />
          <button type="button" className="toggle-password" onClick={() => setShowPassword((value) => !value)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <button type="button" className="primary-button" onClick={onSubmit} disabled={isLoading}>
        {isLoading ? 'Encrypting image...' : 'Encrypt & Hide Message'}
      </button>

      {error && <div className="error-box" role="alert">{error}</div>}

      {success && stegoImage && (
        <div className="success-panel">
          <div className="success-message">Your message is hidden inside this PNG image.</div>
          <p className="success-note">
            Download the lossless PNG below and share it with the recipient along with your password. Avoid apps that compress images.
          </p>
          <img src={stegoImage} alt="Encoded stego preview" className="stego-preview" />
          <div className="success-actions">
            <button type="button" className="download-button" onClick={onDownload}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Stego PNG
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
