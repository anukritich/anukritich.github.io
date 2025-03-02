import"./modulepreload-polyfill-B5Qt9EMX.js";import{S as B,P as W,W as Y,F as G,a as M,A as N,M as z,g as A,h as E,i as I,j,k as L,B as V,l as C,m as _,b as q,D as H}from"./threejs-BKtU8bw2.js";const D=document.querySelector(".cursor-dot"),T=document.querySelector(".cursor-outline");if(D&&T){let n=function(){o+=(e-o)*i,r+=(t-r)*i,T.style.transform=`translate(${o}px, ${r}px)`,requestAnimationFrame(n)},e=0,t=0,o=0,r=0;const i=.1;document.addEventListener("mousemove",s=>{e=s.clientX,t=s.clientY,D.style.transform=`translate(${e}px, ${t}px)`}),n()}document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("loading-screen"),t=document.getElementById("loading-text"),o=document.querySelectorAll(".story-section"),r=document.getElementById("welcome-text");let i=0,n=!1,s=0;const d=1e3;o.forEach((c,u)=>{if(u<o.length-1){const p=document.createElement("div");p.className="scroll-indicator",p.innerHTML="Scroll down ↓",c.appendChild(p)}});function v(){let c=0;const u=setInterval(()=>{c+=5,t&&(t.textContent=`Loading... ${c}%`),c>=100&&(clearInterval(u),setTimeout(()=>{h()},500))},100)}function h(){e.classList.add("fade-out"),setTimeout(()=>{e.style.display="none",m()},50)}function m(){o[0].classList.add("active-section"),r&&(r.classList.remove("zoom-in"),r.offsetWidth,r.classList.add("zoom-in")),window.addEventListener("wheel",b),window.addEventListener("touchstart",y),window.addEventListener("touchmove",P)}let f=0;function y(c){f=c.touches[0].clientY}function P(c){if(n)return;const u=c.touches[0].clientY,p=f-u;Math.abs(p)>50&&(p>0?S():g(),f=u)}function b(c){const u=Date.now();n||u-s<d||(s=u,c.deltaY>0?S():g())}function S(){i<o.length-1&&(n=!0,o[i].classList.remove("active-section"),i++,o[i].classList.add("active-section"),o[i].scrollIntoView({behavior:"smooth"}),setTimeout(()=>{n=!1},d))}function g(){i>0&&(n=!0,o[i].classList.remove("active-section"),i--,o[i].classList.add("active-section"),o[i].scrollIntoView({behavior:"smooth"}),setTimeout(()=>{n=!1},d))}v()});const $=document.getElementById("bg"),w=new B,l=new W(75,window.innerWidth/window.innerHeight,.1,1e3),x=new Y({canvas:$,alpha:!0});x.setSize(window.innerWidth,window.innerHeight);x.setPixelRatio(window.devicePixelRatio);const a={count:5e4,size:.02,radius:5,branches:3,spin:1,randomness:.2,randomnessPower:3,insideColor:10057727,outsideColor:1784196,fogDensity:.05};w.fog=new G(2852,a.fogDensity);w.background=new M(0);const k=()=>{const e=new z(new A(20,32,32),new E({color:30719,transparent:!0,opacity:.6}));e.position.set(0,-30,0);const t=new A(23,32,32),o=new I({uniforms:{glowColor:{value:new M(43775)},viewVector:{value:l.position}},vertexShader:`
            uniform vec3 viewVector;
            varying float intensity;
            void main() {
                vec3 vNormal = normalize(normalMatrix * normal);
                vec3 vNormel = normalize(normalMatrix * viewVector);
                intensity = pow(0.6 - dot(vNormal, vNormel), 2.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,fragmentShader:`
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4(glow, 0.5);
            }
        `,side:j,blending:L,transparent:!0}),r=new z(t,o);r.position.set(0,-30,0),w.add(r),w.add(e)},R=()=>{const e=new V,t=new Float32Array(a.count*3),o=new Float32Array(a.count*3),r=new Float32Array(a.count),i=new M(a.insideColor),n=new M(a.outsideColor);for(let v=0;v<a.count;v++){const h=v*3,m=Math.random()*a.radius,f=m*a.spin,y=v%a.branches/a.branches*Math.PI*2,P=Math.pow(Math.random(),a.randomnessPower)*(Math.random()<.5?1:-1)*a.randomness*m,b=Math.pow(Math.random(),a.randomnessPower)*(Math.random()<.5?1:-1)*a.randomness*m,S=Math.pow(Math.random(),a.randomnessPower)*(Math.random()<.5?1:-1)*a.randomness*m;t[h]=Math.cos(y+f)*m+P,t[h+1]=b,t[h+2]=Math.sin(y+f)*m+S;const g=i.clone();g.lerp(n,m/a.radius),o[h]=g.r,o[h+1]=g.g,o[h+2]=g.b,r[v]=Math.random()*2.5}e.setAttribute("position",new C(t,3)),e.setAttribute("color",new C(o,3)),e.setAttribute("aScale",new C(r,1));const s=new I({uniforms:{uTime:{value:0},uSize:{value:a.size*x.getPixelRatio()}},vertexShader:`
            attribute vec3 color;
            attribute float aScale;
            varying vec3 vColor;
            uniform float uTime;
            uniform float uSize;
            
            void main() {
                vColor = color;
                
                // Position
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                
                // Slow rotation
                float angle = uTime * 0.05;
                mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
                modelPosition.xz = rotation * modelPosition.xz;
                
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectedPosition = projectionMatrix * viewPosition;
                
                gl_Position = projectedPosition;
                
                // Size
                gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z);
            }
        `,fragmentShader:`
            varying vec3 vColor;
            
            void main() {
                // Disc point pattern
                float strength = distance(gl_PointCoord, vec2(0.5));
                strength = 1.0 - strength;
                strength = pow(strength, 5.0);
                
                // Final color
                vec3 color = mix(vec3(0.0), vColor, strength);
                gl_FragColor = vec4(color, strength * 0.8);
            }
        `,transparent:!0,blending:L,depthWrite:!1,vertexColors:!0}),d=new _(e,s);return w.add(d),{points:d,material:s}},X=()=>{const e=[];for(let o=0;o<5;o++){const r=new q(50,50),i=new E({color:new M(Math.random()*.2+.5,Math.random()*.2,Math.random()*.5+.5),transparent:!0,opacity:Math.random()*.2+.1,side:H,blending:L}),n=new z(r,i),s=Math.random()*30+10,d=Math.random()*Math.PI*2;n.position.set(Math.cos(d)*s,(Math.random()-.5)*30,Math.sin(d)*s),n.rotation.x=Math.random()*Math.PI,n.rotation.y=Math.random()*Math.PI,n.rotation.z=Math.random()*Math.PI,n.userData={rotationSpeed:{x:(Math.random()-.5)*.001,y:(Math.random()-.5)*.001,z:(Math.random()-.5)*.001},floatSpeed:{x:(Math.random()-.5)*.01,y:(Math.random()-.5)*.01,z:(Math.random()-.5)*.01}},e.push(n),w.add(n)}return e},O=R(),Z=X();k();l.position.z=75;l.position.y=30;l.lookAt(0,0,0);const J=new N(7816447,.5);w.add(J);function F(){requestAnimationFrame(F);const e=Date.now()*.001;O.material.uniforms.uTime.value=e,Z.forEach(t=>{t.rotation.x+=t.userData.rotationSpeed.x,t.rotation.y+=t.userData.rotationSpeed.y,t.rotation.z+=t.userData.rotationSpeed.z,t.position.x+=Math.sin(e*.2)*t.userData.floatSpeed.x,t.position.y+=Math.cos(e*.3)*t.userData.floatSpeed.y,t.position.z+=Math.sin(e*.4)*t.userData.floatSpeed.z}),l.position.x=Math.sin(e*.1)*5,l.position.z=75+Math.cos(e*.1)*5,l.lookAt(0,0,0),x.render(w,l)}F();window.addEventListener("resize",()=>{l.aspect=window.innerWidth/window.innerHeight,l.updateProjectionMatrix(),x.setSize(window.innerWidth,window.innerHeight)});
