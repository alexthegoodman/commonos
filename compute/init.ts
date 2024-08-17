import { Character } from "@/hooks/useKonvaRTE";

export async function initializeWebGPU() {
  if (!navigator.gpu) {
    console.error("WebGPU is not supported in this browser.");
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();
  console.info("WebGPU initialized.", device);
  return { device, queue: device.queue };
}

export async function createComputePipeline(
  device: GPUDevice,
  bindGroupLayout: GPUBindGroupLayout,
  shaderCode: string
) {
  const shaderModule = device.createShaderModule({ code: shaderCode });

  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),
    compute: {
      module: shaderModule,
      entryPoint: "main",
    },
  });

  return pipeline;
}

export function createBuffer(device: GPUDevice, data: Float32Array) {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage:
      GPUBufferUsage.STORAGE |
      GPUBufferUsage.COPY_SRC |
      GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });

  new Float32Array(buffer.getMappedRange()).set(data);
  buffer.unmap();

  return buffer;
}

export const createDocDimensionsBuffer = (
  device: GPUDevice,
  width: number,
  height: number,
  lineHeight: number,
  pageHeight: number
) => {
  const buffer = device.createBuffer({
    size: 4 * 4, // 4 floats
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const dimensions = new Float32Array([width, height, lineHeight, pageHeight]);
  device.queue.writeBuffer(buffer, 0, dimensions);

  return buffer;
};

export function createBindGroupLayout(device: GPUDevice): GPUBindGroupLayout {
  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage" as "storage",
          minBindingSize: 0,
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "uniform" as "uniform",
          minBindingSize: 0,
        },
      },
    ],
  });
  return bindGroupLayout;
}

export function createBindGroup(
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  buffer: GPUBuffer,
  docDimensionsBuffer: GPUBuffer
) {
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: buffer,
        },
      },
      {
        binding: 1,
        resource: { buffer: docDimensionsBuffer },
      },
    ],
  });

  return bindGroup;
}

export function dispatchCompute(
  device: GPUDevice,
  queue: GPUQueue,
  pipeline: GPUComputePipeline,
  bindGroup: GPUBindGroup,
  elementCount: number
) {
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);

  const maxThreadsPerGroup = 7; // This is an example; use device limits or optimal sizes based on testing.
  const workgroups = Math.ceil(elementCount / maxThreadsPerGroup);

  passEncoder.dispatchWorkgroups(workgroups, 1, 1);
  passEncoder.end();

  const commands = commandEncoder.finish();
  queue.submit([commands]);
}

export async function readFromBuffer(
  device: GPUDevice,
  buffer: GPUBuffer,
  characters: Character[],
  setMasterJson: any
) {
  const readBuffer = device.createBuffer({
    size: buffer.size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  const commandEncoder = device.createCommandEncoder();
  commandEncoder.copyBufferToBuffer(buffer, 0, readBuffer, 0, buffer.size);
  const commands = commandEncoder.finish();
  device.queue.submit([commands]);

  await readBuffer.mapAsync(GPUMapMode.READ);
  const copyArrayBuffer = readBuffer.getMappedRange();
  const result = new Float32Array(copyArrayBuffer);
  const restructured = restructureCharacters(result, characters);
  console.log(restructured);
  setMasterJson(restructured);
  readBuffer.unmap();
}

function restructureCharacters(
  floatArray: Float32Array,
  subsection: Character[]
): Character[] {
  const characters: Character[] = [];
  const stride = 7; // Number of float values per character

  let x = 0;
  for (let i = 0; i < floatArray.length; i += stride) {
    const characterData = subsection[x];
    const character: Character = {
      ...characterData,
      position: {
        x: floatArray[i],
        y: floatArray[i + 1],
      },
      size: {
        width: floatArray[i + 2],
        height: floatArray[i + 3],
      },
      location: {
        page: floatArray[i + 4],
        line: floatArray[i + 5],
        lineIndex: floatArray[i + 6],
      },
    };
    characters.push(character);
    x++;
  }

  return characters;
}
