export default function Toast({ message, type, visible }) {
  if (!visible || !message) {
    return null;
  }

  return (
    <div className={`toast ${type}`} role="alert">
      {message}
    </div>
  );
}

