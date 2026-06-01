// Atmospheric fog shader (WebGL reference)
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uFogDensity;
uniform vec3 uFogColor;
uniform float uTime;

void main() {
  vec4 color = texture2D(uTexture, vUv);
  float fogFactor = 1.0 - exp(-uFogDensity * (vUv.y + sin(uTime * 0.5) * 0.1));
  vec3 finalColor = mix(color.rgb, uFogColor, fogFactor);
  gl_FragColor = vec4(finalColor, color.a);
}
