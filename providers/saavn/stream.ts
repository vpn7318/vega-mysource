import * as CryptoJS from "crypto-js";
import {Stream, ProviderContext} from "../types";

const DES_KEY = "38346591";

const decodeLink = (link: string): any => {
  if (!link.startsWith("saavn://")) {
    throw new Error("Invalid Saavn link");
  }

  const encoded = link.slice("saavn://".length);

  try {
    return JSON.parse(decodeURIComponent(encoded));
  } catch {
    throw new Error("Invalid Saavn song data");
  }
};

const clean = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const decryptMediaUrl = (encrypted: string): string => {
  const value = clean(encrypted);

  if (!value) {
    throw new Error("Missing encrypted media URL");
  }

  try {
    const ciphertext = CryptoJS.enc.Base64.parse(value);

    const decrypted = CryptoJS.DES.decrypt(
      {
        ciphertext,
      } as CryptoJS.lib.CipherParams,
      CryptoJS.enc.Utf8.parse(DES_KEY),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const url = CryptoJS.enc.Utf8.stringify(decrypted)
      .replace(/\0+$/g, "")
      .trim();

    if (!url) {
      throw new Error("Empty decrypted URL");
    }

    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://")
    ) {
      throw new Error("Invalid decrypted media URL");
    }

    return url.replace(/^http:\/\//i, "https://");
  } catch {
    throw new Error("Failed to decrypt Saavn audio URL");
  }
};

const qualityNumber = (value: unknown): number => {
  const match = String(value || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const upgradeQuality = (url: string, wantedQuality: number): string => {
  if (!url) return url;

  const quality = wantedQuality || 320;

  return url
    .replace(/_(12|48|96|160|320)(?=\.[^./?]+(?:\?|$))/i, `_${quality}`)
    .replace(/_(12|48|96|160|320)(?=\/?(?:\?|$))/i, `_${quality}`);
};

export const getStreams = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Stream[]> {
  const song = decodeLink(link);

  const encrypted =
    clean(song?.encryptedMediaUrl) ||
    clean(song?.encrypted_media_url);

  if (!encrypted) {
    throw new Error("No encrypted Saavn audio URL");
  }

  const directUrl = decryptMediaUrl(encrypted);

  const streams: Stream[] = [];

  const qualities = [320, 160, 96];

  for (const quality of qualities) {
    const streamUrl = upgradeQuality(directUrl, quality);

    streams.push({
      server: "JioSaavn",
      link: streamUrl,
      type: "audio",
      quality: `${quality}kbps`,
      tag: quality === 320 ? "High Quality" : undefined,
    });
  }

  return streams;
};
