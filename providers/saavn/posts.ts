import {Post, ProviderContext} from "../types";

const API = "https://saavn.dev/api/search/songs";

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
  return clean(best?.url);
};

const artists = (song: any): string => {
  const primary = song?.artists?.primary;
  if (Array.isArray(primary)) {
    return primary.map((a: any) => clean(a?.name)).filter(Boolean).join(", ");
  }
  return "";
};

const packSong = (song: any): string => {
  const payload = {
    id: clean(song?.id),
    name: clean(song?.name),
    album: clean(song?.album?.name),
    artist: artists(song),
    image: imageUrl(song),
    duration: Number(song?.duration) || 0,
    downloadUrl: Array.isArray(song?.downloadUrl)
      ? song.downloadUrl
          .map((x: any) => ({quality: clean(x?.quality), url: clean(x?.url)}))
          .filter((x: any) => x.url)
      : [],
  };
  return "saavn://" + encodeURIComponent(JSON.stringify(payload));
};

const toPost = (song: any): Post | null => {
  const id = clean(song?.id);
  const name = clean(song?.name);
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
  const limit = 20;
  const response = await axios.get(API, {
    params: {
      query,
      page,
      limit,
    },
    timeout: 15000,
  });

  const results = response?.data?.data?.results;
  if (!Array.isArray(results)) return [];

  return results.map(toPost).filter(Boolean) as Post[];
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
  return requestSongs(feedQueries[filter] || filter || "hindi hits", page, providerContext);
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
  return requestSongs(searchQuery, page, providerContext);
};
