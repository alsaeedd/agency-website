import {
  useRef,
  useEffect,
  useMemo,
  useState,
  CSSProperties,
} from "react";

type PatternShape = "Checks" | "Stripes" | "Edge";

const PatternShapes: Record<PatternShape, number> = {
  Checks: 0,
  Stripes: 1,
  Edge: 2,
};

interface PresetParams {
  color1: string;
  color2: string;
  color3: string;
  rotation: number;
  proportion: number;
  scale: number;
  speed: number;
  distortion: number;
  swirl: number;
  swirlIterations: number;
  softness: number;
  offset: number;
  shape: PatternShape;
  shapeSize: number;
}

type PresetName = "Plasma" | "Mist" | "Vortex" | "Prism";

const presets: Record<PresetName, PresetParams> = {
  // Brand-aligned: violet/black plasma
  Plasma: {
    color1: "#7c5aff",
    color2: "#0c0715",
    color3: "#160e27",
    rotation: 0,
    proportion: 58,
    scale: 0.7,
    speed: 18,
    distortion: 6,
    swirl: 58,
    swirlIterations: 6,
    softness: 100,
    offset: -180,
    shape: "Checks",
    shapeSize: 32,
  },
  Mist: {
    color1: "#0c0715",
    color2: "#a78bfa",
    color3: "#0c0715",
    rotation: 0,
    proportion: 34,
    scale: 0.5,
    speed: 22,
    distortion: 4,
    swirl: 70,
    swirlIterations: 5,
    softness: 100,
    offset: -240,
    shape: "Edge",
    shapeSize: 50,
  },
  Vortex: {
    color1: "#0c0715",
    color2: "#a78bfa",
    color3: "#160e27",
    rotation: 50,
    proportion: 42,
    scale: 0.4,
    speed: 14,
    distortion: 0,
    swirl: 100,
    swirlIterations: 3,
    softness: 8,
    offset: -740,
    shape: "Stripes",
    shapeSize: 78,
  },
  Prism: {
    color1: "#0c0715",
    color2: "#7c5aff",
    color3: "#160e27",
    rotation: -50,
    proportion: 1,
    scale: 0.01,
    speed: 22,
    distortion: 0,
    swirl: 50,
    swirlIterations: 16,
    softness: 47,
    offset: -299,
    shape: "Checks",
    shapeSize: 45,
  },
};

interface PresetConfig {
  preset: PresetName;
  speed?: number;
}

interface NoiseConfig {
  opacity: number;
  scale?: number;
}

interface AnimatedGradientProps {
  config?: PresetConfig;
  noise?: NoiseConfig;
  radius?: string;
  style?: CSSProperties;
  className?: string;
}

export default function AnimatedGradient({
  config = { preset: "Plasma" },
  noise,
  radius = "0px",
  style,
  className,
}: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const params = useMemo<PresetParams>(() => {
    const p = presets[config.preset] || presets.Plasma;
    return { ...p, speed: config.speed ?? p.speed };
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !isMounted) return;

    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: true,
      alpha: true,
      antialias: true,
    });
    if (!gl) return;

    const vs = `#version 300 es
    in vec4 a_position;
    void main() { gl_Position = a_position; }`;

    const vShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vShader, vs);
    gl.compileShader(vShader);

    const fShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fShader, FRAGMENT_SHADER);
    gl.compileShader(fShader);

    const program = gl.createProgram()!;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const U = {
      time: gl.getUniformLocation(program, "u_time"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      pixelRatio: gl.getUniformLocation(program, "u_pixelRatio"),
      scale: gl.getUniformLocation(program, "u_scale"),
      rotation: gl.getUniformLocation(program, "u_rotation"),
      color1: gl.getUniformLocation(program, "u_color1"),
      color2: gl.getUniformLocation(program, "u_color2"),
      color3: gl.getUniformLocation(program, "u_color3"),
      proportion: gl.getUniformLocation(program, "u_proportion"),
      softness: gl.getUniformLocation(program, "u_softness"),
      shape: gl.getUniformLocation(program, "u_shape"),
      shapeScale: gl.getUniformLocation(program, "u_shapeScale"),
      distortion: gl.getUniformLocation(program, "u_distortion"),
      swirl: gl.getUniformLocation(program, "u_swirl"),
      swirlIterations: gl.getUniformLocation(program, "u_swirlIterations"),
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    startTimeRef.current = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - startTimeRef.current) / 1000;
      const speed = (params.speed / 100) * 5;
      gl.uniform1f(U.time, elapsed * speed + params.offset * 0.01);
      gl.uniform2f(U.resolution, canvas.width, canvas.height);
      gl.uniform1f(U.pixelRatio, window.devicePixelRatio || 1);
      gl.uniform1f(U.scale, params.scale);
      gl.uniform1f(U.rotation, (params.rotation * Math.PI) / 180);

      const c1 = hex(params.color1);
      const c2 = hex(params.color2);
      const c3 = hex(params.color3);
      gl.uniform4f(U.color1, c1[0], c1[1], c1[2], c1[3]);
      gl.uniform4f(U.color2, c2[0], c2[1], c2[2], c2[3]);
      gl.uniform4f(U.color3, c3[0], c3[1], c3[2], c3[3]);

      gl.uniform1f(U.proportion, params.proportion / 100);
      gl.uniform1f(U.softness, params.softness / 100);
      gl.uniform1f(U.shape, PatternShapes[params.shape]);
      gl.uniform1f(U.shapeScale, params.shapeSize / 100);
      gl.uniform1f(U.distortion, params.distortion / 50);
      gl.uniform1f(U.swirl, params.swirl / 100);
      gl.uniform1f(
        U.swirlIterations,
        params.swirl === 0 ? 0 : params.swirlIterations,
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current !== undefined)
        cancelAnimationFrame(frameIdRef.current);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteBuffer(buf);
    };
  }, [isMounted, params]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        borderRadius: radius,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgKxmiAAAABnRSTlMCCgkGBAVJOAVJAAAASklEQVQ4y2NgGAWjYBSMglEwCgY/YGRgZBQUYmJiZGQEkYwMjIyMgoKCjIyMIJKBgRFIMjIyAklGRkYGRkFBYEcwMDIyMjAOUQAA1I4HwVwZAkYAAAAASUVORK5CYII=")',
            backgroundSize: (noise.scale ?? 1) * 200,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

