/* TEAM AZUCAR — integrantes + muro comunitario sin límite de API */
const integrantes = [
  { nombre:"Próximamente", frase:"Acá va a aparecer la frase de un integrante para Azucar.", imagen:"", detalle:"Dibujo + mensaje" },
  { nombre:"Próximamente", frase:"Estamos juntando dibujos y palabras para llenar esta sección.", imagen:"", detalle:"Dibujo + mensaje" },
  { nombre:"Próximamente", frase:"Cada integrante va a tener su propio rincón para Jonathan.", imagen:"", detalle:"Dibujo + mensaje" }
];

(() => {
  const realFetch = window.fetch.bind(window);
  let cache = null, cacheAt = 0;

  async function community(force=false){
    if(!force && cache && Date.now()-cacheAt < 8000) return cache;
    const r = await realFetch(`data/community.json?v=${Date.now()}`, {cache:"no-store"});
    if(!r.ok) throw new Error("community.json no disponible");
    cache = await r.json(); cacheAt = Date.now(); return cache;
  }

  const json = value => new Response(JSON.stringify(value), {
    status:200, headers:{"Content-Type":"application/json; charset=utf-8"}
  });

  /* El index consulta api.github.com. Lo interceptamos y respondemos desde el
     JSON que genera GitHub Actions, así los visitantes no gastan el límite de
     60 consultas/hora de la API pública. */
  window.fetch = async (input, init) => {
    const raw = typeof input === "string" ? input : input?.url;
    let u; try { u = new URL(raw, location.href); } catch { return realFetch(input, init); }
    if(u.hostname !== "api.github.com") return realFetch(input, init);

    const list = /^\/repos\/[^/]+\/[^/]+\/issues\/?$/i.test(u.pathname);
    const comments = u.pathname.match(/^\/repos\/[^/]+\/[^/]+\/issues\/(\d+)\/comments\/?$/i);
    if(!list && !comments) return realFetch(input, init);

    try{
      const data = await community(false);
      const posts = Array.isArray(data.posts) ? data.posts : [];
      if(comments){
        const post = posts.find(p => Number(p.number) === Number(comments[1]));
        return json(post?.replies || []);
      }
      return json(posts);
    }catch(e){
      console.error("TEAM AZUCAR muro:", e);
      return new Response('{"message":"Muro temporalmente no disponible"}', {
        status:503, headers:{"Content-Type":"application/json"}
      });
    }
  };

  function mediaFrom(body=""){
    const out=[], seen=new Set(); let m;
    const add=(type,src)=>{ src=(src||"").replace(/&amp;/g,"&").trim(); if(src && /^https?:\/\//i.test(src) && !seen.has(src)){seen.add(src);out.push({type,src});} };
    const md=/!\[[^\]]*]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/gi;
    while((m=md.exec(body))) add("image",m[1]);
    const img=/<img\b[^>]*?\bsrc=["']([^"']+)["'][^>]*>/gi;
    while((m=img.exec(body))) add("image",m[1]);
    const vid=/<(?:video|source)\b[^>]*?\bsrc=["']([^"']+)["'][^>]*>/gi;
    while((m=vid.exec(body))) add("video",m[1]);
    const bare=/(https?:\/\/[^\s<>"')\]]+)/gi;
    while((m=bare.exec(body))){
      const src=m[1];
      if(/\.(mp4|webm|mov)(\?|$)/i.test(src)) add("video",src);
      else if(/\.(gif|png|jpe?g|webp)(\?|$)/i.test(src) || /github\.com\/user-attachments\/assets\//i.test(src)) add("image",src);
    }
    return out;
  }

  function ensureGallery(){
    let g=document.getElementById("communityGallery"); if(g) return g;
    const muro=document.getElementById("muro"); if(!muro) return null;
    const box=document.createElement("div"); box.style.marginTop="34px";
    box.innerHTML=`
      <div class="section-head">
        <div><div class="eyebrow">Fan Art / Community Gallery</div><h2>🎨 Dibujos y GIFs del grupo</h2></div>
        <p class="section-note">Todo dibujo, imagen o GIF adjuntado en un mensaje aparece también acá para Jonathan.</p>
      </div>
      <div class="gallery" id="communityGallery"><div class="wall-loading">Cargando dibujos...</div></div>`;
    muro.appendChild(box); return box.querySelector("#communityGallery");
  }

  async function renderGallery(){
    const g=ensureGallery(); if(!g) return;
    try{
      const data=await community(true), entries=[], seen=new Set();
      const collect=(body,name,url)=>mediaFrom(body).forEach(x=>{if(!seen.has(x.src)){seen.add(x.src);entries.push({...x,name,url});}});
      (data.posts||[]).forEach(p=>{
        const name=(p.title||"").replace(/^\[AZUCAR\]\s*/i,"").trim() || p.user?.login || "Amigo";
        collect(p.body,name,p.html_url); (p.replies||[]).forEach(r=>collect(r.body,r.user?.login||name,p.html_url));
      });
      g.innerHTML="";
      if(!entries.length){g.innerHTML='<div class="wall-empty">Todavía no hay dibujos o GIFs.</div>';return;}
      entries.slice(0,60).forEach((x,i)=>{
        const card=document.createElement("article"); card.className="media-card";
        const el=document.createElement(x.type==="video"?"video":"img");
        if(x.type==="video"){el.controls=true;el.muted=true;el.loop=true;el.playsInline=true;} else {el.loading="lazy";el.alt=`Dibujo del grupo ${i+1}`;}
        el.src=x.src;
        if(x.type==="image") el.onerror=()=>{
          if(/github\.com\/user-attachments\/assets\//i.test(x.src)){
            const v=document.createElement("video");v.controls=true;v.muted=true;v.loop=true;v.playsInline=true;v.src=x.src;el.replaceWith(v);
          } else card.remove();
        };
        const tag=document.createElement("div");tag.className="tag";tag.innerHTML=`<b>${x.name}</b><span>del grupo ♥</span>`;
        card.onclick=()=>window.open(x.url,"_blank","noopener,noreferrer"); card.style.cursor="pointer";
        card.append(el,tag);g.appendChild(card);
      });
    }catch(e){g.innerHTML='<div class="wall-error">No pude sincronizar la galería todavía.</div>';}
  }

  setTimeout(renderGallery,1000);
  setInterval(renderGallery,120000);
  addEventListener("load",()=>document.getElementById("refreshWall")?.addEventListener("click",()=>setTimeout(renderGallery,700)));
})();
