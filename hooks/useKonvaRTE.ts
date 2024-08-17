import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import CharactersShader from "../compute/shaders/characters.wgsl?raw";

import * as fontkit from "fontkit";
import { KonvaEventObject } from "konva/lib/Node";
import {
  createBindGroup,
  createBindGroupLayout,
  createBuffer,
  createComputePipeline,
  createDocDimensionsBuffer,
  dispatchCompute,
  initializeWebGPU,
  readFromBuffer,
} from "@/compute/init";

const blobToBuffer = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
};

const loadFont = async (setFont: (font: fontkit.Font) => void) => {
  try {
    const response = await fetch("/fonts/Inter-Regular.ttf");
    const blob = await response.blob();
    const buffer = await blobToBuffer(blob);
    const font = fontkit.create(buffer);
    setFont(font as fontkit.Font);
  } catch (error) {
    console.error("Error loading font", error);
    // TODO: show snackbar, disable loading of initial text, possibly try loading other font
  }
};

export type Location = {
  page: number;
  line: number;
  lineIndex: number;
};

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Style = {
  color: string;
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
  italic: boolean;
  underline: boolean;
};

export type CharacterType = "newline" | "character" | "tab";

export type Character = {
  characterId: string;
  character: string;
  location: Location | null;
  position: Position | null;
  size: Size;
  style: Style;
  type: CharacterType;
  // testing
  lastLineCharacter: boolean | null;
  wordIndex: number | null;
  paragraphIndex: number | null;
  // precedingLineWidth ? store this in the character?
};

export type MasterJson = Character[];

export type DocumentSize = {
  width: number;
  height: number;
};

let gpuDevice: GPUDevice | null = null;
let gpuQueue: GPUQueue | null = null;
let gpuPipeline: GPUComputePipeline | null = null;

const startupCompute = async () => {
  const { device, queue } = await initializeWebGPU();
  const bindGroupLayout = createBindGroupLayout(device);
  const pipeline = await createComputePipeline(
    device,
    bindGroupLayout,
    CharactersShader
  );

  console.info("setting global vars", device);

  gpuDevice = device;
  gpuQueue = queue;
  gpuPipeline = pipeline;
};

startupCompute();

