import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string) {
  // Sanitize and force links to open in new tab with rel protection.
  const clean = DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'rel', 'data-list'],
  });

  const parser = new DOMParser();
  const doc = parser.parseFromString(clean, 'text/html');
  doc.querySelectorAll('a').forEach(a => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });

  return doc.body.innerHTML;
}

export function stripHtml(html: string) {
  const clean = sanitizeHtml(html);
  // Substitui tags por espaço para não colar palavras/links, depois compacta.
  return clean
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
