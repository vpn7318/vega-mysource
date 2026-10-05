import {Post, ProviderContext} from "../types";

const API = "https://www.jiosaavn.com/api.php";

const feedQueries: Record<string, string> = {
  hindi: "hindi hits",
  english: "english hits",
  punjabi: "punjabi hits",
  tamil: "tamil hits",
  telugu: "telugu hits",
  trending: "trending songs",
};

const clean = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const imageUrl = (song: any): string => {
  const images = Array.isArray(song?.image) ? song.image : [];
  const best = images[images.length - 1] || images[0];
  return clean(best?.link || best?.url);
};

const artists = (song: any): string => {
  const value =
    song?.more_info?.singers ||
    song?.more_info?.primary_artists ||
    song?.primary_artists ||
    "";

  return clean(value);
};

const packSong = (song: any): string => {
  const payload = {
    id: clean(song?.id),
    name: clean(song?.title || song?.song),
    album: clean(song?.more_info?.album),
    artist: artists(song),
    image: imageUrl(song),
    duration: Number(song?.more_info?.duration || song?.duration) || 0,

    encryptedMediaUrl: clean(
      song?.more_info?.encrypted_media_url
    ),
  };

  return "saavn://" + encodeURIComponent(JSON.stringify(payload));
};

const toPost = (song: any): Post | null => {
  const id = clean(song?.id);
  const name = clean(song?.title || song?.song);

  if (!id || !name) return null;

  const artist = artists(song);

  return {
    title: artist ? `${name} — ${artist}` : name,
    link: packSong(song),
    image: imageUrl(song),
    provider: "saavn",
    tag: "Song",
    aspectRatio: 1,
  };
};

async function requestSongs(
  query: string,
  page: number,
  providerContext: ProviderContext,
): Promise<Post[]> {
  const {axios} = providerContext;

  try {
    const response = await axios.get(API, {
      params: {
        __call: "search.getResults",
        q: query,
        n: 20,
        p: page || 1,
        _format: "json",
        _marker: 0,
        ctx: "web6dot0",
        api_version: 4,
      },
      timeout: 15000,
    });

    const results = response?.data?.results;

    if (!Array.isArray(results)) return [];

    return results
      .map(toPost)
      .filter(Boolean) as Post[];
  } catch (error) {
    return [];
  }
}

export const getPosts = async function ({
  filter,
  page,
  providerContext,
}: {
  filter: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  return requestSongs(
    feedQueries[filter] || filter || "hindi hits",
    page,
    providerContext
  );
};

export const getSearchPosts = async function ({
  searchQuery,
  page,
  providerContext,
}: {
  searchQuery: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  return requestSongs(
    searchQuery,
    page,
    providerContext
  );
};

1. "providers/saavn/posts.ts" kholo
2. Purana poora code delete karo
3. Upar wala poora code paste karo
4. Commit changes / Save karo
5. Test abhi mat karna
6. Mujhe bas “save ho gaya” bolo.

Uske baad main tumhe "stream.ts" ka poora code dunga jo is "encryptedMediaUrl" ko handle karega.
