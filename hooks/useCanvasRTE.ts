import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import * as fontkit from "fontkit";
import { KonvaEventObject } from "konva/lib/Node";

const blobToBuffer = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
};

const loadFont = async (setFont: (font: fontkit.Font) => void) => {
  const loadBlob = async (blob: Blob) => {
    const buffer = await blobToBuffer(blob);

    let font = fontkit.create(buffer);
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

export type CharacterType = "newline" | "character" | "tab";

export type Character = {
  characterId: string;
  character: string;
  location: Location;
  position: Position;
  size: Size;
  style: Style;
  type: CharacterType;
};

export type MasterJson = Character[];

export type DocumentSize = {
  width: number;
  height: number;
};

// extend window type
// declare global {
//   interface Window {
//     __canvasRTEEditorActive: boolean;
//     __canvasRTEInsertCharacterId: string | null;
//   }
// }

// window.__canvasRTEEditorActive = false;
// window.__canvasRTEInsertCharacterId = null;

export const useCanvasRTE = (
  initialMarkdown: string,
  mainTextSize: DocumentSize
) => {
  const letterSpacing = 1;
  const defaultSpacing = 5;

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
    const glyph = fontData?.layout(character);
    const boundingBox = glyph?.bbox;
    const unitsPerEm = fontDataRef.current?.unitsPerEm;
    const { xAdvance, xOffset } = glyph.positions[0];

    // console.info(
    //   "advance",
    //   xAdvance,
    //   xOffset,
    //   glyph.advanceWidth,
    //   boundingBox.width
    // );

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

  const calculateNextLocation = (
    insertLocation: Location,
    newSize: Size,
    newType: CharacterType
  ) => {
    // calculate newlines and pages as needed
    // will need to calculate width of current line and compare to page width

    if (newType === "newline") {
      const nextLocation = {
        page: insertLocation.page,
        line: insertLocation.line + 1,
        lineIndex: 0,
      };

      return nextLocation;
    } else {
      const currentLine = masterJsonRef.current.filter(
        (char) =>
          char.location.page === insertLocation.page &&
          char.location.line === insertLocation.line
      );
      const currentLineWidth = currentLine.reduce((acc, char) => {
        return char.size ? acc + char.size.width + letterSpacing : acc;
      }, 0);
      const fitsOnLine = currentLineWidth + newSize.width < mainTextSize.width;

      // console.info(
      //   "fitsOnLine",
      //   fitsOnLine,
      //   currentLineWidth + size.width,
      //   mainTextSize.width
      // );

      if (fitsOnLine) {
        const nextLocation = {
          page: insertLocation.page,
          line: insertLocation.line,
          lineIndex: insertLocation.lineIndex + 1,
        };

        return nextLocation;
      } else {
        const nextLocation = {
          page: insertLocation.page,
          line: insertLocation.line + 1,
          lineIndex: 0,
        };

        return nextLocation;
      }
    }
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

  const calculateNextPosition = (
    insertCharacter: Character,
    newLocation: Location
  ) => {
    // TODO: calculate positioning based on bounding box or other factors

    if (!fontDataRef.current) {
      return insertCharacter.position;
    }

    const isNewLine = newLocation.line > insertCharacter.location.line;

    const nextX = isNewLine
      ? 0
      : insertCharacter.position.x + insertCharacter.size.width + letterSpacing;
    const capHeightPx = getCapHeightPx(insertCharacter.style.fontSize);
    const nextY = isNewLine
      ? insertCharacter.position.y + capHeightPx
      : insertCharacter.position.y;

    const nextPosition = {
      x: nextX,
      y: nextY,
    };

    return nextPosition;
  };

  // this needs to select characters based on location value
  const getAllCharactersAfterInsert = (insertCharacter: Character) => {
    return masterJsonRef.current.filter((char) => {
      if (char.location.page > insertCharacter.location.page) {
        return true;
      } else if (char.location.page === insertCharacter.location.page) {
        if (char.location.line > insertCharacter.location.line) {
          return true;
        } else if (char.location.line === insertCharacter.location.line) {
          if (char.location.lineIndex > insertCharacter.location.lineIndex) {
            return true;
          }
        }
      }

      return false;
    });
  };

  const insertCharacter = (
    characterId: string,
    character: string,
    type: CharacterType,
    defaultStyle: Style,
    newSize: Size
  ) => {
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
        type,
      };

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

      const newLocation = calculateNextLocation(
        insertCharacter.location,
        newSize,
        type
      );
      const newPosition = calculateNextPosition(insertCharacter, newLocation);

      const newCharacter: Character = {
        characterId,
        character,
        location: newLocation,
        position: newPosition,
        size: newSize,
        style: defaultStyle,
        type,
      };

      // add the new character to the master json
      // then calculate the next location and position for all characters after the insert
      const next = [...masterJsonRef.current, newCharacter];
      const afterInsert = getAllCharactersAfterInsert(insertCharacter);

      // console.info("afterInsert", afterInsert);

      if (afterInsert.length > 0) {
        const updated = next.map((char) => {
          const afterInsertIndex = afterInsert.findIndex(
            (c) => c.characterId === char.characterId
          );

          // if the character is after the insert, calculate new location and position
          if (afterInsertIndex > -1) {
            const newLocation = calculateNextLocation(
              char.location,
              newSize,
              char.type
            );
            const newPosition: Position = {
              x: char.position.x + newSize.width + letterSpacing,
              y: char.position.y,
            };

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
  };

  const handleKeydown = (e: KeyboardEvent) => {
    e.preventDefault();
    console.info("keypress", e.key, editorActiveRef.current);

    if (editorActiveRef.current) {
      //   console.info("in", fontDataRef.current?.unitsPerEm);

      if (!fontDataRef.current) {
        return;
      }

      const characterId = uuidv4();

      const defaultStyle = {
        color: "black",
        fontSize: 12,
        fontWeight: "normal",
        fontFamily: "Inter",
        italic: false,
        underline: false,
      };

      switch (e.key) {
        case "Enter":
          {
            const character = "";

            const insertCharacter = masterJsonRef.current.find(
              (char) => char.characterId === insertCharacterIdRef.current
            );

            if (!insertCharacter) {
              // TODO: enter in empty document?
              return;
            }

            const newlineLocation: Location = {
              page: insertCharacter.location.page,
              line: insertCharacter.location.line + 1,
              lineIndex: 0,
            };

            const capHeightPx = getCapHeightPx(defaultStyle.fontSize);

            const newlineSize: Size = {
              width: 0,
              height: capHeightPx,
            };

            const newlinePosition = calculateNextPosition(
              insertCharacter,
              newlineLocation
            );

            const newCharacter: Character = {
              characterId,
              character,
              location: newlineLocation,
              position: newlinePosition,
              size: newlineSize,
              style: defaultStyle,
              type: "newline",
            };

            // add the new character to the master json
            const next = [...masterJsonRef.current, newCharacter];

            setMasterJson(next);

            setInsertCharcterId(characterId);
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
            // window.__canvasRTEEditorActive = false;
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

            insertCharacter(
              characterId,
              character,
              type,
              defaultStyle,
              tabSize
            );
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

            insertCharacter(
              characterId,
              character,
              type,
              defaultStyle,
              newSize
            );
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
      console.info("welcome!");

      window.addEventListener("keydown", handleKeydown);

      return () => {
        window.removeEventListener("keydown", handleKeydown);
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
    console.info("characterId", characterId);
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
