import DecodeCard from '../components/DecodeCard';

export default function DecryptPage({
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
  return (
    <div className="page-container">
      <DecodeCard
        imageFile={imageFile}
        imagePreview={imagePreview}
        onImageSelect={onImageSelect}
        password={password}
        setPassword={setPassword}
        onSubmit={onSubmit}
        isLoading={isLoading}
        extractedMessage={extractedMessage}
        error={error}
        success={success}
        metadata={metadata}
        recentStegoImage={recentStegoImage}
        onDownloadStego={onDownloadStego}
        onGoToEncrypt={onGoToEncrypt}
      />
    </div>
  );
}

