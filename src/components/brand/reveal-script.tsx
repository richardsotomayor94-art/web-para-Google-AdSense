/**
 * Revelado por IntersectionObserver (threshold 0.08). Script clásico inline:
 * marca <html class="js"> y, si algo falla, el contenido sigue visible.
 */
const code = `(function(){try{var d=document.documentElement;if(!('IntersectionObserver' in window))return;d.classList.add('js');var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);}});},{threshold:0.08,rootMargin:'0px 0px -5% 0px'});var scan=function(){document.querySelectorAll('.reveal:not(.is-visible)').forEach(function(el){io.observe(el);});};document.addEventListener('DOMContentLoaded',scan);new MutationObserver(scan).observe(d,{childList:true,subtree:true});window.addEventListener('beforeprint',function(){document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('is-visible');});});}catch(e){document.documentElement.classList.remove('js');}})();`;

export function RevealScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
