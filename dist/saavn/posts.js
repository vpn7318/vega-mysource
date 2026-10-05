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

// providers/saavn/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
module.exports = __toCommonJS(posts_exports);
var API = "https://www.jiosaavn.com/api.php";
var feedQueries = {
  hindi: "hindi hits",
  english: "english hits",
  punjabi: "punjabi hits",
  tamil: "tamil hits",
  telugu: "telugu hits",
  trending: "trending songs"
};
var clean = (value) => typeof value === "string" ? value.trim() : "";
var imageUrl = (song) => {
  const images = Array.isArray(song == null ? void 0 : song.image) ? song.image : [];
  const best = images[images.length - 1] || images[0];
  return clean((best == null ? void 0 : best.link) || (best == null ? void 0 : best.url));
};
var artists = (song) => {
  var _a, _b;
  const value = ((_a = song == null ? void 0 : song.more_info) == null ? void 0 : _a.singers) || ((_b = song == null ? void 0 : song.more_info) == null ? void 0 : _b.primary_artists) || (song == null ? void 0 : song.primary_artists) || "";
  return clean(value);
};
var packSong = (song) => {
  var _a, _b, _c;
  const payload = {
    id: clean(song == null ? void 0 : song.id),
    name: clean((song == null ? void 0 : song.title) || (song == null ? void 0 : song.song)),
    album: clean((_a = song == null ? void 0 : song.more_info) == null ? void 0 : _a.album),
    artist: artists(song),
    image: imageUrl(song),
    duration: Number(((_b = song == null ? void 0 : song.more_info) == null ? void 0 : _b.duration) || (song == null ? void 0 : song.duration)) || 0,
    encryptedMediaUrl: clean(
      (_c = song == null ? void 0 : song.more_info) == null ? void 0 : _c.encrypted_media_url
    )
  };
  return "saavn://" + encodeURIComponent(JSON.stringify(payload));
};
var toPost = (song) => {
  const id = clean(song == null ? void 0 : song.id);
  const name = clean((song == null ? void 0 : song.title) || (song == null ? void 0 : song.song));
  if (!id || !name) return null;
  const artist = artists(song);
  return {
    title: artist ? `${name} \u2014 ${artist}` : name,
    link: packSong(song),
    image: imageUrl(song),
    provider: "saavn",
    tag: "Song",
    aspectRatio: 1
  };
};
async function requestSongs(query, page, providerContext) {
  var _a;
  const { axios } = providerContext;
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
        api_version: 4
      },
      timeout: 15e3
    });
    const results = (_a = response == null ? void 0 : response.data) == null ? void 0 : _a.results;
    if (!Array.isArray(results)) return [];
    return results.map(toPost).filter(Boolean);
  } catch (error) {
    return [];
  }
}
var getPosts = async function({
  filter,
  page,
  providerContext
}) {
  return requestSongs(
    feedQueries[filter] || filter || "hindi hits",
    page,
    providerContext
  );
};
var getSearchPosts = async function({
  searchQuery,
  page,
  providerContext
}) {
  return requestSongs(
    searchQuery,
    page,
    providerContext
  );
};
