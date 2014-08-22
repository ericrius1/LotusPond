
//author: @cabbbibo
#extension GL_OES_standard_derivatives : enable

uniform float timer;
uniform sampler2D t_normal;
uniform sampler2D t_iri;

uniform vec3 lightPositions[11];
uniform vec3 lightColors[11];
uniform sampler2D lightTextures[11];
uniform vec3 cameraPos;

uniform float normalScale;
uniform float texScale;
uniform float lightCutoff;
uniform float lightPower;


varying vec3 vNorm;
varying vec3 vPos;
varying vec3 vMPos;
varying vec2 vUv;

varying vec3 vView;

void main(){


  
  vec3 q0 = dFdx( vPos.xyz );
  vec3 q1 = dFdy( vPos.xyz );
  vec2 st0 = dFdx( vUv.st );
  vec2 st1 = dFdy( vUv.st );

  vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
  vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
  vec3 N = normalize( vNorm );

  vec2 offset = vec2(  timer * .00142 , -timer * .02345 );

  vec3 mapN = texture2D( t_normal, vUv*texScale+offset ).xyz * 2.0 - 1.0;
  mapN.xy = normalScale * mapN.xy;
 
  mat3 tsn = mat3( S, T, N );
  vec3 fNorm =  normalize( tsn * mapN ); 




  vec2 centerUV = abs( vUv - vec2( .5 , .5 ) );


  vec3 camDir   = normalize( vMPos - cameraPos);


  vec3 totalIri = vec3( 0.);
  for( int i = 0; i < 11; i++ ){

    vec3 lightPos = lightPositions[i];
    lightPos.y += 300.0;

    vec3 lightRay = vMPos - lightPos;

    vec3 lightDir = normalize( lightRay );
    float lightDist = length( lightRay ); 
     
    float facingRatio = max( 0. ,  dot( -lightDir , fNorm ));

    vec3 refl = reflect( -lightDir , fNorm );
    float reflFR = dot( -refl , camDir );

    vec3 iri = texture2D( lightTextures[i]  , vec2( reflFR*reflFR , 0. ) ).xyz * 0.7;

    float distMultiplier = clamp( lightCutoff / lightDist , 0. , 1. );
    distMultiplier = pow( distMultiplier , lightPower );

    totalIri += lightColors[i] * iri * distMultiplier * facingRatio * facingRatio * facingRatio  * facingRatio;

  }

  gl_FragColor = vec4( totalIri  , 1. );


}
