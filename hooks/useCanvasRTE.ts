import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import * as fontkit from "fontkit";
import { KonvaEventObject } from "konva/lib/Node";
console.info("fontkit", fontkit);
// const font = fontkit.create("fonts/Inter-Regular.ttf");

const blobToBuffer = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
};

const loadFont = async (setFont: (font: fontkit.Font) => void) => {
  const loadBlob = async (blob: Blob) => {
    const buffer = await blobToBuffer(blob);

    let font = fontkit.create(buffer);
    console.info(font);
    setFont(font as fontkit.Font);
  };

  fetch("/fonts/Inter-Regular.ttf")
    .then((res) => res.blob())
    .then(loadBlob, console.error);
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

export type Character = {
  characterId: string;
  character: string;
  location: Location;
  position: Position;
  size: Size;
  style: Style;
};

export type MasterJson = Character[];

// extend window type
// declare global {
//   interface Window {
//     __canvasRTEEditorActive: boolean;
//     __canvasRTEInsertCharacterId: string | null;
//   }
// }

// window.__canvasRTEEditorActive = false;
// window.__canvasRTEInsertCharacterId = null;

export const useCanvasRTE = (initialMarkdown: string) => {
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

  console.info("masterJson", masterJson);

  const getCharacterBoundingBox = (
    fontData: fontkit.Font,
    character: string,
    style: Style
  ) => {
    const defaultSpacing = 5;
    const glyph = fontData?.layout(character);
    const boundingBox = glyph?.bbox;
    const unitsPerEm = fontDataRef.current?.unitsPerEm;

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
      width: (glyph.advanceWidth / unitsPerEm) * style.fontSize,
      height: (boundingBox.height / unitsPerEm) * style.fontSize,
    };
  };

  const calculateNextLocation = (location: Location) => {
    const nextLocation = {
      page: location.page,
      line: location.line,
      lineIndex: location.lineIndex + 1,
    };

    // TODO: calculate newlines and pages as needed
    // will need to calculate width of current line and compare to page width

    return nextLocation;
  };

  const calculateNextPosition = (insertCharacter: Character) => {
    // TODO: calculate positioning based on bounding box or other factors
    const letterSpacing = 0;
    const nextPosition = {
      x:
        insertCharacter.position.x + insertCharacter.size.width + letterSpacing,
      y: insertCharacter.position.y,
    };

    return nextPosition;
  };

  // this needs to select characters based on location value
  const getAllCharactersAfterInsert = (insertCharacter: Character) => {
    return masterJson.filter((char) => {
      if (char.location.page >= insertCharacter.location.page) {
        if (char.location.line >= insertCharacter.location.line) {
          if (char.location.lineIndex > insertCharacter.location.lineIndex) {
            return true;
          }
        }
      }

      return false;
    });
  };

  const handleKeypress = (e: KeyboardEvent) => {
    e.preventDefault();
    console.info("keypress", e.key, editorActiveRef.current);

    if (editorActiveRef.current) {
      console.info("in", fontDataRef.current?.unitsPerEm);

      if (!fontDataRef.current) {
        return;
      }

      const character = e.key;
      const characterId = uuidv4();

      const defaultStyle = {
        color: "black",
        fontSize: 12,
        fontWeight: "normal",
        fontFamily: "Inter",
        italic: false,
        underline: false,
      };

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

      console.info("newSize", newSize);

      if (insertCharacterIdRef.current === null) {
        const newLocation = {
          page: 0,
          line: 0,
          lineIndex: 0,
        };

        const newPosition = {
          x: 0,
          y: 0,
        };

        const newCharacter: Character = {
          characterId,
          character,
          location: newLocation,
          position: newPosition,
          size: newSize,
          style: defaultStyle,
        };

        console.info("to set json");

        console.info("setting json");
        // add the new character to the master json
        const next = [...masterJsonRef.current, newCharacter];

        setMasterJson(next);

        setInsertCharcterId(characterId);
        // return characterId;
        // window.__canvasRTEInsertCharacterId = characterId;
      } else {
        const insertCharacter = masterJsonRef.current.find(
          (char) => char.characterId === insertCharacterIdRef.current
        );

        if (!insertCharacter) {
          return;
        }

        const newLocation = calculateNextLocation(insertCharacter.location);
        const newPosition = calculateNextPosition(insertCharacter);

        const newCharacter: Character = {
          characterId,
          character,
          location: newLocation,
          position: newPosition,
          size: newSize,
          style: defaultStyle,
        };

        // add the new character to the master json
        // then calculate the next location and position for all characters after the insert
        const next = [...masterJsonRef.current, newCharacter];
        const afterInsert = getAllCharactersAfterInsert(insertCharacter);

        if (afterInsert.length > 0) {
          const updated = next.map((char) => {
            const afterInsertIndex = afterInsert.findIndex(
              (c) => c.characterId === char.characterId
            );

            if (afterInsertIndex > -1) {
              const newLocation = calculateNextLocation(char.location);
              const newPosition = calculateNextPosition(char);

              return {
                ...char,
                location: newLocation,
                position: newPosition,
              };
            }

            return char;
          });

          // return updated;
          setMasterJson(updated);
        } else {
          // return next;
          setMasterJson(next);
        }

        setInsertCharcterId(characterId);
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
      console.info("welcome!");

      window.addEventListener("keypress", handleKeypress);

      return () => {
        window.removeEventListener("keypress", handleKeypress);
      };
    }
  }, [fontData]);

  // when no text exists, will calculate at first character
  const handleCanvasClick = (e: KonvaEventObject<MouseEvent>) => {
    console.info("canvas click");
    setEditorActive(true);
    // window.__canvasRTEEditorActive = true;
  };

  // set the insert index to this character
  const handleTextClick = (e: KonvaEventObject<MouseEvent>) => {
    console.info("text click");
    const target = e.target;
    const characterId = target.id();
    const characterIndex = masterJson.findIndex(
      (char) => char.characterId === characterId
    );
    const character = masterJson[characterIndex];
    setInsertCharcterId(character.characterId);
    // window.__canvasRTEInsertCharacterId = character.characterId;
    setEditorActive(true);
    // window.__canvasRTEEditorActive = true;
  };

  return { masterJson, handleCanvasClick, handleTextClick };
};
