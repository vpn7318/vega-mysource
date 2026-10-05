import {Stream, ProviderContext} from "../types";

const decode = (link: string): any => {
  if (!link.startsWith("saavn://")) throw new Error("Invalid Saavn link");
  return JSON.parse(decodeURIComponent(link.slice("saavn://".length)));
};

const qualityNumber = (value: string): number => {
  const match = String(value || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
};

export const getStream = async function ({
  link,
  providerContext,
}: {
  link: string;
  type: string;
  signal?: AbortSignal;
  providerContext: ProviderContext;
  isDownload?: boolean;
}): Promise<Stream[]> {
  const song = decode(link);
  const urls = Array.isArray(song?.downloadUrl) ? song.downloadUrl : [];

  const unique = new Map<string, any>();
  for (const item of urls) {
    if (item?.url) unique.set(item.url, item);
  }

  const streams = [...unique.values()]
    .sort((a, b) => qualityNumber(b.quality) - qualityNumber(a.quality))
    .map((item: any) => ({
      server: `Saavn ${item.quality || "Audio"}`,
      link: item.url,
      type: "mp4",
      quality: item.quality || "audio",
      tag: "Audio",
    }));

  if (!streams.length) {
    throw new Error("No Saavn audio stream was returned");
  }

  return streams;
};
