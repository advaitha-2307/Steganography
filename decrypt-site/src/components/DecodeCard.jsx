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
  onReset,
  isLoading,
  extractedMessage,
  error,
  success,
  metadata
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = async () => {
    if (!extractedMessage || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(extractedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard permission failure
    }
  };

  return (
    <section className="panel decode-panel">
      <div className="panel-header panel-header-row">
        <div>
          <h2 className="panel-title">Decrypt a message</h2>
          <p className="panel-subtitle">Select the encoded PNG image you received and enter the password to unlock it.</p>
        </div>
        {(imageFile || password || extractedMessage) && (
          <button type="button" className="secondary-link-button" onClick={onReset}>
            Clear
          </button>
        )}
      </div>

      <div className="upload-row">
        <ImageUploader
          label="Choose an encoded PNG image"
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
          altText="Selected encoded image"
        />
      )}

      <div className="form-group">
        <label className="field-label" htmlFor="decode-password">Password</label>
        <div className="password-wrap">
          <input
            id="decode-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter the password shared by the sender"
          />
          <button type="button" className="toggle-password" onClick={() => setShowPassword((value) => !value)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <button type="button" className="primary-button" onClick={onSubmit} disabled={isLoading}>
        {isLoading ? 'Decrypting message...' : 'Extract & Decrypt Message'}
      </button>

      {error && <div className="error-box" role="alert">{error}</div>}

      {success && extractedMessage && (
        <div className="decoded-output">
          <div className="decoded-output-header">
            <span className="success-message">Extracted secret message</span>
            <button type="button" className="copy-button" onClick={handleCopyMessage}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea readOnly value={extractedMessage} rows={5} />
        </div>
      )}
    </section>
  );
}

