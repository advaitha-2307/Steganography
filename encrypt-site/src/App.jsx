import { useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import EncodeCard from './components/EncodeCard';
import Toast from './components/Toast';
import { encodeImage } from './services/api';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [metadata, setMetadata] = useState({});
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [stegoImage, setStegoImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const readImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          resolve({
            src: reader.result,
            width: img.width,
            height: img.height
          });
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error('Failed to load image'));
      reader.readAsDataURL(file);
    });
  };

  const showToast = (toastMessage, type = 'success') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ visible: true, message: toastMessage, type });
    toastTimerRef.current = setTimeout(() => {
      setToast({ visible: false, message: '', type });
    }, 3200);
  };

  const handleImageSelect = async (file) => {
    setError('');
    setSuccess(false);
    setStegoImage('');

    try {
      const data = await readImageFile(file);
      setImageFile(file);
      setImagePreview(data.src);
      setMetadata({
        dimensions: `${data.width} × ${data.height}`,
        size: `${(file.size / 1024).toFixed(2)} KB`
      });
    } catch {
      setError('Invalid image format');
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      setError('Please select a cover image first.');
      return;
    }

    if (!message.trim()) {
      setError('Message cannot be empty.');
      return;
    }

    if (!password.trim()) {
      setError('Password cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await encodeImage({
        imageFile,
        message,
        password
      });

      setStegoImage(result.stegoImage);
      setSuccess(true);
      showToast('Message encrypted and hidden inside the PNG image.', 'success');
    } catch (err) {
      const errMessage = err.message || 'Failed to process image';
      setError(errMessage);
      showToast(errMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!stegoImage) return;
    const link = document.createElement('a');
    link.href = stegoImage;
    link.download = 'stego-image.png';
    link.click();
  };

  const handleReset = () => {
    setImageFile(null);
    setImagePreview('');
    setMetadata({});
    setMessage('');
    setPassword('');
    setStegoImage('');
    setError('');
    setSuccess(false);
  };

  const metaText = useMemo(() => ({
    dimensions: metadata.dimensions,
    size: metadata.size
  }), [metadata]);

  return (
    <div className="app-shell">
      <Header />
      <main className="page-main">
        <div className="page-container">
          <EncodeCard
            imageFile={imageFile}
            imagePreview={imagePreview}
            onImageSelect={handleImageSelect}
            message={message}
            setMessage={setMessage}
            password={password}
            setPassword={setPassword}
            onSubmit={handleSubmit}
            onReset={handleReset}
            isLoading={isLoading}
            success={success}
            stegoImage={stegoImage}
            onDownload={handleDownload}
            metadata={metaText}
            error={error}
          />
        </div>
      </main>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </div>
  );
}

export default App;
