import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 调试方法 -> 将颜色值复制给gl_FragColor

// 1.使用shader来处理贴图
export const ScanShader1 = {
  uniforms: {
    texture1: {
      value: textureLoader.load(require('./texture/house_1.png')),
    },
  },
  vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        uniform sampler2D texture1;
        varying vec2 vUv;
        void main() {
            gl_FragColor = texture2D(texture1, vUv);
        }
  `,
};
// mix(x, y, a) => return x * (1.0 - a) + y * a;
//   gl_FragColor = texture2D(texture1, vUv);
//   gl_FragColor = vec4(colorGo, 1.0);
// 2.渐变色 + 纹理图片
export const ScanShader2 = {
  uniforms: {
    texture1: {
      value: textureLoader.load(require('./texture/house_1.png')),
    },
    color1: {
      value: new THREE.Color('#0f2742'),
    },
    color2: {
      value: new THREE.Color('#00FFFF'),
    },
    maxH: {
      value: 200.0, //中间值
    },
  },
  vertexShader: `
          varying vec2 vUv;
          varying float v_py;
          void main() {
              vUv = uv;
              v_py = position.y;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
      `,
  fragmentShader: `
          uniform sampler2D texture1;
          varying vec2 vUv;
          varying float v_py;
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float maxH;
          void main() {
            // vec3 gradient =  mix(color1, color2, v_py / maxH); //内置 smoothstep法渐变 与下句等价 [0, maxH] => [0, 1]
            vec3 gradient =  mix(color1, color2, smoothstep(0.0, maxH, v_py));
            // gl_FragColor = vec4(gradient, 1.0); // 直接使用渐变色
            gl_FragColor = mix(texture2D(texture1, vUv),vec4(gradient,0.8),0.85);  //再混合材质
        }
    `,
};

console.log(THREE.UniformsLib['lights']);

export const ScanShader3 = {
  uniforms: {
    ...THREE.UniformsLib['lights'],
    texture1: {
      value: textureLoader.load(require('./texture/house_1.png')),
    },
    colorGo: {
      value: new THREE.Color('#9C59FF'),
    },
    scanX: {
      value: 0, // 如何转变为全局坐标
    },
    scanXWidth: {
      value: 20,
    },
    ambientLightColor: {
      value: new THREE.Color('#FFFFFF'),
    },
  },
  vertexShader: `
            varying vec2 vUv;
            varying float v_py;
            varying float v_px;
            varying vec3 vPos;
            varying vec3 vNormal;
            void main() {
                vUv = uv;
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vPos = (modelMatrix * vec4(position, 1.0 )).xyz;
                vNormal = normalMatrix * normal;
                v_px = worldPosition.x;
                v_py = position.y;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
  fragmentShader: `
            uniform sampler2D texture1;
            varying vec2 vUv;
            varying float v_px;
            uniform vec3 colorGo;
            uniform float scanX; 
            uniform float scanXWidth;

            varying vec3 vPos;
            varying vec3 vNormal;
            struct PointLight {
              vec3 position;
              vec3 color;
            };
            uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

            float plotX (float _scanX){
              return  smoothstep(_scanX - scanXWidth, _scanX, v_px) - smoothstep(_scanX, _scanX+0.02, v_px);
            }

            void main() {
              vec4 addedLights = vec4(0.1, 0.1, 0.1, 1.0);
              for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
                vec3 adjustedLight = pointLights[l].position + cameraPosition;
                vec3 lightDirection = normalize(vPos - adjustedLight);
                addedLights.rgb += clamp(dot(-lightDirection, vNormal), 0.0, 1.0) * pointLights[l].color;
              }

              gl_FragColor = texture2D(texture1, vUv);

              float f2 = plotX(scanX);
              if(abs(v_px - scanX) <= scanXWidth){
                vec4 scanColor = vec4(colorGo.r, colorGo.g, colorGo.b, (1.0 - abs(v_px - scanX) / scanXWidth) * 0.9);
                gl_FragColor = mix(vec4(gl_FragColor.r,gl_FragColor.g,gl_FragColor.b,1), scanColor, 0.5);
              }

              gl_FragColor = mix(gl_FragColor, addedLights, 0.5);

          }
      `,
};

console.log(ScanShader3.uniforms);

// (1.0 - abs(v_px - scanX) / scanXWidth) * 0.9