export const useKonvaRTE = (
  initialMarkdown: string,
  mainTextSize: DocumentSize
) => {
  const checkSpace = 10; // check for extra space to delinate end of paragraph
  const letterSpacing = 1;
  const defaultSpacing = 5;
  const defaultStyle = {
    color: "black",
    fontSize: 16,
    fontWeight: "normal",
    fontFamily: "Inter",
    italic: false,
    underline: false,
  };

  const [masterJson, _setMasterJson] = useState<MasterJson>([]);
  const masterJsonRef = useRef(masterJson);
  const setMasterJson = (data: MasterJson) => {
    masterJsonRef.current = data;
    _setMasterJson(data);
  };

  const [fontData, _setFontData] = useState<fontkit.Font | null>(null);
  const fontDataRef = useRef(fontData);
  const setFontData = (font: fontkit.Font) => {
    fontDataRef.current = font;
    _setFontData(font);
  };

  const getCharacterBoundingBox = (
    fontData: fontkit.Font,
    character: string,
    style: Style
  ) => {
    const glyph = fontData?.layout(character);
    const boundingBox = glyph?.bbox;
    const unitsPerEm = fontDataRef.current?.unitsPerEm;
    const { xAdvance, xOffset } = glyph.positions[0];

    if (
      !boundingBox ||
      boundingBox.width == -Infinity ||
      boundingBox.height == -Infinity ||
      !unitsPerEm
    ) {
      return {
        width: defaultSpacing,
        height: defaultSpacing,
      };
    }

    return {
      width: (boundingBox.width / unitsPerEm) * style.fontSize,
      height: (boundingBox.height / unitsPerEm) * style.fontSize,
    };
  };

  const getCapHeightPx = (fontSize: number) => {
    if (!fontDataRef.current) {
      return 0;
    }

    return (
      ((fontDataRef.current.capHeight +
        fontDataRef.current.ascent +
        fontDataRef.current.descent) /
        fontDataRef.current.unitsPerEm) *
      fontSize
    );
  };

  const flattenForCompute = (subsection: Character[]) => {
    const flattened = [] as number[];
    subsection.forEach((char) => {
      flattened.push(char.position?.x ? char.position?.x : 0);
      flattened.push(char.position?.y ? char.position?.y : 0);
      flattened.push(char.size.width);
      flattened.push(char.size.height);
      flattened.push(char.location?.page ? char.location?.page : 0);
      flattened.push(char.location?.line ? char.location?.line : 0);
      flattened.push(char.location?.lineIndex ? char.location?.lineIndex : 0);
    });

    const floatArray = new Float32Array(flattened);

    console.info("flattenForCompute floatArray", floatArray);

    return floatArray;
  };

  const positionByShader = (characters: Character[]) => {
    if (!gpuDevice || !gpuQueue || !gpuPipeline) {
      console.info("no gpuDevice");
      return;
    }

    console.info("positionByShader", characters.length);

    const flatChars = flattenForCompute(characters);
    const computeBuffer = createBuffer(gpuDevice, flatChars);
    const docBuffer = createDocDimensionsBuffer(
      gpuDevice,
      mainTextSize.width,
      mainTextSize.height,
      26,
      1000
    );
    const bindGroup = createBindGroup(
      gpuDevice,
      gpuPipeline,
      computeBuffer,
      docBuffer
    );

    console.info("dispatching compute...");

    dispatchCompute(
      gpuDevice,
      gpuQueue,
      gpuPipeline,
      bindGroup,
      flatChars.length
    );

    setTimeout(() => {
      console.info("reading from buffer...");
      readFromBuffer(gpuDevice, computeBuffer, characters, setMasterJson);
    }, 50);
  };

  useEffect(() => {
    // avert react strictmode double mount
    const loadFontTimer = setTimeout(() => {
      loadFont(setFontData);
    }, 500);

    return () => {
      clearTimeout(loadFontTimer);
    };
  }, []);

  useEffect(() => {
    if (fontData) {
      console.info("welcome to konva rte!");

      //   window.addEventListener("keydown", handleKeydown);

      return () => {
        // window.removeEventListener("keydown", handleKeydown);
      };
    }
  }, [fontData]);

  useEffect(() => {
    if (initialMarkdown && fontDataRef.current) {
      const initialCharacters = initialMarkdown.split("");
      const newChars: Character[] = [];
      //   let previousChar: Character | null | undefined = null; // should be handled in shader

      initialCharacters.forEach((character, i) => {
        if (!fontDataRef.current) {
          return;
        }

        let newSize: Size = { width: 0, height: 0 };
        if (character === "\n") {
          const capHeightPx = getCapHeightPx(defaultStyle.fontSize);

          newSize = {
            width: 0,
            height: capHeightPx,
          };
        } else {
          const boundingBox = getCharacterBoundingBox(
            fontDataRef.current,
            character,
            defaultStyle
          );

          if (!boundingBox) {
            return;
          }

          newSize = {
            width: boundingBox?.width,
            height: boundingBox?.height,
          };
        }

        const newChar: Character = {
          characterId: uuidv4(),
          character,
          location: null,
          position: null,
          size: newSize,
          style: defaultStyle,
          type: "character",
          lastLineCharacter: false,
          wordIndex: 0,
          paragraphIndex: 0,
        };

        newChars.push(newChar);
      });

      console.info("newChars", newChars);

      // postprocess after all initial characters added
      positionByShader(newChars);
      //   setMasterJson(positionedByShader);
    }
  }, [initialMarkdown, fontData]);

  // when no text exists, will calculate at first character
  const handleCanvasClick = (e: KonvaEventObject<MouseEvent>) => {
    console.info("canvas click");
  };
  // set the insert index to this character
  const handleTextClick = (e: KonvaEventObject<MouseEvent>) => {
    console.info("text click");
  };

  // TODO: check performance of this
  const jsonByPage = useMemo(() => {
    const pages = masterJson.reduce(
      (acc, char) => {
        if (!char.location) return acc;
        if (!acc[char.location.page]) {
          acc[char.location.page] = [];
        }

        acc[char.location.page].push(char);

        return acc;
      },
      {} as { [key: number]: Character[] }
    );

    return pages;
  }, [masterJson]);

  return {
    masterJson,
    jsonByPage,
    handleCanvasClick,
    handleTextClick,
  };
};
