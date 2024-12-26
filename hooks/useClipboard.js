// hooks/useClipboard.js

'use client';
import { useState } from 'react';

const useClipboard = () => {
  const [clipboardData, setClipboardData] = useState(null);

  const readClipboard = async () => {
    if (!navigator.clipboard) {
      alert('Clipboard API not supported in your browser.');
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      setClipboardData(text);
    } catch (err) {
      alert('Failed to read clipboard contents: ' + err);
    }
  };

  return { clipboardData, readClipboard };
};

export default useClipboard;
