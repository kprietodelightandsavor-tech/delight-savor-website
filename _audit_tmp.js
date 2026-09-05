window.__audit=(function(doc,win){
function toRGB(s){var m=/rgba?\(([^)]+)\)/.exec(s);if(!m)return null;var p=m[1].split(',').map(function(x){return parseFloat(x)});return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1};}
function comp(f,b){return {r:f.r*f.a+b.r*(1-f.a),g:f.g*f.a+b.g*(1-f.a),b:f.b*f.a+b.b*(1-f.a),a:1};}
function lum(c){var v=[c.r,c.g,c.b].map(function(x){x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)});return .2126*v[0]+.7152*v[1]+.0722*v[2];}
function ratio(a,b){var l1=lum(a),l2=lum(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);}
function bgOf(el){
  var stack=[],n=el;
  while(n&&n.nodeType===1){var c=toRGB(win.getComputedStyle(n).backgroundColor);if(c&&c.a>0){stack.push(c);if(c.a===1)break;}n=n.parentElement;}
  var base={r:255,g:255,b:255,a:1};
  for(var i=stack.length-1;i>=0;i--) base=comp(stack[i],base);
  return base;
}
function hasImgBg(el){var n=el;while(n&&n.nodeType===1){var s=win.getComputedStyle(n);if(s.backgroundImage&&s.backgroundImage!=='none')return true;if(toRGB(s.backgroundColor)?.a===1)return false;n=n.parentElement;}return false;}
var fails=[],checked=0;
var w=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT);
var seen=new Set(),node;
while(node=w.nextNode()){
  var t=node.textContent.trim(); if(t.length<2) continue;
  var el=node.parentElement; if(!el||seen.has(el)) continue; seen.add(el);
  var s=win.getComputedStyle(el);
  if(s.visibility==='hidden'||s.display==='none'||parseFloat(s.opacity)===0) continue;
  var r=el.getBoundingClientRect(); if(r.width<1||r.height<1) continue;
  if(hasImgBg(el)) continue;
  var fg=toRGB(s.color); if(!fg) continue;
  var bg=bgOf(el); var f=fg.a<1?comp(fg,bg):fg;
  var size=parseFloat(s.fontSize), bold=parseInt(s.fontWeight)>=700;
  var large=size>=24||(size>=18.66&&bold);
  var need=large?3:4.5, cr=ratio(f,bg);
  checked++;
  if(cr<need-0.01) fails.push({t:t.slice(0,45),cls:(el.className||el.tagName).toString().slice(0,40),ratio:cr.toFixed(2),need:need,size:size.toFixed(0)});
}
var de=doc.documentElement;
return {checked:checked,overflowX:de.scrollWidth-de.clientWidth,fails:fails.slice(0,20),failCount:fails.length};
});