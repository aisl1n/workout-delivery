import { PREFIX_URL } from "@/constants";

/**
 * Converte uma URL do YouTube (seja no formato youtu.be ou youtube.com/watch?v=)
 * para uma URL de embed do YouTube.
 * Retorna undefined se a URL de entrada for inválida ou não for reconhecida.
 *
 * @param url A URL original do YouTube.
 * @returns A URL de embed do YouTube, ou undefined se a entrada for inválida.
 */
export function getYouTubeEmbedUrl(url: string | null): string | undefined {
  if (!url) return undefined;

  const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtuBeMatch) {
    return `${PREFIX_URL}${youtuBeMatch[1]}`;
  }

  const youtubeMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return `${PREFIX_URL}${youtubeMatch[1]}`;
  }

  return undefined;
}