function hex(s: string): [number, number, number, number] {
  let r = 0, g = 0, b = 0, a = 1;
  if (s.startsWith("#")) {
    const c = s.slice(1);
    if (c.length === 3) {
      r = parseInt(c[0] + c[0], 16) / 255;
      g = parseInt(c[1] + c[1], 16) / 255;
      b = parseInt(c[2] + c[2], 16) / 255;
    } else {
      r = parseInt(c.slice(0, 2), 16) / 255;
      g = parseInt(c.slice(2, 4), 16) / 255;
      b = parseInt(c.slice(4, 6), 16) / 255;
      if (c.length === 8) a = parseInt(c.slice(6, 8), 16) / 255;
    }
  }
  return [r, g, b, a];
}

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;
out vec4 fragColor;
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
vec2 rotate(vec2 uv, float th) { return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv; }
float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}
vec4 blend_colors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edge_blur) {
  vec3 color1 = c1.rgb * c1.a;
  vec3 color2 = c2.rgb * c2.a;
  vec3 color3 = c3.rgb * c3.a;
  float r1 = smoothstep(.0 + .35 * edgesWidth, .7 - .35 * edgesWidth + .5 * edge_blur, mixer);
  float r2 = smoothstep(.3 + .35 * edgesWidth, 1. - .35 * edgesWidth + edge_blur, mixer);
  vec3 blended_color_2 = mix(color1, color2, r1);
  float blended_opacity_2 = mix(c1.a, c2.a, r1);
  vec3 c = mix(blended_color_2, color3, r2);
  float o = mix(blended_opacity_2, c3.a, r2);
  return vec4(c, o);
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = .5 * u_time;
  float noise_scale = .0005 + .006 * u_scale;
  uv -= .5;
  uv *= (noise_scale * u_resolution);
  uv = rotate(uv, u_rotation * .5 * PI);
  uv /= u_pixelRatio;
  uv += .5;
  float n1 = noise(uv * 1. + t);
  float n2 = noise(uv * 2. - t);
  float angle = n1 * TWO_PI;
  uv.x += 4. * u_distortion * n2 * cos(angle);
  uv.y += 4. * u_distortion * n2 * sin(angle);
  float iterations_number = ceil(clamp(u_swirlIterations, 1., 30.));
  for (float i = 1.; i <= iterations_number; i++) {
    uv.x += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1.5 * uv.y);
    uv.y += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1. * uv.x);
  }
  float proportion = clamp(u_proportion, 0., 1.);
  float shape = 0.;
  float mixer = 0.;
  if (u_shape < .5) {
    vec2 checks_shape_uv = uv * (.5 + 3.5 * u_shapeScale);
    shape = .5 + .5 * sin(checks_shape_uv.x) * cos(checks_shape_uv.y);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else if (u_shape < 1.5) {
    vec2 stripes_shape_uv = uv * (.25 + 3. * u_shapeScale);
    float f = fract(stripes_shape_uv.y);
    shape = smoothstep(.0, .55, f) * smoothstep(1., .45, f);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else {
    float sh = 1. - uv.y;
    sh -= .5;
    sh /= (noise_scale * u_resolution.y);
    sh += .5;
    float shape_scaling = .2 * (1. - u_shapeScale);
    shape = smoothstep(.45 - shape_scaling, .55 + shape_scaling, sh + .3 * (proportion - .5));
    mixer = shape;
  }
  vec4 color_mix = blend_colors(u_color1, u_color2, u_color3, mixer, 1. - clamp(u_softness, 0., 1.), .01 + .01 * u_scale);
  fragColor = vec4(color_mix.rgb, color_mix.a);
}
`;
