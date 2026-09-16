import {useEffect,useRef,useState} from 'react';
import {Play,SkipForward} from 'lucide-react';
// The dance is a local MP4: scroll only reveals it; playback follows video time.
export function DanceSequence({active,onComplete}) {
  const video=useRef(null);
  const [needsPlay,setNeedsPlay]=useState(false);
  const [error,setError]=useState(false);
  useEffect(()=>{
    const el=video.current;
    if(!el)return;
    if(active){el.currentTime=0;el.play().then(()=>setNeedsPlay(false)).catch(()=>setNeedsPlay(true));}
    else el.pause();
  },[active]);
  return <div className="dance-stage">
    <p className="eyebrow">ONE HAND. ONE DANCE. ONE FOREVER.</p>
    <video ref={video} className="dance-video" src="/media/our-dance.mp4?v=3" muted playsInline preload="auto" aria-label="Henil asks for Vidhi's hand, she joins him and twirls, then they come together" onEnded={onComplete} onError={()=>setError(true)} onPlaying={()=>{setNeedsPlay(false);setError(false)}}/>
    <p className="dance-caption">May I have this dance?</p>
    <div className="dance-controls">{needsPlay&&!error&&<button className="text-link" onClick={()=>video.current?.play().catch(()=>setNeedsPlay(true))}><Play size={16}/>Play our dance</button>}<button className="text-link" onClick={onComplete}>{error?'Continue to our invitation':'Skip dance'}<SkipForward size={15}/></button></div>
  </div>
}
