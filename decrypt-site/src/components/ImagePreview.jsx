export default function ImagePreview({ imageSrc, fileName, dimensions, size, altText }) {
  if (!imageSrc) {
    return (
      <div className="image-placeholder">
        <span>No image selected yet</span>
      </div>
    );
  }

  return (
    <div className="image-preview-wrap">
      <div className="image-frame">
        <img src={imageSrc} alt={altText} className="image-preview" />
      </div>
      <div className="image-meta">
        <span><strong>File:</strong> {fileName}</span>
        <span><strong>Dimensions:</strong> {dimensions}</span>
        <span><strong>Size:</strong> {size}</span>
      </div>
    </div>
  );
}

