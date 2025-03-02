import"./modulepreload-polyfill-B5Qt9EMX.js";import{S as B,P as q,W as G,a as y,T as Y,g as _,h as L,i as z,b as I,M as R,B as E,j as b,k as F,l as V}from"./threejs-C6GlJE8d.js";const D=document.querySelector(".cursor-dot"),A=document.querySelector(".cursor-outline");if(D&&A){let o=function(){e+=(a-e)*t,n+=(i-n)*t,A.style.transform=`translate(${e}px, ${n}px)`,requestAnimationFrame(o)},a=0,i=0,e=0,n=0;const t=.1;document.addEventListener("mousemove",s=>{a=s.clientX,i=s.clientY,D.style.transform=`translate(${a}px, ${i}px)`}),o()}document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("loading-screen"),i=document.getElementById("loading-text"),e=document.querySelectorAll(".story-section"),n=document.getElementById("welcome-text");let t=0,o=!1,s=0;const r=1e3;e.forEach((h,v)=>{if(v<e.length-1){const g=document.createElement("div");g.className="scroll-indicator",g.innerHTML="Scroll down ↓",h.appendChild(g)}});function d(){let h=0;const v=setInterval(()=>{h+=5,i&&(i.textContent=`Loading... ${h}%`),h>=100&&(clearInterval(v),setTimeout(()=>{u()},500))},100)}function u(){a.classList.add("fade-out"),setTimeout(()=>{a.style.display="none",c()},50)}function c(){e[0].classList.add("active-section"),n&&(n.classList.remove("zoom-in"),n.offsetWidth,n.classList.add("zoom-in")),window.addEventListener("wheel",f),window.addEventListener("touchstart",l),window.addEventListener("touchmove",p)}let M=0;function l(h){M=h.touches[0].clientY}function p(h){if(o)return;const v=h.touches[0].clientY,g=M-v;Math.abs(g)>50&&(g>0?P():T(),M=v)}function f(h){const v=Date.now();o||v-s<r||(s=v,h.deltaY>0?P():T())}function P(){t<e.length-1&&(o=!0,e[t].classList.remove("active-section"),t++,e[t].classList.add("active-section"),e[t].scrollIntoView({behavior:"smooth"}),setTimeout(()=>{o=!1},r))}function T(){t>0&&(o=!0,e[t].classList.remove("active-section"),t--,e[t].classList.add("active-section"),e[t].scrollIntoView({behavior:"smooth"}),setTimeout(()=>{o=!1},r))}d()});const H=document.getElementById("bg"),x=new B,m=new q(75,window.innerWidth/window.innerHeight,.1,1e3),w=new G({canvas:H,alpha:!0});w.setSize(window.innerWidth,window.innerHeight);w.setPixelRatio(window.devicePixelRatio);x.background=new y(0);const $=()=>{const a=[];new Y;const e=document.createElement("canvas");e.width=128,e.height=128;const n=e.getContext("2d"),t=n.createRadialGradient(64,64,0,64,64,64);t.addColorStop(0,"rgba(255, 255, 255, 1)"),t.addColorStop(.5,"rgba(255, 255, 255, 0.5)"),t.addColorStop(1,"rgba(255, 255, 255, 0)"),n.fillStyle=t,n.fillRect(0,0,128,128);const o=new _(e);for(let s=0;s<20;s++){const r=Math.random()*.3+.6,d=new y().setHSL(r,.8,.5),u=new L({map:o,transparent:!0,opacity:Math.random()*.3+.1,depthWrite:!1,blending:z,color:d}),c=Math.random()*60+40,M=new I(c,c),l=new R(M,u),p=Math.random()*80+20,f=Math.random()*Math.PI*2,P=Math.random()*Math.PI-Math.PI/2;l.position.set(p*Math.sin(f)*Math.cos(P),p*Math.sin(P)+(Math.random()-.5)*30,p*Math.cos(f)*Math.cos(P)),l.rotation.x=Math.random()*Math.PI,l.rotation.y=Math.random()*Math.PI,l.rotation.z=Math.random()*Math.PI,l.userData={velocity:{x:(Math.random()-.5)*.1,y:(Math.random()-.5)*.05,z:(Math.random()-.5)*.1},spin:{x:(Math.random()-.5)*.005,y:(Math.random()-.5)*.005,z:(Math.random()-.5)*.005},wave:{amplitude:Math.random()*5+2,frequency:Math.random()*.02+.01,offset:Math.random()*Math.PI*2},scale:{factor:Math.random()*.2+.9,speed:Math.random()*.01+.005},origin:{x:l.position.x,y:l.position.y,z:l.position.z},opacity:{min:Math.random()*.1+.05,max:Math.random()*.2+.2,speed:Math.random()*.01+.005}},a.push(l),x.add(l)}return a},j=()=>{const a=new E,i=1e3,e=new Float32Array(i*3),n=new Float32Array(i);for(let s=0;s<i;s++){const r=s*3,d=Math.random()*200+400,u=Math.random()*Math.PI*2,c=Math.random()*Math.PI*2;e[r]=d*Math.sin(u)*Math.cos(c),e[r+1]=d*Math.sin(c),e[r+2]=d*Math.cos(u)*Math.cos(c),n[s]=Math.random()*2+.5}a.setAttribute("position",new b(e,3)),a.setAttribute("aScale",new b(n,1));const t=new F({uniforms:{uTime:{value:0},uPixelRatio:{value:w.getPixelRatio()}},vertexShader:`
            attribute float aScale;
            uniform float uTime;
            uniform float uPixelRatio;
            
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                // Calculate twinkle effect
                float twinkle = sin(uTime * 0.5 + position.x * 100.0) * 0.5 + 0.5;
                
                // Size attenuation
                gl_PointSize = aScale * uPixelRatio * (300.0 / -mvPosition.z) * (0.5 + 0.5 * twinkle);
            }
        `,fragmentShader:`
            void main() {
                // Create a soft glow
                float distToCenter = length(gl_PointCoord - vec2(0.5));
                float strength = 1.0 - smoothstep(0.0, 0.5, distToCenter);
                
                gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
            }
        `,blending:z,depthWrite:!1,transparent:!0}),o=new V(a,t);return x.add(o),o},X=()=>{const i=new E,e=new Float32Array(5e3*3),n=new Float32Array(5e3*3),t=new Float32Array(5e3),o=new Float32Array(5e3*3),s=[new y(10057727),new y(8939246),new y(5605631),new y(7816447)];for(let u=0;u<5e3;u++){const c=u*3,M=Math.random()*100+10,l=Math.random()*Math.PI*2,p=Math.random()*Math.PI-Math.PI/2;e[c]=M*Math.sin(l)*Math.cos(p),e[c+1]=M*Math.sin(p),e[c+2]=M*Math.cos(l)*Math.cos(p);const f=s[Math.floor(Math.random()*s.length)];n[c]=f.r,n[c+1]=f.g,n[c+2]=f.b,t[u]=Math.random()*4+1,o[c]=(Math.random()-.5)*.05,o[c+1]=(Math.random()-.5)*.05,o[c+2]=(Math.random()-.5)*.05}i.setAttribute("position",new b(e,3)),i.setAttribute("color",new b(n,3)),i.setAttribute("aScale",new b(t,1)),i.setAttribute("aVelocity",new b(o,3));const r=new F({uniforms:{uTime:{value:0},uPixelRatio:{value:w.getPixelRatio()}},vertexShader:`
            attribute vec3 color;
            attribute float aScale;
            attribute vec3 aVelocity;
            varying vec3 vColor;
            uniform float uTime;
            uniform float uPixelRatio;
            
            void main() {
                vColor = color;
                
                // Apply velocity over time
                vec3 movingPosition = position + aVelocity * uTime * 10.0;
                
                // Keep particles within bounds using modulo-like behavior
                float bound = 150.0;
                if(abs(movingPosition.x) > bound) movingPosition.x = -sign(movingPosition.x) * (bound - 10.0);
                if(abs(movingPosition.y) > bound) movingPosition.y = -sign(movingPosition.y) * (bound - 10.0);
                if(abs(movingPosition.z) > bound) movingPosition.z = -sign(movingPosition.z) * (bound - 10.0);
                
                vec4 mvPosition = modelViewMatrix * vec4(movingPosition, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                // Pulsating size
                float pulse = sin(uTime + aScale) * 0.5 + 0.5;
                gl_PointSize = aScale * uPixelRatio * (600.0 / -mvPosition.z) * (0.7 + 0.3 * pulse);
            }
        `,fragmentShader:`
            varying vec3 vColor;
            
            void main() {
                // Soft particle edge
                float distToCenter = length(gl_PointCoord - vec2(0.5));
                float strength = 1.0 - smoothstep(0.0, 0.5, distToCenter);
                
                gl_FragColor = vec4(vColor, strength * 0.7);
            }
        `,transparent:!0,blending:z,depthWrite:!1,vertexColors:!0}),d=new V(i,r);return x.add(d),d},W=$(),S=j(),C=X();m.position.z=100;m.position.y=20;m.lookAt(0,0,0);function k(){requestAnimationFrame(k);const a=Date.now()*.001;S.material.uniforms&&(S.material.uniforms.uTime.value=a),C.material.uniforms&&(C.material.uniforms.uTime.value=a),W.forEach(t=>{t.rotation.x+=t.userData.spin.x,t.rotation.y+=t.userData.spin.y,t.rotation.z+=t.userData.spin.z;const o=Math.sin(a*t.userData.wave.frequency+t.userData.wave.offset)*t.userData.wave.amplitude,s=Math.cos(a*t.userData.wave.frequency+t.userData.wave.offset)*t.userData.wave.amplitude;t.position.x+=t.userData.velocity.x,t.position.y+=t.userData.velocity.y,t.position.z+=t.userData.velocity.z,t.position.x+=o*.05,t.position.z+=s*.05;const r=150;Math.abs(t.position.x)>r&&(t.position.x=-Math.sign(t.position.x)*(r-20)),Math.abs(t.position.y)>r&&(t.position.y=-Math.sign(t.position.y)*(r-20)),Math.abs(t.position.z)>r&&(t.position.z=-Math.sign(t.position.z)*(r-20));const d=1+Math.sin(a*t.userData.scale.speed)*t.userData.scale.factor*.2;t.scale.set(d,d,d);const u=t.userData.opacity.min+(Math.sin(a*t.userData.opacity.speed+t.userData.wave.offset)*.5+.5)*(t.userData.opacity.max-t.userData.opacity.min);t.material.opacity=u});const i=100,n=a*.05;m.position.x=Math.sin(n)*i*.2,m.position.z=Math.cos(n)*i,m.position.y=20+Math.sin(a*.2)*5,m.lookAt(0,0,0),x.children.forEach(t=>{t.material&&t.material.uniforms&&t.material.uniforms.viewVector&&(t.material.uniforms.viewVector.value=m.position)}),w.render(x,m)}k();window.addEventListener("resize",()=>{m.aspect=window.innerWidth/window.innerHeight,m.updateProjectionMatrix(),w.setSize(window.innerWidth,window.innerHeight),S.material.uniforms&&S.material.uniforms.uPixelRatio&&(S.material.uniforms.uPixelRatio.value=w.getPixelRatio()),C.material.uniforms&&C.material.uniforms.uPixelRatio&&(C.material.uniforms.uPixelRatio.value=w.getPixelRatio())});function N(){for(let a=0;a<5;a++){const i=Math.random()*120+100,e=new I(i,i),n=new y(.2+Math.random()*.1,.1+Math.random()*.1,.4+Math.random()*.2),t=new L({color:n,transparent:!0,opacity:.05+Math.random()*.05,depthWrite:!1,blending:z}),o=new R(e,t),s=Math.random()*50+150,r=Math.random()*Math.PI*2;o.position.set(Math.cos(r)*s,(Math.random()-.5)*100,Math.sin(r)*s),o.lookAt(m.position),o.userData={velocity:{x:(Math.random()-.5)*.02,y:(Math.random()-.5)*.01,z:(Math.random()-.5)*.02},spin:{x:(Math.random()-.5)*.001,y:(Math.random()-.5)*.001,z:(Math.random()-.5)*.001}},W.push(o),x.add(o)}}N();
