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

  const [editorActive, _setEditorActive] = useState(false);
  // use ref to get up-to-date values in event listener
  const editorActiveRef = useRef(editorActive);
  const setEditorActive = (active: boolean) => {
    editorActiveRef.current = active;
    _setEditorActive(active);
  };

  const [insertCharacterId, _setInsertCharcterId] = useState<string | null>(
    null
  );
  const insertCharacterIdRef = useRef(insertCharacterId);
  const setInsertCharcterId = (id: string | null) => {
    insertCharacterIdRef.current = id;
    _setInsertCharcterId(id);
  };

  const [insertCharacterIndex, _setInsertCharacterIndex] = useState<
    number | null
  >(null);
  const insertCharacterIndexRef = useRef(insertCharacterIndex);
  const setInsertCharacterIndex = (index: number | null) => {
    insertCharacterIndexRef.current = index;
    _setInsertCharacterIndex(index);
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
      let type = 0;
      switch (char.type) {
        case "character":
          type = 0;
          break;
        case "newline":
          type = 1;
          break;
        case "tab":
          type = 2;
          break;
        default:
          type = 0;
          break;
      }

      flattened.push(char.position?.x ? char.position?.x : 0);
      flattened.push(char.position?.y ? char.position?.y : 0);
      flattened.push(char.size.width);
      flattened.push(char.size.height);
      flattened.push(char.location?.page ? char.location?.page : 0);
      flattened.push(char.location?.line ? char.location?.line : 0);
      flattened.push(char.location?.lineIndex ? char.location?.lineIndex : 0);
      flattened.push(type);
    });

    const floatArray = new Float32Array(flattened);

    // console.info("flattenForCompute floatArray", floatArray);

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
    }, 10);
  };

  const spliceMasterJson = (
    newCharacter: Character
    // insertCharacterIndex: number
  ) => {
    // PERF: check
    // const insertCharacterIndex = masterJsonRef.current.findIndex(
    //   (char) => char.characterId === insertCharacterIdRef.current
    // );

    // PERF: check
    // const next = [
    //   ...masterJsonRef.current.slice(0, insertCharacterIndex + 1),
    //   newCharacter,
    //   ...masterJsonRef.current.slice(insertCharacterIndex + 1),
    // ];

    // insert newCharacter into masterJson at insertCharacterIndex
    // PERF: seems to be a major perf hit
    const next = masterJsonRef.current.slice();

    console.info("insertCharacterIndex", insertCharacterIndexRef.current);

    if (!insertCharacterIndexRef.current) {
      return next;
    }

    next.splice(insertCharacterIndexRef.current + 1, 0, newCharacter);

    // somewhat faster
    // const next = [...masterJsonRef.current, newCharacter];

    return next;
  };

  const handleKeydown = (e: KeyboardEvent) => {
    e.preventDefault();

    if (editorActiveRef.current) {
      if (!fontDataRef.current) {
        console.info("key triggered before fonts loaded?");
        return;
      }

      const characterId = uuidv4();

      if (!insertCharacterIndexRef.current) {
        console.info("trigger key with no text content?");
        return;
      }

      switch (e.key) {
        case "Enter":
          {
            const character = "\n";

            const capHeightPx = getCapHeightPx(defaultStyle.fontSize);

            const newlineSize: Size = {
              width: 0,
              height: capHeightPx,
            };

            const newCharacter: Character = {
              characterId,
              character,
              location: null,
              position: null,
              size: newlineSize,
              style: defaultStyle,
              type: "newline",
              lastLineCharacter: null,
              wordIndex: null,
              paragraphIndex: null,
            };

            // add the new character to the master json
            const next = spliceMasterJson(newCharacter);

            // setMasterJson(next);
            positionByShader(next);

            // setInsertCharcterId(characterId);
            setInsertCharacterIndex(insertCharacterIndexRef.current + 1);
          }
          break;
        case "Backspace":
          {
          }
          break;
        case "Delete":
          {
          }
          break;
        case "ArrowLeft":
          {
          }
          break;
        case "ArrowRight":
          {
          }
          break;
        case "ArrowUp":
          {
          }
          break;
        case "ArrowDown":
          {
          }
          break;
        case "Escape":
          {
            setEditorActive(false);
          }
          break;
        case "Shift":
          {
          }
          break;
        case "Meta":
          {
          }
          break;
        case "Tab":
          {
            console.info("tab");

            const type = "tab";
            const character = "    ";

            const capHeightPx = getCapHeightPx(defaultStyle.fontSize);

            const tabSize: Size = {
              width: 20,
              height: capHeightPx,
            };

            const newCharacter: Character = {
              characterId,
              character,
              location: null,
              position: null,
              size: tabSize,
              style: defaultStyle,
              type,
              lastLineCharacter: null,
              wordIndex: null,
              paragraphIndex: null,
            };

            // add the new character to the master json
            const next = spliceMasterJson(newCharacter);

            // setMasterJson(next);
            positionByShader(next);

            // setInsertCharcterId(characterId);
            setInsertCharacterIndex(insertCharacterIndexRef.current + 1);
          }
          break;
        default:
          {
            // any other character
            const type = "character";
            const character = e.key;

            const boundingBox = getCharacterBoundingBox(
              fontDataRef.current,
              character,
              defaultStyle
            );

            if (!boundingBox) {
              return;
            }

            const newSize = {
              width: boundingBox?.width,
              height: boundingBox?.height,
            };

            const newCharacter: Character = {
              characterId,
              character,
              location: null,
              position: null,
              size: newSize,
              style: defaultStyle,
              type,
              lastLineCharacter: null,
              wordIndex: null,
              paragraphIndex: null,
            };

            // add the new character to the master json
            const next = spliceMasterJson(newCharacter);

            // setMasterJson(next);
            positionByShader(next);

            // setInsertCharcterId(characterId);
            setInsertCharacterIndex(insertCharacterIndexRef.current + 1);
          }
          break;
      }
    }
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

      window.addEventListener("keydown", handleKeydown);

      return () => {
        window.removeEventListener("keydown", handleKeydown);
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
        let type: CharacterType = "character";
        if (character === "\n") {
          type = "newline";

          const capHeightPx = getCapHeightPx(defaultStyle.fontSize);

          newSize = {
            width: 0,
            height: capHeightPx,
          };
        } else {
          type = "character";

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
          type,
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

    setEditorActive(true);
  };

  // set the insert index to this character
  const handleTextClick = (e: KonvaEventObject<MouseEvent>) => {
    console.info("text click");

    const target = e.target;
    const characterId = target.id();

    console.info("characterId", characterId);

    const characterIndex = masterJson.findIndex(
      (char) => char.characterId === characterId
    );
    const character = masterJson[characterIndex];

    // setInsertCharcterId(character.characterId);
    setInsertCharacterIndex(characterIndex);
    setEditorActive(true);
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
