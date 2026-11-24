export default function ImagePreview({ imageSrc, fileName, dimensions, size, altText }) {
  if (!imageSrc) {
    return (
      <div className="image-placeholder">
        <span>No image selected</span>
      </div>
    );
  }

  return (
    <div className="image-preview-wrap">
      <img src={imageSrc} alt={altText} className="image-preview" />
      <div className="image-meta">
        <div><strong>File:</strong> {fileName}</div>
        <div><strong>Dimensions:</strong> {dimensions}</div>
        <div><strong>Size:</strong> {size}</div>
      </div>
    </div>
  );
}
