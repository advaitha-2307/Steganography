import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import Toast from './components/Toast';
import EncryptPage from './pages/EncryptPage';
import DecryptPage from './pages/DecryptPage';
import { encodeImage, decodeImage } from './services/api';

const ENCRYPT_PATH = '/encrypt';
const DECRYPT_PATH = '/decrypt';

function normalizePath(pathname) {
  if (pathname === DECRYPT_PATH) return DECRYPT_PATH;
  return ENCRYPT_PATH;
}

function dataUrlToFile(dataUrl, fileName = 'stego-image.png') {
  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/data:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], fileName, { type: mime });
}

function App() {
  const [currentPage, setCurrentPage] = useState(() => normalizePath(window.location.pathname));
  const [encodeImageFile, setEncodeImageFile] = useState(null);
  const [decodeImageFile, setDecodeImageFile] = useState(null);
  const [encodeMessage, setEncodeMessage] = useState('');
  const [encodePassword, setEncodePassword] = useState('');
  const [decodePassword, setDecodePassword] = useState('');
  const [encodePreview, setEncodePreview] = useState('');
  const [decodePreview, setDecodePreview] = useState('');
  const [encodeMetadata, setEncodeMetadata] = useState({});
  const [decodeMetadata, setDecodeMetadata] = useState({});
  const [stegoImage, setStegoImage] = useState('');
  const [recentStegoImage, setRecentStegoImage] = useState('');
  const [extractedMessage, setExtractedMessage] = useState('');
  const [encodeError, setEncodeError] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const [encodeSuccess, setEncodeSuccess] = useState(false);
  const [decodeSuccess, setDecodeSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);

  const navigate = useCallback((targetPath, { replace = false } = {}) => {
    const normalized = normalizePath(targetPath);
    if (window.location.pathname !== normalized) {
      if (replace) {
        window.history.replaceState({}, '', normalized);
      } else {
        window.history.pushState({}, '', normalized);
      }
    }
    setCurrentPage(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const normalized = normalizePath(window.location.pathname);
    if (window.location.pathname !== normalized) {
      window.history.replaceState({}, '', normalized);
    }

    const handlePopState = () => {
      setCurrentPage(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.title =
      currentPage === DECRYPT_PATH
        ? 'Decrypt — Image Steganography Tool'
        : 'Encrypt — Image Steganography Tool';
  }, [currentPage]);

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

  const handleEncodeFile = async (file) => {
    setEncodeError('');
    setEncodeSuccess(false);
    setStegoImage('');

    try {
      const data = await readImageFile(file);
      setEncodeImageFile(file);
      setEncodePreview(data.src);
      setEncodeMetadata({
        dimensions: `${data.width} × ${data.height}`,
        size: `${(file.size / 1024).toFixed(2)} KB`
      });
    } catch (error) {
      setEncodeError('Invalid image format');
    }
  };

  const handleDecodeFile = async (file) => {
    setDecodeError('');
    setDecodeSuccess(false);
    setExtractedMessage('');
    setRecentStegoImage('');

    try {
      const data = await readImageFile(file);
      setDecodeImageFile(file);
      setDecodePreview(data.src);
      setDecodeMetadata({
        dimensions: `${data.width} × ${data.height}`,
        size: `${(file.size / 1024).toFixed(2)} KB`
      });
    } catch (error) {
      setDecodeError('Invalid image format');
    }
  };

  const showToast = (message, type = 'success') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ visible: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast({ visible: false, message: '', type });
    }, 3200);
  };

  const handleEncodeSubmit = async () => {
    if (!encodeImageFile) {
      setEncodeError('No image selected');
      return;
    }

    if (!encodeMessage.trim()) {
      setEncodeError('Message cannot be empty');
      return;
    }

    if (!encodePassword.trim()) {
      setEncodeError('Password cannot be empty');
      return;
    }

    setIsLoading(true);
    setEncodeError('');

    try {
      const result = await encodeImage({
        imageFile: encodeImageFile,
        message: encodeMessage,
        password: encodePassword
      });

      const stegoDataUrl = result.stegoImage;
      const stegoFile = dataUrlToFile(stegoDataUrl, 'stego-image.png');
      const dimensions =
        result.metadata?.width && result.metadata?.height
          ? `${result.metadata.width} × ${result.metadata.height}`
          : encodeMetadata.dimensions || '—';

      setStegoImage(stegoDataUrl);
      setEncodeSuccess(true);

      // Pre-load the encrypted stego image on the Decryption page and reset previous decode outputs
      setRecentStegoImage(stegoDataUrl);
      setDecodeImageFile(stegoFile);
      setDecodePreview(stegoDataUrl);
      setDecodeMetadata({
        dimensions,
        size: `${(stegoFile.size / 1024).toFixed(2)} KB`
      });
      setDecodePassword('');
      setDecodeError('');
      setDecodeSuccess(false);
      setExtractedMessage('');

      showToast('Message encrypted! Redirected to Decryption page.', 'success');
      navigate(DECRYPT_PATH);
    } catch (error) {
      setEncodeError(error.message || 'Failed to process image');
      showToast(error.message || 'Failed to process image', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecodeSubmit = async () => {
    if (!decodeImageFile) {
      setDecodeError('No image selected');
      return;
    }

    if (!decodePassword.trim()) {
      setDecodeError('Password cannot be empty');
      return;
    }

    setIsLoading(true);
    setDecodeError('');

    try {
      const result = await decodeImage({
        imageFile: decodeImageFile,
        password: decodePassword
      });

      setExtractedMessage(result.message || '');
      setDecodeSuccess(true);
      showToast('Secret message extracted successfully', 'success');
    } catch (error) {
      setDecodeError(error.message || 'Incorrect password or corrupted image.');
      showToast(error.message || 'Incorrect password or corrupted image.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (imageDataUrl = stegoImage) => {
    if (!imageDataUrl) return;
    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = 'stego-image.png';
    link.click();
  };

  const encodeMetaText = useMemo(() => ({
    dimensions: encodeMetadata.dimensions,
    size: encodeMetadata.size
  }), [encodeMetadata]);

  const decodeMetaText = useMemo(() => ({
    dimensions: decodeMetadata.dimensions,
    size: decodeMetadata.size
  }), [decodeMetadata]);

  return (
    <div className="app-shell">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <Header />
      <main className="page-main">
        {currentPage === DECRYPT_PATH ? (
          <DecryptPage
            imageFile={decodeImageFile}
            imagePreview={decodePreview}
            onImageSelect={handleDecodeFile}
            password={decodePassword}
            setPassword={setDecodePassword}
            onSubmit={handleDecodeSubmit}
            isLoading={isLoading}
            extractedMessage={extractedMessage}
            error={decodeError}
            success={decodeSuccess}
            metadata={decodeMetaText}
            recentStegoImage={recentStegoImage}
            onDownloadStego={() => handleDownload(recentStegoImage)}
            onGoToEncrypt={() => navigate(ENCRYPT_PATH)}
          />
        ) : (
          <EncryptPage
            imageFile={encodeImageFile}
            imagePreview={encodePreview}
            onImageSelect={handleEncodeFile}
            message={encodeMessage}
            setMessage={setEncodeMessage}
            password={encodePassword}
            setPassword={setEncodePassword}
            onSubmit={handleEncodeSubmit}
            isLoading={isLoading}
            success={encodeSuccess}
            stegoImage={stegoImage}
            onDownload={() => handleDownload(stegoImage)}
            metadata={encodeMetaText}
            error={encodeError}
          />
        )}
      </main>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </div>
  );
}

export default App;
