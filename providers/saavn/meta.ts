import {Info, ProviderContext} from "../types";

const decode = (link: string): any => {
  if (!link.startsWith("saavn://")) throw new Error("Invalid Saavn link");
  const raw = decodeURIComponent(link.slice("saavn://".length));
  return JSON.parse(raw);
};

export const getMeta = async function ({
  link,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  const song = decode(link);
  const artist = song.artist || "Unknown artist";
  const album = song.album || "Saavn";

  return {
    title: song.name || "Unknown song",
    image: song.image || "",
    poster: song.image || "",
    synopsis: `${artist}${album ? ` • ${album}` : ""}`,
    type: "movie",
    tags: ["music", "saavn", artist].filter(Boolean),
    linkList: [
      {
        title: "Audio",
        directLinks: [
          {
            title: song.name || "Song",
            link,
            type: "movie",
            image: song.image || "",
          },
        ],
      },
    ],
  };
};
