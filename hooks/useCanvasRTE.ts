import { useEffect, useState } from "react";
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
declare global {
  interface Window {
    __canvasRTEEditorActive: boolean;
    __canvasRTEInsertCharacterId: string | null;
  }
}

window.__canvasRTEEditorActive = false;
window.__canvasRTEInsertCharacterId = null;

export const useCanvasRTE = (initialMarkdown: string) => {
  //   const [editorActive, setEditorActive] = useState(false);
  //   const [insertCharacterId, setInsertCharcterId] = useState<string | null>(
  //     null
  //   );
  const [masterJson, setMasterJson] = useState<MasterJson>([]);
  const [fontData, setFontData] = useState<fontkit.Font | null>(null);

  console.info("masterJson", masterJson);

  const getCharacterBoundingBox = (
    fontData: fontkit.Font,
    character: string
  ) => {
    const glyph = fontData?.layout(character);
    const boundingBox = glyph?.bbox;

    console.info("boundingBox", character, glyph, boundingBox);
    return boundingBox;
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

  const calculateNextPosition = (position: Position) => {
    // TODO: calculate positioning based on bounding box or other factors
    const nextPosition = {
      x: position.x + 10,
      y: position.y,
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
    console.info("keypress", e.key, window.__canvasRTEEditorActive);
    if (window.__canvasRTEEditorActive) {
      setFontData((fontData) => {
        console.info("in");

        if (!fontData) {
          return fontData;
        }

        const character = e.key;
        const characterId = uuidv4();
        const boundingBox = getCharacterBoundingBox(fontData, character);

        if (!boundingBox) {
          return fontData;
        }

        const newSize = {
          width: boundingBox?.maxX - boundingBox?.minX,
          height: boundingBox?.maxY - boundingBox?.minY,
        };

        const defaultStyle = {
          color: "black",
          fontSize: 12,
          fontWeight: "normal",
          fontFamily: "Inter",
          italic: false,
          underline: false,
        };

        if (window.__canvasRTEInsertCharacterId === null) {
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

          setMasterJson((prev) => {
            console.info("setting json");
            // add the new character to the master json
            const next = [...prev, newCharacter];

            return next;
          });
          // setInsertCharcterId(characterId);
          window.__canvasRTEInsertCharacterId = characterId;
        } else {
          setMasterJson((prev) => {
            const insertCharacter = prev.find(
              (char) => char.characterId === window.__canvasRTEInsertCharacterId
            );

            if (!insertCharacter) {
              return prev;
            }

            const newLocation = calculateNextLocation(insertCharacter.location);
            const newPosition = calculateNextPosition(insertCharacter.position);

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
            const next = [...prev, newCharacter];
            const afterInsert = getAllCharactersAfterInsert(insertCharacter);

            if (afterInsert.length > 0) {
              const updated = next.map((char) => {
                const afterInsertIndex = afterInsert.findIndex(
                  (c) => c.characterId === char.characterId
                );

                if (afterInsertIndex > -1) {
                  const newLocation = calculateNextLocation(char.location);
                  const newPosition = calculateNextPosition(char.position);

                  return {
                    ...char,
                    location: newLocation,
                    position: newPosition,
                  };
                }

                return char;
              });

              return updated;
            } else {
              return next;
            }
          });
        }

        return fontData;
      });
    }
  };

  useEffect(() => {
    loadFont(setFontData);
    window.addEventListener("keypress", handleKeypress);

    return () => {
      window.removeEventListener("keypress", handleKeypress);
    };
  }, []);

  // when no text exists, will calculate at first character
  const handleCanvasClick = (e: KonvaEventObject<MouseEvent>) => {
    console.info("canvas click");
    // setEditorActive(true);
    window.__canvasRTEEditorActive = true;
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
    // setInsertCharcterId(character.characterId);
    window.__canvasRTEInsertCharacterId = character.characterId;
    // setEditorActive(true);
    window.__canvasRTEEditorActive = true;
  };

  return { masterJson, handleCanvasClick, handleTextClick };
};
