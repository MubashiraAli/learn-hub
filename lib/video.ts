/**
 * Works out how to play a lesson's `videoUrl`.
 *
 * Direct media files get a native <video> element; YouTube and Vimeo links get
 * an iframe. Accepting both means whatever form the video arrives in — a share
 * link or a file on a CDN — works without changing the lesson data.
 */

export type VideoSource =
  | { kind: "file"; src: string }
  | { kind: "embed"; src: string; provider: "youtube" | "vimeo" }
  | { kind: "none" };

const FILE_EXTENSIONS = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i;

export function resolveVideoSource(videoUrl?: string | null): VideoSource {
  const url = videoUrl?.trim();
  if (!url) return { kind: "none" };

  // Already an embed URL — use it as-is.
  if (/youtube\.com\/embed\//i.test(url)) {
    return { kind: "embed", src: url, provider: "youtube" };
  }
  if (/player\.vimeo\.com\/video\//i.test(url)) {
    return { kind: "embed", src: url, provider: "vimeo" };
  }

  // youtu.be/VIDEOID
  const short = url.match(/^https?:\/\/youtu\.be\/([A-Za-z0-9_-]{6,})/i);
  if (short) {
    return {
      kind: "embed",
      src: `https://www.youtube.com/embed/${short[1]}`,
      provider: "youtube",
    };
  }

  // youtube.com/watch?v=VIDEOID  (and /shorts/, /live/)
  if (/youtube\.com/i.test(url)) {
    let id: string | undefined;
    try {
      id = new URL(url).searchParams.get("v") ?? undefined;
    } catch {
      id = undefined;
    }
    if (!id) {
      id = url.match(/\/(?:shorts|live|v)\/([A-Za-z0-9_-]{6,})/i)?.[1];
    }
    if (id) {
      return {
        kind: "embed",
        src: `https://www.youtube.com/embed/${id}`,
        provider: "youtube",
      };
    }
  }

  // vimeo.com/123456789
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo) {
    return {
      kind: "embed",
      src: `https://player.vimeo.com/video/${vimeo[1]}`,
      provider: "vimeo",
    };
  }

  // A media file, either a local /public path or a remote CDN URL.
  if (FILE_EXTENSIONS.test(url) || url.startsWith("/")) {
    return { kind: "file", src: url };
  }

  // Unrecognised but present — try it as a file rather than silently hiding it.
  return { kind: "file", src: url };
}
