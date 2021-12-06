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

// 3.渐变色 + 纹理图片 + 光效
export const ScanShader3 = {
  uniforms: {
    texture1: {
      value: textureLoader.load(require('./texture/house_1.png')),
    },
    color1: {
      value: new THREE.Color('#001327'),
    },
    color2: {
      value: new THREE.Color('#00FFFF'),
    },
    colorGo: {
      value: new THREE.Color('#ff6713'),
    },
    maxH: {
      value: 200.0, //最大值
    },
    lightHeight: {
      //光的高度
      value: 0,
    },
    lightWidth: {
      //光的宽度
      value: 40,
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
            uniform vec3 colorGo;
            uniform float lightHeight;
            uniform float lightWidth;
            uniform float maxH;
            float plot (float pct){
              return  smoothstep( pct-lightWidth, pct, v_py) - smoothstep( pct, pct+0.02, v_py);
            }
            void main() {
              float f1 = plot(lightHeight);
              vec4 b1 = vec4(colorGo.r, colorGo.g, colorGo.b, 1.0) ;
              vec3 gradient =  mix(color1, color2, v_py / maxH); //内置 smoothstep法渐变
              gl_FragColor = mix(vec4(gradient,1.),b1,f1);  //渐变与光效混合
              gl_FragColor = mix(texture2D(texture1, vUv),vec4(gl_FragColor.r,gl_FragColor.g,gl_FragColor.b,0.9),0.9);  //再混合材质
          }
      `,
};
