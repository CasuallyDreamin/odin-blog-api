import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * Sanitizes an HTML string to remove potentially malicious scripts and attributes.
 * @param {string} html The raw HTML string from the editor.
 * @returns {string} The safe, cleaned HTML string.
 */
export const sanitizeHtml = (html) => {
  if (!html) return '';
  return DOMPurify.sanitize(html, { 
    USE_PROFILES: { html: true } 
  });
};