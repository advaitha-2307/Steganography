import EncodeCard from '../components/EncodeCard';

export default function EncryptPage({
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
  return (
    <div className="page-container">
      <EncodeCard
        imageFile={imageFile}
        imagePreview={imagePreview}
        onImageSelect={onImageSelect}
        message={message}
        setMessage={setMessage}
        password={password}
        setPassword={setPassword}
        onSubmit={onSubmit}
        isLoading={isLoading}
        success={success}
        stegoImage={stegoImage}
        onDownload={onDownload}
        metadata={metadata}
        error={error}
      />
    </div>
  );
}

