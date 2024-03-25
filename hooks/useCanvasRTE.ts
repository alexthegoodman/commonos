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
};

export type MasterJson = Character[];

export type DocumentSize = {
  width: number;
  height: number;
};

// extend window type
declare global {
  interface Window {
    // __canvasRTEEditorActive: boolean;
    __canvasRTEInsertCharacterId: string | null;
    __canvasRTEInsertCharacterIndex: number;
  }
}

// window.__canvasRTEEditorActive = false;
window.__canvasRTEInsertCharacterId = null;
window.__canvasRTEInsertCharacterIndex = 0;

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

  const getNewlineLocation = (
    insertLocation: Location,
    replace: boolean = false
  ) => {
    const proposedLine = replace
      ? insertLocation.line
      : insertLocation.line + 1;
    const linesPerPage = Math.floor(
      mainTextSize.height / getCapHeightPx(defaultStyle.fontSize)
    );
    const isNewPage = proposedLine >= linesPerPage;

    if (isNewPage) {
      const nextLocation = {
        page: insertLocation.page + 1, // adds one to existing newlines as-is
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

  const getCurrentLine = (
    insertLocation: Location,
    characters: Character[]
  ) => {
    // PERF: check
    const currentLine = characters.filter(
      (char) =>
        char?.location?.page === insertLocation.page &&
        char?.location?.line === insertLocation.line
    );

    return currentLine;
  };

  const getCurrentLinePrecedingWidth = (
    insertLocation: Location,
    characters: Character[]
  ) => {
    const currentLine = getCurrentLine(insertLocation, characters);
    const currentLinePrecedingWidth = currentLine.reduce((acc, char) => {
      if (!char.location) return acc;
      return char.location?.lineIndex < insertLocation.lineIndex && char.size
        ? acc + char.size.width + letterSpacing
        : acc;
    }, 0);

    return currentLinePrecedingWidth;
  };

  const getCurrentLinePrecedingHeight = (insertLocation: Location) => {};

  // calculate the initial location of this char
  const initializeLocation = (
    insertLocation: Location, // this essentially is the prevChar
    newSize: Size,
    newType: CharacterType,
    replace: boolean,
    fitsOnLine: boolean,
    lineIndexShift: number = 1
  ) => {
    // calculate newlines and pages as needed
    // will need to calculate width of current line and compare to page width

    if (newType === "newline") {
      return getNewlineLocation(insertLocation, replace);
    } else {
      if (fitsOnLine) {
        const nextLocation = {
          page: insertLocation.page,
          line: insertLocation.line,
          lineIndex: insertLocation.lineIndex + lineIndexShift,
        };

        return nextLocation;
      } else {
        return getNewlineLocation(insertLocation);
      }
    }
  };

  // calculate the new location for this char
  const calculateNextLocation = (
    currentCharLocation: Location, // this is the current char in the masterJson loop
    newSize: Size,
    newType: CharacterType,
    replace: boolean,
    fitsOnLine: boolean,
    lineIndexShift: number = 1
  ) => {
    if (newType === "newline") {
      return getNewlineLocation(currentCharLocation, replace);
    } else {
      if (fitsOnLine) {
        // what if it fits on line, but doesn't need to move forward by 1 for a reason?
        const nextLocation = {
          page: currentCharLocation.page,
          line: currentCharLocation.line,
          lineIndex: currentCharLocation.lineIndex + lineIndexShift,
        };

        return nextLocation;
      } else {
        return getNewlineLocation(currentCharLocation);
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

  const calculatePosition = (
    previousCharacter: Character,
    characterLocation: Location,
    characterSection: Character[],
    newCharacter: Character
  ) => {
    // if (!previousCharacter) {
    //   return {
    //     x: 0,
    //     y: 0,
    //   };
    // }

    if (!fontDataRef.current || !previousCharacter.location) {
      return previousCharacter.position;
    }

    const isNewLine =
      characterLocation.page === previousCharacter.location.page &&
      characterLocation.line > previousCharacter.location.line &&
      characterLocation.lineIndex === 0;
    const isNewPage =
      characterLocation.page > previousCharacter.location.page &&
      characterLocation.lineIndex === 0;

    // const backupCharacter = getPreviousChar(
    //   characterSection,
    //   previousCharacter
    // );

    // if (!previousCharacter.position) {
    //   console.info(
    //     "!previousCharacter.position",
    //     previousCharacter,
    //     backupCharacter
    //   );
    // }

    // new chars are at end of array, so their position is updated at the end
    // and getting the previous char before that position has been updated results in stale data
    // maybe with the newCharacter location, we can determine if char previousCharacter is newCharacter.location.lineIndex+1, then add newSize
    // probelm is, this approach only works for the character at newCharacter.location.lineIndex+1
    // maybe with getLinePrecedingWIdth, it will always calculate the whole distance, even though more expensive
    // let insertX = previousCharacter.position
    //   ? previousCharacter.position.x
    //   : backupCharacter?.position
    //     ? backupCharacter?.position?.x +
    //       backupCharacter.size.width +
    //       letterSpacing
    //     : 0;

    // if (
    //   newCharacter?.location?.page === previousCharacter.location.page &&
    //   newCharacter.location.line === previousCharacter.location.line &&
    //   newCharacter.location.lineIndex + 1 ===
    //     previousCharacter.location.lineIndex
    // ) {
    //   console.info("insertX", newCharacter.size.width + letterSpacing);
    //   insertX += newCharacter.size.width + letterSpacing;
    // }

    // const insertY = previousCharacter.position
    //   ? previousCharacter.position.y
    //   : 0;

    let nextX =
      isNewLine || isNewPage
        ? 0
        : getCurrentLinePrecedingWidth(characterLocation, characterSection);
    // let nextX =
    //   isNewLine || isNewPage
    //     ? 0
    //     : insertX + previousCharacter.size.width + letterSpacing;

    const capHeightPx = getCapHeightPx(previousCharacter.style.fontSize);

    const insertLine = previousCharacter.location.line;
    const relativeHeight = insertLine * capHeightPx;

    let nextY = isNewLine ? relativeHeight + capHeightPx : relativeHeight;
    nextY = isNewPage ? 0 : nextY;

    const nextPosition = {
      x: nextX,
      y: nextY,
    };

    return nextPosition;
  };

  // // this needs to select characters based on location value
  // const getAllCharactersAfterInsert = (insertCharacter: Character) => {
  //   return masterJsonRef.current.filter((char) => {
  //     if (char.location.page > insertCharacter.location.page) {
  //       return true;
  //     } else if (char.location.page === insertCharacter.location.page) {
  //       if (char.location.line > insertCharacter.location.line) {
  //         return true;
  //       } else if (char.location.line === insertCharacter.location.line) {
  //         if (char.location.lineIndex > insertCharacter.location.lineIndex) {
  //           return true;
  //         }
  //       }
  //     }

  //     return false;
  //   });
  // };

  // const getEndOfParagraphLocation = (insertCharacter: Character) => {};

  // const getCharactersBetweenInsertAndParagraphEnd = (
  //   insertCharacter: Character
  // ) => {
  //   let returnArray = [] as Character[];
  //   // TODO: need to address traversing whole object

  //   let stoppingNewlines: Character[] = [];
  //   // PERF: check
  //   for (let i = 0; i < masterJsonRef.current.length; i++) {
  //     const char = masterJsonRef.current[i];

  //     if (char.location && insertCharacter.location) {
  //       if (
  //         char.type === "newline" &&
  //         char.location.page === insertCharacter.location.page &&
  //         char.location.line > insertCharacter.location.line &&
  //         char.location.lineIndex === 0
  //       ) {
  //         stoppingNewlines.push(char);

  //         break;
  //       }
  //     }
  //   }

  //   const closestNewline = stoppingNewlines.reduce((acc, newline) => {
  //     return newline.location &&
  //       acc.location &&
  //       newline.location.line < acc.location.line
  //       ? newline
  //       : acc;
  //   }, stoppingNewlines[0]);

  //   // console.info("stoppingNewlines", closestNewline, stoppingNewlines);

  //   if (!closestNewline) {
  //     return [];
  //   }

  //   // PERF: check
  //   for (let i = 0; i < masterJsonRef.current.length; i++) {
  //     const char = masterJsonRef.current[i];

  //     if (
  //       char.location &&
  //       insertCharacter.location &&
  //       closestNewline.location
  //     ) {
  //       if (
  //         char.location.page > insertCharacter.location.page &&
  //         char.location.page <= closestNewline?.location.page
  //       ) {
  //         returnArray.push(char);
  //       } else if (
  //         char.location.page === insertCharacter.location.page &&
  //         char.location.page <= closestNewline?.location.page
  //       ) {
  //         if (
  //           char.location.line > insertCharacter.location.line &&
  //           char.location.line <= closestNewline?.location.line
  //         ) {
  //           returnArray.push(char);
  //         } else if (
  //           char.location.line === insertCharacter.location.line &&
  //           char.location.line <= closestNewline?.location.line
  //         ) {
  //           if (char.location.lineIndex > insertCharacter.location.lineIndex) {
  //             returnArray.push(char);
  //           }
  //         }
  //       }
  //     }
  //   }

  //   return returnArray;
  // };

  const getCharactersBetweenInsertAndParagraphEnd = (
    insertCharacter: Character
  ) => {
    const characters = masterJsonRef.current.filter((char) => {
      if (!char.location) return false;
      if (!insertCharacter.location) return false;
      if (insertCharacter.paragraphIndex === null) return false;

      return (
        char.paragraphIndex === insertCharacter.paragraphIndex &&
        (char.location?.line > insertCharacter.location?.line ||
          (char.location?.line === insertCharacter.location?.line &&
            char.location?.lineIndex > insertCharacter.location?.lineIndex))
      );
    });

    console.info("characters", characters);

    return characters;
  };

  const spliceMasterJson = (
    newCharacter: Character,
    insertCharacterIndex: number
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
    // const next = masterJsonRef.current.slice();
    // next.splice(insertCharacterIndex + 1, 0, newCharacter);

    // much faster
    const next = [...masterJsonRef.current, newCharacter];

    return next;
  };

  // best ran as post-processing step, after everything is loaded?
  const calculateIsCharacterLast = (
    updated: Character[],
    location: Location
  ) => {
    // character after next location and on same line
    // const characterAfterNextLocation = masterJsonRef.current.find((char) => char.location.page === nextLocation.page && char.location.line === nextLocation.line && char.location.lineIndex === nextLocation.lineIndex + 1)
    // return characterAfterNextLocation ? false : true;

    const maxLineIndexOfLine = Math.max(
      ...updated.map((char) =>
        char.location?.page === location.page &&
        char.location?.line === location.line
          ? char.location.lineIndex
          : 0
      )
    );
    return location.lineIndex === maxLineIndexOfLine;
  };

  // const getSpaceCharsBeforeChar = (updated: Character[], char: Character) => {
  //   let spaceCount = 0;
  //   updated.filter((checkChar) => {
  //     if (checkChar.character === " ") {
  //       if (
  //         checkChar.location.page < char.location.page ||
  //         (checkChar.location.page === char.location.page &&
  //           checkChar.location.line < char.location.line) ||
  //         (checkChar.location.page === char.location.page &&
  //           checkChar.location.line === char.location.line &&
  //           checkChar.location.lineIndex < char.location.lineIndex)
  //       ) {
  //         spaceCount++;
  //       }
  //     }
  //   });
  //   return spaceCount;
  // };

  const calculateWordIndex = (updated: Character[], char: Character) => {
    let wordCount = 0;
    updated.forEach((checkChar) => {
      if (char.location && checkChar.location) {
        if (checkChar.character === " " || checkChar.type === "newline") {
          if (
            checkChar.location.page < char.location.page ||
            (checkChar.location.page === char.location.page &&
              checkChar.location.line < char.location.line) ||
            (checkChar.location.page === char.location.page &&
              checkChar.location.line === char.location.line &&
              checkChar.location.lineIndex < char.location.lineIndex)
          ) {
            wordCount++;
          }
        }
      }
    });
    return wordCount;
  };

  const calculateParagraphIndex = (updated: Character[], char: Character) => {
    let paragraphCount = 0;
    updated.forEach((checkChar) => {
      if (char.location && checkChar.location) {
        if (checkChar.type === "newline") {
          if (
            checkChar.location.page < char.location.page ||
            (checkChar.location.page === char.location.page &&
              checkChar.location.line < char.location.line) ||
            (checkChar.location.page === char.location.page &&
              checkChar.location.line === char.location.line &&
              checkChar.location.lineIndex < char.location.lineIndex)
          ) {
            paragraphCount++;
          }
        }
      }
    });
    return paragraphCount;
  };

  const getPreviousChar = (updated: Character[], char: Character) => {
    // TODO: find() and reduce() on limitArray + 1
    if (char.location?.lineIndex === 0) {
      return updated.reduce((previousValue, checkChar) => {
        // TODO: return null for first char of document
        // cant check previousValue location unless has beginning value?
        if (!char.location) return previousValue;

        // if (
        //   !(
        //     checkChar.location?.page === char.location?.page &&
        //     checkChar.location?.line === char.location?.line - 1 &&
        //     checkChar.location?.lineIndex > previousValue.location?.lineIndex
        //   ) && typeof
        // ) {
        //   console.info(
        //     "previousValue.location?.lineIndex",
        //     checkChar.location?.lineIndex > previousValue.location?.lineIndex,
        //     previousValue.location?.lineIndex
        //   );
        // }

        const previousLineIndex = previousValue.location?.lineIndex
          ? previousValue.location?.lineIndex
          : 0;

        return checkChar.location?.page === char.location?.page &&
          checkChar.location?.line === char.location?.line - 1 &&
          checkChar.location?.lineIndex >= previousLineIndex
          ? checkChar
          : previousValue;
      });
    } else {
      return updated.find((checkChar) => {
        if (!char.location) return null;

        return (
          checkChar.location?.page === char.location?.page &&
          checkChar.location?.line === char.location?.line &&
          checkChar.location?.lineIndex === char.location.lineIndex - 1
        );
      });
    }
  };

  const postProcessChar = (
    updated: Character[],
    limitArray: Character[],
    char: Character,
    newCharacter: Character
  ) => {
    if (!char.location) return char;

    // TODO: calculate on limitArray instead if possible
    const lastLineCharacter = calculateIsCharacterLast(updated, char.location);
    const wordIndex = calculateWordIndex(updated, char);
    const paragraphIndex = calculateParagraphIndex(updated, char);

    // TODO: calculate position
    const previousChar = getPreviousChar(updated, char);

    let position: Position | null = char.position;
    if (typeof previousChar === "undefined") {
      console.info("!previousChar", char);
    }
    if (typeof previousChar !== "undefined") {
      position = calculatePosition(
        previousChar,
        char.location,
        updated,
        newCharacter
      );
    }

    const postChar = {
      ...char,
      lastLineCharacter,
      wordIndex,
      paragraphIndex,
      position,
    };

    return postChar;
  };

  const initializePostProcessChar = (
    updated: Character[],
    char: Character,
    prevChar: Character | null
  ) => {
    if (!char.location) return char;

    const lastLineCharacter = calculateIsCharacterLast(updated, char.location);
    const wordIndex = calculateWordIndex(updated, char);
    const paragraphIndex = calculateParagraphIndex(updated, char);

    let position: Position | null = {
      x: 0,
      y: 0,
    };
    if (prevChar) {
      position = calculatePosition(prevChar, char.location, updated, char);
    }

    const postChar = {
      ...char,
      lastLineCharacter,
      wordIndex,
      paragraphIndex,
      position,
    };

    return postChar;
  };

  const postProcessMasterJson = (
    updated: Character[],
    limitArray: Character[] | null,
    newCharacter: Character
  ) => {
    console.info("post processing...");
    let postProcessed = [] as Character[];

    if (!limitArray) {
      updated.forEach((char) => {
        const postChar = postProcessChar(
          updated,
          limitArray,
          char,
          newCharacter
        );
        postProcessed.push(postChar);
      });
    } else {
      updated.forEach((char) => {
        const afterInsertIndex = limitArray.findIndex(
          (c) => c.characterId === char.characterId
        );

        // if the character is after the insert, calculate new location and position
        if (afterInsertIndex > -1) {
          const postChar = postProcessChar(
            updated,
            limitArray,
            char,
            newCharacter
          );
          postProcessed.push(postChar);
        } else if (char.characterId === newCharacter.characterId) {
          console.info("match");
          const postChar = postProcessChar(
            updated,
            limitArray,
            char,
            newCharacter
          );
          postProcessed.push(postChar);
        } else {
          // TODO: update only updated portion, rather than pushing every char every time
          postProcessed.push(char);
        }
      });
    }

    return postProcessed;
  };

  const initializePostProcessMasterJson = (updated: Character[]) => {
    console.info("post processing...");
    let postProcessed = [] as Character[];
    let prevChar: Character | null = null;
    updated.forEach((char, i) => {
      // const previousChar = updated[i - 1]; // in order during initialization
      prevChar = initializePostProcessChar(updated, char, prevChar);
      postProcessed.push(prevChar);
    });
    return postProcessed;
  };

  const insertCharacter = (
    characterId: string,
    character: string,
    type: CharacterType,
    defaultStyle: Style,
    newSize: Size,
    postprocess: boolean
  ) => {
    console.info("insertCharacter", insertCharacterIdRef.current, postprocess);
    if (insertCharacterIdRef.current === null) {
      const newLocation = {
        page: 0,
        line: 0,
        lineIndex: 0,
      };

      // const newPosition = {
      //   x: 0,
      //   y: 0,
      // };

      const newCharacter: Character = {
        characterId,
        character,
        location: newLocation,
        position: null,
        size: newSize,
        style: defaultStyle,
        type,
        lastLineCharacter: null,
        wordIndex: 0,
        paragraphIndex: 0,
      };

      // add the new character to the master json
      //   const next = [...masterJsonRef.current, newCharacter];
      // splice into logical array position

      const next = spliceMasterJson(newCharacter, 0);
      setMasterJson(next);

      setInsertCharcterId(characterId);
      setInsertCharacterIndex(0);
      // return characterId;
      // window.__canvasRTEInsertCharacterId = characterId;
    } else {
      // PERF: check
      const insertCharacter = masterJsonRef.current.find(
        (char) => char.characterId === insertCharacterIdRef.current
      );
      //   const insertCharacterIndex = masterJsonRef.current.findIndex(
      //     (char) => char.characterId === insertCharacterIdRef.current
      //   );
      if (insertCharacterIndexRef.current === null) {
        return;
      }

      //   const insertCharacter =
      //     masterJsonRef.current[insertCharacterIndexRef.current];

      if (!insertCharacter || !insertCharacter.location) {
        return;
      }

      // PERF: setting as static value does not help perf
      const currentLinePrecedingWidth = getCurrentLinePrecedingWidth(
        insertCharacter.location,
        masterJsonRef.current
      );
      const fitsOnLine =
        currentLinePrecedingWidth + newSize.width < mainTextSize.width;

      const newLocation = initializeLocation(
        insertCharacter.location,
        newSize, // pass in 0,0 when newline?
        type,
        false,
        fitsOnLine
      );

      const newCharacter: Character = {
        characterId,
        character,
        location: newLocation,
        position: null,
        size: newSize,
        style: defaultStyle,
        type,
        lastLineCharacter: null,
        wordIndex: null,
        paragraphIndex: null,
      };

      // add the new character to the master json
      // then calculate the next location and position for all characters after the insert
      //   const next = [...masterJsonRef.current, newCharacter];

      const next = spliceMasterJson(
        newCharacter,
        insertCharacterIndexRef.current
      );

      //   const afterInsert = getAllCharactersAfterInsert(insertCharacter);
      // TODO: possible to run once rather on each insertCharacter, especially at beginning? will require postprocess step
      let afterInsert =
        getCharactersBetweenInsertAndParagraphEnd(insertCharacter);
      //   const afterInsert = [];

      console.info("afterInsert", afterInsert.length);

      if (afterInsert.length > 0) {
        let useCalculation = true;
        // let precedingChar: any;
        let updated = [] as Character[];
        // these shift values cannot work because they assume `next` is in order
        // let nextLineShift = {
        //   width: 0,
        //   height: 0,
        // };
        // let lineIndexShift = 0;
        // PERF: check
        next.forEach((char) => {
          const afterInsertIndex = afterInsert.findIndex(
            (c) => c.characterId === char.characterId
          );

          // if the character is after the insert, calculate new location and position
          if (
            afterInsertIndex > -1 &&
            char.location &&
            insertCharacter.location
          ) {
            // const precedingCharacter = afterInsert[afterInsertIndex - 1];
            // const hasPrecedingCharacter =
            //   typeof precedingCharacter !== "undefined";
            // const precedingCharIsPreviousLine =
            //   precedingChar?.location.line === char.location.line - 1;
            const isSameLine =
              char.location.line === insertCharacter.location.line &&
              char.location.page === insertCharacter.location.page;

            let newLocation: Location;
            // let newPosition: Position;

            // little perf benefit with running this once per line?
            const currentLinePrecedingWidth = getCurrentLinePrecedingWidth(
              char.location,
              next
            );
            const fitsOnLine = isSameLine
              ? currentLinePrecedingWidth + newSize.width + char.size.width <
                mainTextSize.width
              : currentLinePrecedingWidth + char.size.width <
                mainTextSize.width;

            let nextLocation = calculateNextLocation(
              char.location,
              newSize, // should be 0,0 for newline
              char.type,
              true,
              fitsOnLine,
              1
            );
            newLocation = nextLocation;

            const newChar = {
              ...char,
              location: newLocation,
            };

            updated.push(newChar);
          } else {
            // TODO: update only updated portion, rather than pushing every char every time
            updated.push(char);
          }
        });

        console.info("time to postprocess");

        if (postprocess) {
          const postProcessed = postProcessMasterJson(
            updated,
            afterInsert,
            newCharacter
          );

          setMasterJson(postProcessed);
        } else {
          // return updated;
          setMasterJson(updated);
        }
      } else {
        // return next;
        setMasterJson(next);
      }

      // if (postprocess) {
      //   const postProcessed = postProcessMasterJson(next, afterInsert);
      //   setMasterJson(postProcessed);
      // } else {
      //   // return updated;
      //   setMasterJson(next);
      // }

      setInsertCharcterId(characterId);
      setInsertCharacterIndex(insertCharacterIndexRef.current + 1);
    }
  };

  const initializeCharacter = (
    characters: Character[],
    characterId: string,
    character: string,
    type: CharacterType,
    defaultStyle: Style,
    newSize: Size,
    previousCharacter: Character | null | undefined // safe because characters are in order during initialization
  ) => {
    if (window.__canvasRTEInsertCharacterId === null) {
      const newLocation = {
        page: 0,
        line: 0,
        lineIndex: 0,
      };

      // const newPosition = {
      //   x: 0,
      //   y: 0,
      // };

      const newCharacter: Character = {
        characterId,
        character,
        location: newLocation,
        position: null,
        size: newSize,
        style: defaultStyle,
        type,
        lastLineCharacter: null,
        wordIndex: 0,
        paragraphIndex: 0,
      };

      // add the new character to the master json
      //   const next = [...masterJsonRef.current, newCharacter];
      // splice into logical array position

      // want to set only once
      // const next = spliceMasterJson(newCharacter, 0);
      // setMasterJson(next);

      // setInsertCharcterId(characterId);
      // setInsertCharacterIndex(0);
      // return characterId;
      window.__canvasRTEInsertCharacterId = characterId;
      window.__canvasRTEInsertCharacterIndex = 0;

      return newCharacter;
    } else {
      // PERF: check
      // this character is in order because it is via initializeCharacter
      // console.info(
      //   "window.__canvasRTEInsertCharacterId",
      //   window.__canvasRTEInsertCharacterId
      // );
      // bad to use find on whole array but also not updating masterJson each character so cannot find this way
      // const previousCharacter = masterJsonRef.current.find(
      //   (char) => char.characterId === window.__canvasRTEInsertCharacterId
      // );
      //   const insertCharacterIndex = masterJsonRef.current.findIndex(
      //     (char) => char.characterId === insertCharacterIdRef.current
      //   );
      // if (insertCharacterIndexRef.current === null) {
      //   return;
      // }

      //   const insertCharacter =
      //     masterJsonRef.current[insertCharacterIndexRef.current];

      if (!previousCharacter || !previousCharacter.location) {
        return;
      }

      // PERF: setting as static value does not help perf
      const currentLinePrecedingWidth = getCurrentLinePrecedingWidth(
        previousCharacter.location,
        characters
      );
      const fitsOnLine =
        currentLinePrecedingWidth + newSize.width < mainTextSize.width;

      const newLocation = initializeLocation(
        previousCharacter.location,
        newSize, // pass in 0,0 when newline?
        type,
        false,
        fitsOnLine
      );

      const newCharacter: Character = {
        characterId,
        character,
        location: newLocation,
        position: null,
        size: newSize,
        style: defaultStyle,
        type,
        lastLineCharacter: null,
        wordIndex: null,
        paragraphIndex: null,
      };

      // const next = spliceMasterJson(
      //   newCharacter,
      //   window.__canvasRTEInsertCharacterIndex
      // );

      // setMasterJson(next);

      // too slow for initialization for sure, maybe for typing
      // setInsertCharcterId(characterId);
      // setInsertCharacterIndex(insertCharacterIndexRef.current + 1);
      window.__canvasRTEInsertCharacterId = characterId;
      window.__canvasRTEInsertCharacterIndex =
        window.__canvasRTEInsertCharacterIndex + 1;

      return newCharacter;
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    e.preventDefault();
    // console.info("keypress", e.key, editorActiveRef.current);

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

            // const insertCharacter = masterJsonRef.current.find(
            //   (char) => char.characterId === insertCharacterIdRef.current
            // );
            const insertCharacterIndex = masterJsonRef.current.findIndex(
              (char) => char.characterId === insertCharacterIdRef.current
            );
            const insertCharacter = masterJsonRef.current[insertCharacterIndex];

            if (!insertCharacter || !insertCharacter.location) {
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

            const newCharacter: Character = {
              characterId,
              character,
              location: newlineLocation,
              position: null,
              size: newlineSize,
              style: defaultStyle,
              type: "newline",
              lastLineCharacter: null,
              wordIndex: null,
              paragraphIndex: null,
            };

            // add the new character to the master json
            // const next = [...masterJsonRef.current, newCharacter];
            const next = spliceMasterJson(newCharacter, insertCharacterIndex);

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
              tabSize,
              true
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
              newSize,
              true
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
      const initialCharacters = initialMarkdown.split("");
      const newChars: Character[] = [];
      let previousChar: Character | null | undefined = null;
      initialCharacters.forEach((character, i) => {
        // console.info("character", character);
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

          previousChar = initializeCharacter(
            newChars,
            characterId,
            character,
            type,
            defaultStyle,
            newSize,
            previousChar
          );

          if (!previousChar) return;

          newChars.push(previousChar);

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

          previousChar = initializeCharacter(
            newChars,
            characterId,
            character,
            type,
            defaultStyle,
            newSize,
            previousChar
          );

          // console.info("newChar", newChar);

          if (!previousChar) return;

          newChars.push(previousChar);

          return;
        }
      });

      console.info("newChars", newChars);

      // postprocess after all initial characters added
      const postProcessed = initializePostProcessMasterJson(newChars);
      setMasterJson(postProcessed);
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
    setInsertCharacterIndex(characterIndex);
    // window.__canvasRTEInsertCharacterId = character.characterId;
    setEditorActive(true);
    // window.__canvasRTEEditorActive = true;
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
