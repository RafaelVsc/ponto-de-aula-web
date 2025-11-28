/**
 * Normaliza qualquer URL do YouTube para formato embedável.
 * Suporta:
 * - https://www.youtube.com/watch?v=ID
 * - https://youtube.com/watch/?v=ID
 * - https://youtu.be/ID
 * - https://youtube.com/shorts/ID
 * - URLs com parâmetros extras (&t=30s, &si=..., etc)
 * - Já embed (retornada sem alterar)
 *
 * Retorna:
 * - URL segura (youtube-nocookie)
 * - null para URLs inválidas
 */

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  try {
    const videoUrl = new URL(url.trim());
    if (videoUrl.pathname.startsWith("/embed/")) {
      return `https://www.youtube-nocookie.com${videoUrl.pathname}`;
    }

    let videoId: string | null = null;
    // watch?v=ID
    if (videoUrl.searchParams.has("v")) {
      videoId = videoUrl.searchParams.get("v");
    }

    // youtu.be/ID
    if (!videoId && videoUrl.hostname === "youtu.be") {
      videoId = videoUrl.pathname.replace("/", "");
    }

    // youtube.com/shorts/ID
    if (!videoId && videoUrl.pathname.startsWith("/shorts/")) {
      videoId = videoUrl.pathname.replace("/shorts/", "").split("/")[0];
    }

    if (!videoId) return null;

    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  } catch {
    return null;
  }
}
