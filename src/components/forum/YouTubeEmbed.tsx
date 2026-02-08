const YOUTUBE_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})(?:\S*)?/g;

export const extractYouTubeIds = (text: string): string[] => {
  const ids: string[] = [];
  let match;
  const regex = new RegExp(YOUTUBE_REGEX.source, 'g');
  while ((match = regex.exec(text)) !== null) {
    if (!ids.includes(match[1])) ids.push(match[1]);
  }
  return ids;
};

export const renderContentWithEmbeds = (text: string) => {
  const ids = extractYouTubeIds(text);
  const regex = new RegExp(YOUTUBE_REGEX.source, 'g');
  const cleanedText = text.replace(regex, '').trim();

  return (
    <>
      {cleanedText && <p className="whitespace-pre-wrap">{cleanedText}</p>}
      {ids.map((id) => (
        <div key={id} className="mt-3">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-md border border-border"
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title="YouTube video"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ))}
    </>
  );
};
