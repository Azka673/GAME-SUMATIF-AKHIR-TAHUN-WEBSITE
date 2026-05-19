// Glow post-process shader (WebGL reference)
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uIntensity;
uniform vec3 uGlowColor;

void main() {
  vec4 color = texture2D(uTexture, vUv);
  float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  vec3 glow = uGlowColor * lum * uIntensity;
  gl_FragColor = vec4(color.rgb + glow, color.a);
}
