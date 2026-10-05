import * as CryptoJS from "crypto-js";
import {Stream, ProviderContext} from "../types";

const DES_KEY = "38346591";

const decodeLink = (link: string): any => {
  if (!link.startsWith("saavn://")) {
    throw new Error("Invalid Saavn link");
  }

  try {
    return JSON.parse(
      decodeURIComponent(link.slice("saavn://".length))
    );
  } catch {
    throw new Error("Invalid Saavn song data");
  }
};

const clean = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const decryptMediaUrl = (encrypted: string): string => {
  if (!encrypted) {
    throw new Error("Missing encrypted Saavn audio URL");
  }

  try {
    const ciphertext = CryptoJS.enc.Base64.parse(encrypted);

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

    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://")
    ) {
      throw new Error("Invalid decrypted URL");
    }

    return url.replace(/^http:\/\//i, "https://");
  } catch {
    throw new Error("Failed to decrypt Saavn audio URL");
  }
};

export const getStream = async function ({
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

  const audioUrl = decryptMediaUrl(encrypted);

  return [
    {
      server: "JioSaavn",
      link: audioUrl,
      type: "audio",
      quality: "320kbps",
      tag: "High Quality",
    },
  ];
};
