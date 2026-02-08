interface MediaEmbed {
  type: 'youtube' | 'vimeo' | 'dailymotion' | 'twitch' | 'spotify' | 'soundcloud';
  id: string;
  url: string;
}

const MEDIA_PATTERNS: { type: MediaEmbed['type']; regex: RegExp; getId: (match: RegExpMatchArray) => string }[] = [
  {
    type: 'youtube',
    regex: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})(?:\S*)?/g,
    getId: (m) => m[1],
  },
  {
    type: 'vimeo',
    regex: /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)(?:\S*)?/g,
    getId: (m) => m[1],
  },
  {
    type: 'dailymotion',
    regex: /(?:https?:\/\/)?(?:www\.)?(?:dailymotion\.com\/video|dai\.ly)\/([\w]+)(?:\S*)?/g,
    getId: (m) => m[1],
  },
  {
    type: 'twitch',
    regex: /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([\w]+)(?:\S*)?/g,
    getId: (m) => m[1],
  },
  {
    type: 'spotify',
    regex: /(?:https?:\/\/)?open\.spotify\.com\/(track|album|playlist|episode|show)\/([\w]+)(?:\S*)?/g,
    getId: (m) => `${m[1]}/${m[2]}`,
  },
  {
    type: 'soundcloud',
    regex: /(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/([\w-]+\/[\w-]+)(?:\S*)?/g,
    getId: (m) => m[0],
  },
];

const extractEmbeds = (text: string): MediaEmbed[] => {
  const embeds: MediaEmbed[] = [];
  const seen = new Set<string>();

  for (const pattern of MEDIA_PATTERNS) {
    const regex = new RegExp(pattern.regex.source, 'g');
    let match;
    while ((match = regex.exec(text)) !== null) {
      const id = pattern.getId(match);
      const key = `${pattern.type}:${id}`;
      if (!seen.has(key)) {
        seen.add(key);
        embeds.push({ type: pattern.type, id, url: match[0] });
      }
    }
  }

  return embeds;
};

const stripEmbedUrls = (text: string): string => {
  let cleaned = text;
  for (const pattern of MEDIA_PATTERNS) {
    const regex = new RegExp(pattern.regex.source, 'g');
    cleaned = cleaned.replace(regex, '');
  }
  return cleaned.trim();
};

const VideoEmbed = ({ src, title }: { src: string; title: string }) => (
  <div className="mt-3">
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute inset-0 w-full h-full rounded-md border border-border"
        src={src}
        title={title}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </div>
);

const AudioEmbed = ({ src, title, height = 152 }: { src: string; title: string; height?: number }) => (
  <div className="mt-3">
    <iframe
      className="w-full rounded-md border border-border"
      src={src}
      title={title}
      height={height}
      allow="encrypted-media"
      style={{ border: 'none' }}
    />
  </div>
);

const renderEmbed = (embed: MediaEmbed) => {
  switch (embed.type) {
    case 'youtube':
      return <VideoEmbed key={embed.id} src={`https://www.youtube-nocookie.com/embed/${embed.id}`} title="YouTube video" />;
    case 'vimeo':
      return <VideoEmbed key={embed.id} src={`https://player.vimeo.com/video/${embed.id}`} title="Vimeo video" />;
    case 'dailymotion':
      return <VideoEmbed key={embed.id} src={`https://www.dailymotion.com/embed/video/${embed.id}`} title="Dailymotion video" />;
    case 'twitch':
      return <VideoEmbed key={embed.id} src={`https://player.twitch.tv/?channel=${embed.id}&parent=${window.location.hostname}`} title="Twitch stream" />;
    case 'spotify':
      return <AudioEmbed key={embed.id} src={`https://open.spotify.com/embed/${embed.id}`} title="Spotify" />;
    case 'soundcloud':
      return <AudioEmbed key={`sc-${embed.id}`} src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(embed.url)}&color=%23333&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`} title="SoundCloud" height={166} />;
    default:
      return null;
  }
};

export const renderContentWithEmbeds = (text: string) => {
  const embeds = extractEmbeds(text);
  const cleanedText = stripEmbedUrls(text);

  return (
    <>
      {cleanedText && <p className="whitespace-pre-wrap">{cleanedText}</p>}
      {embeds.map(renderEmbed)}
    </>
  );
};
