const API="https://www.jiosaavn.com/api.php";

const feedQueries={
  hindi:"hindi hits",
  english:"english hits",
  punjabi:"punjabi hits",
  tamil:"tamil hits",
  telugu:"telugu hits",
  trending:"trending songs"
};

const s=v=>typeof v==="string"?v.trim():"";

const image=song=>{
  const a=Array.isArray(song?.image)?song.image:[];
  const x=a[a.length-1]||a[0];
  return s(x?.link||x?.url);
};

const artists=song=>{
  return s(
    song?.more_info?.singers||
    song?.more_info?.primary_artists||
    song?.primary_artists||
    ""
  );
};

const pack=song=>{
  const payload={
    id:s(song?.id),
    name:s(song?.title||song?.song),
    album:s(song?.more_info?.album),
    artist:artists(song),
    image:image(song),
    duration:Number(song?.more_info?.duration||song?.duration)||0,
    downloadUrl:[]
  };

  return "saavn://"+encodeURIComponent(JSON.stringify(payload));
};

const post=song=>{
  const id=s(song?.id);
  const name=s(song?.title||song?.song);

  if(!id||!name)return null;

  const a=artists(song);

  return {
    title:a?`${name} — ${a}`:name,
    link:pack(song),
    image:image(song),
    provider:"saavn",
    tag:"Song",
    aspectRatio:1
  };
};

async function request(q,p,ctx){
  try{
    const r=await ctx.axios.get(API,{
      params:{
        __call:"search.getResults",
        q:q,
        n:20,
        p:p||1,
        _format:"json",
        _marker:0,
        ctx:"web6dot0",
        api_version:4
      },
      timeout:15000
    });

    const rows=r?.data?.results;

    if(!Array.isArray(rows))return [];

    return rows.map(post).filter(Boolean);
  }catch(e){
    return [];
  }
}

exports.getPosts=async({filter,page,providerContext})=>{
  return request(
    feedQueries[filter]||filter||"hindi hits",
    page,
    providerContext
  );
};

exports.getSearchPosts=async({searchQuery,page,providerContext})=>{
  return request(searchQuery,page,providerContext);
};
