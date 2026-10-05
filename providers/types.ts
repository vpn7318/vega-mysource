export interface Post {
  title: string;
  link: string;
  image: string;
  provider?: string;
  aspectRatio?: number | string;
  tag?: string;
}
export interface Info {
  title: string; image: string; poster?: string; synopsis: string; type: string; tags?: string[];
  linkList: Link[];
}
export interface Link {
  title: string;
  quality?: string;
  directLinks?: {title: string; link: string; type?: "movie"|"series"; image?: string}[];
}
export interface Stream {
  server: string; link: string; type: string; quality?: string; tag?: string;
}
export interface ProviderContext {
  axios: any; kvStore: any; [key: string]: any;
}
export interface SettingsField {key:string; type:"select"|"text"|"toggle"|"number"|"multiselect"; label:string; description?:string; options?:any[]; defaultValue?:any;}
