import { matIV } from "./lib/minMatrix";

let beginTime,
    nowTime;

export const init = (artists) => {

  let urls = [];
  artists.forEach(item => {
    urls.push(item.images[0].url);
  });

  beginTime = Date.now();

  const vertices = [
    -2.0, 1.0, 0.0,
    -1.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    2.0, 1.0, 0.0,
    -2.0, -1.0, 0.0,
    -1.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    2.0, -1.0, 0.0,
  ];

  const vertAttributes = [[vertices, 3]];

  const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const attLocations = ['aVertexPosition'];

  const uniLocations = [['mvpMatrix', 'uniformMatrix4fv'],
                        ['textureArray', 'uniform1i']];

  const canvas = document.getElementById("webgl-canvas");
  const gl = canvas.getContext('webgl2') || console.error('WebGL2 is not available in your browser.');

  // console.log(gl.getParameter(gl.MAX_ARRAY_TEXTURE_LAYERS));

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  createTexture(gl, artists ? urls : ['./logo192.png']);

  getShader(gl, ['./vert.vs', './frag.fs'], attLocations, uniLocations).then((program) => {

    const buffers = getBuffers(gl, program, vertAttributes, indices);

    function render() {
      requestAnimationFrame(render);
      nowTime = (Date.now() - beginTime) / 1000.0;
      draw(gl, buffers.vao, indices.length, program);

    }

    render();

  });


}

function loadShader(pathArray) {
  
  if(Array.isArray(pathArray) !== true) {
    throw new Error('invalid argment');
  }

  const promises = pathArray.map((path) => {
    return fetch(path).then(res => {return res.text();});
  });

  return Promise.all(promises);

}

function createShader(gl, source, type) {

  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  } else {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

}

function createProgram(gl, vs, fs) {

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);

  gl.linkProgram(program);

  if(gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.useProgram(program);
    return program;
  } else {
    alert(gl.getProgramInfoLog(program));
    return null;
  }

}

function getShader(gl, paths, attLocations, uniLocations) {
  
  return new Promise((resolve) => {
    loadShader(paths)
    .then((shaders) => {
      
      const vs = createShader(gl, shaders[0], gl.VERTEX_SHADER);
      const fs = createShader(gl, shaders[1], gl.FRAGMENT_SHADER);

      const program = createProgram(gl, vs, fs);
      program.attLocations = [];
      program.uniLocations = [];
      program.uniTypes = [];

      attLocations.forEach(attLocation => {
        program.attLocations.push(gl.getAttribLocation(program, attLocation));
      })

      uniLocations.forEach(uniLocation => {
        program.uniLocations.push(gl.getUniformLocation(program, uniLocation[0]));
        program.uniTypes.push(uniLocation[1]);
      });

      resolve(program);

    });

  });

}

function setUniform(gl, values, uniLocations, uniTypes) {
  
  values.forEach((v, index) => {

    const type = uniTypes[index];

    if(type.includes('Matrix') === true) {
    
      gl[type](uniLocations[index], false, v);
    
    } else {

      gl[type](uniLocations[index], v);
    
    }

  })

}

function getBuffers(gl, program, vertAttributes, indices) {

  let buffers = {};

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const vertexBuffers = [];

  vertAttributes.forEach((vertAttribute, index) => {

    vertexBuffers.push(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[index]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertAttribute[0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.attLocations[index]);
    gl.vertexAttribPointer(program.attLocations[index], vertAttribute[1], gl.FLOAT, false, 0, 0);

  });

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  buffers.vao = vao;
  buffers.indexBuffer = indexBuffer;
  buffers.indices = indices;

  return buffers;

}

function draw(gl, vao, length, program) {

  // gl.activeTexture(gl.TEXTURE0);
  // gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);

  let m = new matIV();
  let mMatrix = m.identity(m.create());
  let vMatrix = m.identity(m.create());
  let pMatrix = m.identity(m.create());
  let mvpMatrix = m.identity(m.create());

  m.rotate(mMatrix, nowTime, [0, 1, 0], mMatrix);
  m.lookAt([0.0, 0.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
  m.perspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100, pMatrix);

  m.multiply(pMatrix, vMatrix, mvpMatrix);
  m.multiply(mvpMatrix, mMatrix, mvpMatrix);

  let uniValues = [mvpMatrix, 0];

  setUniform(gl, uniValues, program.uniLocations, program.uniTypes);

  //深度テストの比較方法を指定
  // gl.depthFunc(gl.LEQUAL);

  //カリングテストの有効化
  // gl.enable(gl.CULL_FACE);

  //深度テストの有効化
  // gl.enable(gl.DEPTH_TEST);

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  gl.clearDepth(1.0);
  
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.bindVertexArray(vao);
  gl.drawElements(gl.POINTS, length, gl.UNSIGNED_SHORT, 0);
  gl.bindVertexArray(null);

}

function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;

    image.onload = () => {
      resolve(image);
    };
  });
}

function createTexture(gl, urls) {

  const canvas2d = document.createElement('canvas');
  canvas2d.width = 512;
  canvas2d.height = 512;
  const context2d = canvas2d.getContext('2d');

  const elementPerTexture = 512 * 512 * 4;

  const pixelData = new Uint8Array(elementPerTexture * urls.length);

  let processes = [];
  urls.forEach(url => {
    processes.push(loadImage(url));
  });

  Promise.all(processes)
    .then((res => Promise.all(res.map((r, index) => {

      context2d.drawImage(r, 0, 0, 512, 512);
      const imageData = context2d.getImageData(0, 0, 512, 512);
      pixelData.set(imageData.data, elementPerTexture * index);

    })))).then(() => {

      const texture = gl.createTexture();

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
      gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, 512, 512, urls.length, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixelData);

      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.generateMipmap(gl.TEXTURE_2D_ARRAY);

      return texture;
    
    });

}