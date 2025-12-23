import defaultPostImage from '@/assets/login-bg.png';

type Props = {
  title?: string | null;
  imageUrl?: string | null;
  embedUrl?: string | null;
  showImage?: boolean;
  showVideo?: boolean;
};

export function PostMedia({
  title,
  imageUrl,
  embedUrl,
  showImage = true,
  showVideo = true,
}: Props) {
  const hasImage = showImage && (imageUrl || defaultPostImage);
  const hasVideo = showVideo && embedUrl;

  if (!hasImage && !hasVideo) return null;

  return (
    <>
      {hasImage && (
        <div className="h-48 w-full bg-gray-100 sm:h-64 md:h-96">
          <img
            src={imageUrl || defaultPostImage}
            alt={title ?? 'Imagem do post'}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {hasVideo && (
        <div className="mt-6 sm:mt-8">
          <h2 className="mb-4 text-xl font-semibold">Vídeo complementar</h2>
          <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
            <iframe
              src={embedUrl!}
              title="Vídeo do post"
              className="h-full w-full"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
