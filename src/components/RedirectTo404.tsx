import { useEffect } from 'react';
import { DEFAULT_URL } from '../Constant';

export default function RedirectTo404() {
  useEffect(() => {
    window.location.replace(`${DEFAULT_URL}/404.html`);
  }, []);
  return null;
}