
varying vec3 vNorm;
varying vec3 vPos;
varying vec3 vMPos;
varying vec2 vUv;

void main(){

  vUv = uv;
  vNorm = ( modelMatrix * vec4( normal , 0. )).xyz;
  vPos  = position;
  vMPos  = ( modelMatrix * vec4( position , 1.  )).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1. );

}
