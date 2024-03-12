import { useEffect, useMemo, useRef, useState } from "react";
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

  //   console.info("masterJson", masterJson);

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

  const getNewlineLocation = (insertLocation: Location) => {
    const proposedLine = insertLocation.line + 1;
    const linesPerPage = Math.floor(
      mainTextSize.height / getCapHeightPx(defaultStyle.fontSize)
    );
    const isNewPage = proposedLine >= linesPerPage;

    if (isNewPage) {
      const nextLocation = {
        page: insertLocation.page + 1,
        line: 0,
        lineIndex: 0,
      };

      return nextLocation;
    } else {
      const nextLocation = {
        page: insertLocation.page,
        line: proposedLine,
        lineIndex: 0,
      };

      return nextLocation;
    }
  };

  const calculateNextLocation = (
    insertLocation: Location,
    newSize: Size,
    newType: CharacterType
  ) => {
    // calculate newlines and pages as needed
    // will need to calculate width of current line and compare to page width

    if (newType === "newline") {
      return {
        shouldContinue: true, // would be false if working
        nextLocation: getNewlineLocation(insertLocation),
      };
    } else {
      // TODO: address performance hit
      const currentLine = masterJsonRef.current.filter(
        (char) =>
          char.location.page === insertLocation.page &&
          char.location.line === insertLocation.line
      );
      const currentLinePrecedingWidth = currentLine.reduce((acc, char) => {
        return char.location.lineIndex < insertLocation.lineIndex && char.size
          ? acc + char.size.width + letterSpacing
          : acc;
      }, 0);

      const fitsOnLine =
        currentLinePrecedingWidth + newSize.width < mainTextSize.width;
      const isEndOfParagraph =
        currentLinePrecedingWidth + newSize.width + checkSpace <
        mainTextSize.width;
      const isLastCharacterOfLine =
        currentLine.length === insertLocation.lineIndex;
      //   const stopCalculating = isLastCharacterOfLine && isEndOfParagraph; // perf king?
      const stopCalculating = false; // broken

      if (fitsOnLine) {
        const nextLocation = {
          page: insertLocation.page,
          line: insertLocation.line,
          lineIndex: insertLocation.lineIndex + 1,
        };

        return { shouldContinue: !stopCalculating, nextLocation };
      } else {
        return {
          shouldContinue: true,
          nextLocation: getNewlineLocation(insertLocation),
        };
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
    insertCharacter: Character, // equals previous location in afterInsert
    newLocation: Location,
    newSize: Size
  ) => {
    if (!fontDataRef.current) {
      return insertCharacter.position;
    }

    const isNewLine = newLocation.line > insertCharacter.location.line;
    const isNewPage = newLocation.page > insertCharacter.location.page;

    const nextX =
      isNewLine || isNewPage
        ? 0
        : insertCharacter.position.x + newSize.width + letterSpacing;
    const capHeightPx = getCapHeightPx(insertCharacter.style.fontSize);
    let nextY = isNewLine
      ? insertCharacter.position.y + capHeightPx
      : insertCharacter.position.y;
    nextY = isNewPage ? 0 : nextY;

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

  const getEndOfParagraphLocation = (insertCharacter: Character) => {};

  const getCharactersBetweenInsertAndParagraphEnd = (
    insertCharacter: Character
  ) => {
    let returnArray = [] as Character[];
    // TODO: need to address traversing whole object
    for (let i = 0; i < masterJsonRef.current.length; i++) {
      const char = masterJsonRef.current[i];

      if (char.location.page > insertCharacter.location.page) {
        returnArray.push(char);
      } else if (char.location.page === insertCharacter.location.page) {
        if (char.location.line > insertCharacter.location.line) {
          returnArray.push(char);
        } else if (char.location.line === insertCharacter.location.line) {
          if (char.location.lineIndex > insertCharacter.location.lineIndex) {
            returnArray.push(char);
          }
        }
      }

      if (
        char.type === "newline" &&
        char.location.page === insertCharacter.location.page &&
        char.location.line > insertCharacter.location.line &&
        char.location.lineIndex === 0
      ) {
        break;
      }
    }

    return returnArray;
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

      //   let passSize = insertCharacter.location.page ===

      const newLocation = calculateNextLocation(
        insertCharacter.location,
        newSize, // pass in 0,0 when newline?
        type
      );
      const newPosition = calculateNextPosition(
        insertCharacter,
        newLocation.nextLocation,
        insertCharacter.size
      );

      //   console.info("insertCharacter", insertCharacter);

      const newCharacter: Character = {
        characterId,
        character,
        location: newLocation.nextLocation,
        position: newPosition,
        size: newSize,
        style: defaultStyle,
        type,
      };

      // add the new character to the master json
      // then calculate the next location and position for all characters after the insert
      const next = [...masterJsonRef.current, newCharacter];
      //   const afterInsert = getAllCharactersAfterInsert(insertCharacter);
      const afterInsert =
        getCharactersBetweenInsertAndParagraphEnd(insertCharacter);

      console.info("afterInsert", afterInsert);

      if (afterInsert.length > 0) {
        let useCalculation = true;
        // let precedingChar: any;
        let updated = [] as Character[];
        next.forEach((char) => {
          //   let precedingChar = afterInsert.find(
          //     (c) =>
          //       c.location.page === char.location.page &&
          //       c.location.line === char.location.line &&
          //       c.location.lineIndex === char.location.lineIndex - 1
          //   );

          //   if (!precedingChar) {
          //     precedingChar = char;
          //   }

          const afterInsertIndex = afterInsert.findIndex(
            (c) => c.characterId === char.characterId
          );

          // if the character is after the insert, calculate new location and position
          if (afterInsertIndex > -1) {
            // const precedingCharacter = afterInsert[afterInsertIndex - 1];
            let newLocation: Location;
            let newPosition: Position;
            if (useCalculation) {
              let { shouldContinue, nextLocation } = calculateNextLocation(
                char.location,
                newSize,
                char.type
              );
              useCalculation = shouldContinue;
              newLocation = nextLocation;

              newPosition = calculateNextPosition(char, newLocation, newSize);
            } else {
              newLocation = char.location;
              newPosition = char.position;
            }

            const newChar = {
              ...char,
              location: newLocation,
              position: newPosition,
            };

            // precedingChar = newChar;

            updated.push(newChar);
          } else {
            updated.push(char);
          }
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
              newlineLocation,
              insertCharacter.size
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

  useEffect(() => {
    if (initialMarkdown && fontDataRef.current) {
      initialMarkdown.split("").forEach((character) => {
        if (!fontDataRef.current) {
          return;
        }

        // TODO: handle newlines in markdown

        if (character === "\n") {
          const characterId = uuidv4();
          const type = "newline";
          const character = "";

          const capHeightPx = getCapHeightPx(defaultStyle.fontSize);

          const newSize: Size = {
            width: 0,
            height: capHeightPx,
          };

          insertCharacter(characterId, character, type, defaultStyle, newSize);
          return;
        } else {
          const characterId = uuidv4();
          const type = "character";

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

          insertCharacter(characterId, character, type, defaultStyle, newSize);
        }
      });
    }
  }, [initialMarkdown, fontData]);

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

  // TODO: check performance of this
  const jsonByPage = useMemo(() => {
    const pages = masterJson.reduce(
      (acc, char) => {
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