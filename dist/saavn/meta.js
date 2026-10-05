"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// providers/saavn/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
module.exports = __toCommonJS(meta_exports);
var decode = (link) => {
  if (!link.startsWith("saavn://")) throw new Error("Invalid Saavn link");
  const raw = decodeURIComponent(link.slice("saavn://".length));
  return JSON.parse(raw);
};
var getMeta = async function({
  link
}) {
  const song = decode(link);
  const artist = song.artist || "Unknown artist";
  const album = song.album || "Saavn";
  return {
    title: song.name || "Unknown song",
    image: song.image || "",
    poster: song.image || "",
    synopsis: `${artist}${album ? ` \u2022 ${album}` : ""}`,
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
            image: song.image || ""
          }
        ]
      }
    ]
  };
};
