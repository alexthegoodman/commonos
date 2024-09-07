// import RopeSequence from "rope-sequence";
import { ComponentRope } from "../helpers/ComponentRope";
import IntervalTree, {
  Interval,
  SearchOutput,
} from "@flatten-js/interval-tree";
import * as fontkit from "fontkit";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useMemo, useRef, useState } from "react";

interface MappedFormat {
  interval: {
    high: number;
    low: number;
  };
  format: Style;
}

interface FormattedText {
  text: string;
  format: Style | null;
}

export interface RenderItem {
  char: string;
  x: number;
  y: number;
  width: number;
  height: number;
  capHeight: number;
  format: Style;
  page: number;
}

export type Style = {
  color: string;
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
  italic: boolean;
  underline: boolean;
  isLineBreak: boolean;
};

export type DocumentSize = {
  width: number;
  height: number;
};

const letterSpacing = 1;
export const defaultStyle: Style = {
  color: "black",
  fontSize: 16,
  fontWeight: "normal",
  fontFamily: "Inter",
  italic: false,
  underline: false,
  isLineBreak: false,
};

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

// extend window type
declare global {
  interface Window {
    // __canvasRTEEditorActive: boolean;
    //   __canvasRTEInsertCharacterId: string | null;
    __canvasRTEInsertCharacterIndex: number;
  }
}

// window.__canvasRTEEditorActive = false;
//   window.__canvasRTEInsertCharacterId = null;
window.__canvasRTEInsertCharacterIndex = 0;

class LayoutTree {
  public root: LayoutNode;

  constructor() {
    this.root = new LayoutNode(0, Infinity);
  }

  update(start: number, end: number, layoutInfo: RenderItem[]) {
    this.root.update(start, end, layoutInfo);
  }

  query(start: number, end: number) {
    return this.root.query(start, end);
  }
}

class LayoutNode {
  public start: number;
  public end: number;
  public left: LayoutNode | null;
  public right: LayoutNode | null;
  public layoutInfo: RenderItem[] | null;
  public max: number;

  constructor(
    start: number,
    end: number,
    layoutInfo: RenderItem[] | null = null
  ) {
    this.start = start;
    this.end = end;
    this.left = null;
    this.right = null;
    this.layoutInfo = layoutInfo ? layoutInfo : null;
    this.max = end; // Helps in quickly determining if a range intersects this node
  }

  update(start: number, end: number, layoutInfo: RenderItem[]) {
    // console.info("LayoutNode update: ", start, end, layoutInfo);

    this.layoutInfo = layoutInfo;

    // If the update range is completely outside this node's range, do nothing
    if (end <= this.start || start >= this.end) {
      return;
    }

    // If this node is completely contained in the update range
    if (start <= this.start && end >= this.end) {
      return;
    }

    // console.info("working on update...");

    // Recurse on children
    if (this.left) {
      this.left.update(start, end, layoutInfo);
    }
    if (this.right) {
      this.right.update(start, end, layoutInfo);
    }

    // If this node is a leaf and partially overlaps, split it
    if (!this.left && !this.right) {
      // console.info("split");
      this.split();
    }

    // Update max value
    this.max = Math.max(
      this.left ? this.left.max : this.end,
      this.right ? this.right.max : this.end
    );
  }

  query(start: number, end: number): LayoutNode[] {
    // If the query range is completely outside this node's range, return empty array
    if (end <= this.start || start >= this.max) {
      // console.warn("node query out of range", end, this.start, start, this.max);
      return [];
    }

    // If this node is a leaf, return its layout info
    if (!this.left && !this.right) {
      // return [
      //   { start: this.start, end: this.end, layoutInfo: this.layoutInfo },
      // ];
      return [new LayoutNode(this.start, this.end, this.layoutInfo)];
    }

    // Recurse on children
    let result: LayoutNode[] = [];
    if (this.left) {
      result = result.concat(this.left.query(start, end));
    }
    if (this.right) {
      result = result.concat(this.right.query(start, end));
    }

    // console.info("LayoutNode query: ", result);

    return result;
  }

  split() {
    const mid = Math.floor((this.start + this.end) / 2);
    this.left = new LayoutNode(this.start, mid);
    this.right = new LayoutNode(mid, this.end);

    if (this.layoutInfo) {
      // console.info("split set layoutInfo", this.layoutInfo);
      this.left.layoutInfo = this.layoutInfo;
      this.right.layoutInfo = this.layoutInfo;
    }

    // if (this.layoutInfo) {
    //   // Find the index where we should split the layoutInfo
    //   const splitIndex = this.layoutInfo.findIndex((item) => item.x >= mid);

    //   if (splitIndex !== -1) {
    //     // Split the layoutInfo between left and right nodes
    //     this.left.layoutInfo = this.layoutInfo.slice(0, splitIndex);
    //     this.right.layoutInfo = this.layoutInfo.slice(splitIndex);
    //   } else {
    //     // If all items are in the left half
    //     this.left.layoutInfo = this.layoutInfo;
    //     this.right.layoutInfo = [];
    //   }
    // }

    // // Clear the layoutInfo from this node as it's no longer a leaf
    // this.layoutInfo = null;
  }
}

class FormattedPage {
  //   public content: RopeSequence<any>;
  public content: ComponentRope;
  public formatting: IntervalTree;
  public layout: LayoutTree;
  public size: DocumentSize;
  public pageNumber: number;

  public fontData: fontkit.Font;

  constructor(
    size: DocumentSize,
    fontData: fontkit.Font,
    pageNumber: number = 0
  ) {
    this.content = new ComponentRope("");
    this.formatting = new IntervalTree();
    this.layout = new LayoutTree();
    this.size = size;
    this.fontData = fontData;
    this.pageNumber = pageNumber;
  }

  insert(index: number, text: string, format: Style) {
    const lines = text.split(/\r?\n/);
    let currentIndex = index;

    // console.info("insert page", text.length);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      currentIndex = Math.min(currentIndex, this.content.length);

      // console.info("current length", this.content.length);

      if (line.length > 0) {
        // console.info("line not 0", line);
        // Insert the line
        this.content.insert(currentIndex, line);
        // this.updateFormatting(currentIndex, line.length, format);
        this.formatting.insert(
          new Interval(currentIndex, currentIndex + line.length),
          format
        );
      }

      currentIndex += line.length;

      // If this isn't the last line, insert a line break
      if (i < lines.length - 1 || line === "") {
        this.insertLineBreak(currentIndex);
        currentIndex++;
      }
    }

    // console.info("check length", this.content.length);

    // TODO: update layout in staggered fashion?
    // go to try on rebalnce pages?
    // this.updateLayout(index, currentIndex);
    // this.updateLayout(0, this.content.length);
  }

  insertLineBreak(index: number) {
    // Insert a special character or object to represent a line break
    index = Math.min(index, this.content.length);
    // console.info("inserting line break");
    this.content.insert(index, "\n");
    // this.content.insert(index + 1, "\n");
    // this.updateFormatting(index, 1, { isLineBreak: true });
    this.formatting.insert(new Interval(index, index + 1), {
      ...defaultStyle,
      isLineBreak: true,
    });
  }

  delete(start: number, end: number) {
    const deleteLength = end - start;
    this.content.remove(start, end);
    this.formatting.remove([start, end]);
    this.adjustFormatting(start, -deleteLength);
  }

  adjustFormatting(index: number, length: number) {
    // this.formatting.forEach([index, Infinity], (interval: Interval) => {
    // TODO: optimize
    this.formatting.forEach((key: [number, number], value) => {
      if (key[0] >= index) {
        this.formatting.remove(key);
        // this.formatting.insert([key[0] + length, key[1] + length], value);
        this.formatting.insert(
          new Interval(key[0] + length, key[1] + length),
          value
        );
      } else if (key[1] > index) {
        this.formatting.remove(key);
        // this.formatting.insert([key[0], key[1] + length], value);
        this.formatting.insert(new Interval(key[0], key[1] + length), value);
      }
    });
  }

  getFormattedText(start: number, end: number) {
    const text = this.content.substring(start, end);
    const formats = this.formatting.search([start, end], (value, key) => ({
      interval: key,
      format: value,
    })) as unknown as MappedFormat[];
    // console.info("also getFormattedText", text);
    return this.mergeTextAndFormatting(text, formats, start);
  }

  mergeTextAndFormatting(
    text: string,
    formats: MappedFormat[],
    offset: number
  ) {
    let result: FormattedText[] = [];
    let currentIndex = 0;

    // formats.sort((a, b) => a[0] - b[0]);
    formats.sort((a, b) => a.interval.low - a.interval.low);

    // console.info("formats", formats);

    for (let { interval, format } of formats) {
      // let start = interval[0];
      // let end = interval[1];
      let start = interval.low;
      let end = interval.high;

      // if format interval is 0 and 0, it will continue to pull from 0...

      start = Math.max(start - offset, 0);
      end = Math.min(end - offset, text.length);

      if (currentIndex < start) {
        result.push({ text: text.slice(currentIndex, start), format: null });
      }

      result.push({ text: text.slice(start, end), format });
      currentIndex = end;
    }

    if (currentIndex < text.length) {
      result.push({ text: text.slice(currentIndex), format: null });
    }

    return result;
  }

  updateLayout(start: number, end: number) {
    const text = this.content.substring(start, end);
    const formats = this.formatting.search([start, end], (value, key) => ({
      interval: key,
      format: value,
    })) as unknown as MappedFormat[];
    // console.info("updateLayout: ", text, formats, start);
    const layoutInfo = this.calculateLayout(text, formats, start, 0);
    console.info("updateLayout: ", start, end);
    this.layout.update(start, end, layoutInfo);
  }

  calculateLayout(
    text: string,
    formats: MappedFormat[],
    offset: number,
    pageNumber: number
  ) {
    let layoutInfo = [];
    let currentX = 0;
    let currentY = 0;
    let lineHeight = 0;

    let currentPageNumber = this.pageNumber;
    const pageHeight = this.size.height; // Assuming you have a pageHeight property

    // console.info("calculateLayout", text);

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      // const format = this.getFormatAtIndex(i + offset, formats);
      const format = this.getFormatAtIndex(i, formats);

      if (!format.fontSize) {
        console.warn("no format on char?");
      }

      if (char === "\n" || format.isLineBreak) {
        // Move to the next line
        currentX = 0;
        currentY += lineHeight;
        lineHeight = 0;
        continue;
      }

      // const fontData = this.getFontData(format.fontFamily);
      const style = { ...defaultStyle, fontSize: format.fontSize };

      const { width, height } = getCharacterBoundingBox(
        this.fontData,
        char,
        style
      );
      const capHeight = getCapHeightPx(this.fontData, style.fontSize);

      // Check if we need to wrap to the next line
      if (currentX + width > this.size.width) {
        currentX = 0;
        currentY += lineHeight;
        lineHeight = 0;
      }

      // // Check again for new page after line break
      // console.info("check page ", currentY + capHeight, pageHeight);
      if (currentY + capHeight > pageHeight) {
        currentPageNumber++;
        currentY = 0;
        // console.warn("new page", currentPageNumber);
      }

      layoutInfo.push({
        char,
        x: currentX ? currentX + letterSpacing : 0,
        y: currentY,
        width,
        height,
        capHeight,
        format,
        page: currentPageNumber,
      });

      currentX += width + letterSpacing;
      lineHeight = Math.max(lineHeight, capHeight);
    }

    // console.info("layoutinfo", layoutInfo);

    return layoutInfo;
  }

  getFormatAtIndex(index: number, formats: MappedFormat[]): Style {
    // Find the last format that starts before or at the given index
    const applicableFormat = formats.reduce(
      (prev: MappedFormat, curr: MappedFormat) => {
        // const [start, end, style] = curr;
        const { interval, format } = curr;
        let start = interval.low;
        let end = interval.high;

        if (start <= index && start >= prev.interval.high && end > index) {
          return curr;
        }
        return prev;
      },
      { interval: { low: -1, high: -1 }, format: defaultStyle }
    );

    // return applicableFormat.format;
    // return applicableFormat.interval.low > 0
    //   ? applicableFormat.format
    //   : defaultStyle;
    // testing
    return defaultStyle;
  }
}

const getCharacterBoundingBox = (
  fontData: fontkit.Font,
  character: string,
  style: Style
) => {
  const glyph = fontData?.layout(character);
  const boundingBox = glyph?.bbox;
  const unitsPerEm = fontData?.unitsPerEm;
  const { xAdvance, xOffset } = glyph.positions[0];

  if (
    !boundingBox ||
    boundingBox.width == -Infinity ||
    boundingBox.height == -Infinity ||
    !unitsPerEm
  ) {
    return {
      width: 5,
      height: 5,
    };
  }

  return {
    width: (boundingBox.width / unitsPerEm) * style.fontSize,
    height: (boundingBox.height / unitsPerEm) * style.fontSize,
  };
};

const getCapHeightPx = (fontData: fontkit.Font, fontSize: number) => {
  return (
    ((fontData.capHeight + fontData.ascent + fontData.descent) /
      fontData.unitsPerEm) *
    fontSize
  );
};

export class MultiPageEditor {
  public pages: FormattedPage[];
  public size: DocumentSize;
  public visibleLines: number;
  public scrollPosition: number;
  public fontData: fontkit.Font;

  public rebalanceDebounce: any;
  public rebalanceDebounceStaggered: any;
  public avgPageLength = 2400; // TODO: better algorithm for determining exact overflow is needed

  constructor(
    size: DocumentSize,
    visibleLines: number,
    fontData: fontkit.Font
  ) {
    this.pages = [new FormattedPage(size, fontData)];
    this.size = size; // Height of a page in characters or pixels
    this.visibleLines = visibleLines;
    this.scrollPosition = 0;
    this.fontData = fontData;
  }

  // run on scroll?
  // TODO: account for newlines?
  renderVisible() {
    // const startIndex = this.scrollPosition * this.size.height;
    const startIndex = this.scrollPosition ? this.scrollPosition / 26 : 0;
    // const endIndex = Math.round(
    //   startIndex + this.visibleLines * this.size.height
    // );
    // const endIndex = Math.round(
    //   startIndex + this.visibleLines * 26 // replace with lineheight? would expect consistent lineheight?
    // );
    const endIndex = this.pages.length * 3000;

    const formattedText = this.getFormattedText(startIndex, endIndex);
    const layout = this.getLayoutInfo(startIndex, endIndex);

    console.info(
      "render visible: ",
      startIndex,
      endIndex,
      formattedText,
      layout
    );

    return this.combineTextAndLayout(
      formattedText,
      layout,
      startIndex,
      endIndex
    );
  }

  insert(
    globalIndex: number,
    text: string,
    format: Style,
    setMasterJson: any,
    initialize = false
  ) {
    clearTimeout(this.rebalanceDebounce);
    clearTimeout(this.rebalanceDebounceStaggered);

    let pageIndex = this.getPageIndexForGlobalIndex(globalIndex);
    let localIndex = this.getLocalIndex(globalIndex, pageIndex);

    // console.info("insert indexes: ", pageIndex, localIndex);

    this.pages[pageIndex].insert(localIndex, text, format);

    // this.rebalanceDebounce = setTimeout(() => {
    this.rebalancePages(pageIndex, initialize);
    const renderable = this.renderVisible();
    setMasterJson(renderable);
    // }, 20);

    this.rebalanceDebounceStaggered = setTimeout(() => {
      // update other page layouts in staggered fashion, first is done in rebalancePages()
      this.updatePageLayouts(pageIndex); // expensive operation
      const renderableAll = this.renderVisible();
      setMasterJson(renderableAll);
    }, 1000);
  }

  getLayoutInfo(start: number, end: number) {
    let result: LayoutNode[] = [];
    let currentIndex = start;
    let startPage = this.getPageIndexForGlobalIndex(start);
    let endPage = this.getPageIndexForGlobalIndex(end);

    // console.info("getLayoutInfo: ", startPage, endPage);

    // Optimization for single-page queries
    if (startPage === endPage) {
      const page = this.pages[startPage];
      const pageStartIndex = this.getLocalIndex(start, startPage);
      const pageEndIndex = this.getLocalIndex(end, startPage);
      const queryResult = page.layout.query(pageStartIndex, pageEndIndex);
      return queryResult;
    }

    for (let i = startPage; i <= endPage; i++) {
      const page = this.pages[i];
      const pageStartIndex = i === startPage ? this.getLocalIndex(start, i) : 0;
      const pageEndIndex =
        i === endPage ? this.getLocalIndex(end, i) : page.content.length;

      result = result.concat(page.layout.query(pageStartIndex, pageEndIndex));
      currentIndex += pageEndIndex - pageStartIndex;
    }

    return result;
  }

  combineTextAndLayout(
    formattedText: FormattedText[],
    layout: LayoutNode[],
    startIndex: number,
    endIndex: number
  ): RenderItem[] {
    let renderItems: RenderItem[] = [];
    let textIndex = 0;

    for (const layoutItem of layout) {
      const { start, end, layoutInfo } = layoutItem;

      if (!layoutInfo) {
        continue;
      }

      // Skip layout items that are completely before the virtualized range
      if (end < startIndex) {
        textIndex++;
        continue;
      }

      // Stop processing if we've gone past the virtualized range
      if (start > endIndex) {
        break;
      }

      // const virtualizedStart = Math.max(startIndex - start, 0);
      // const virtualizedEnd = Math.min(endIndex - start, layoutInfo.length);
      const virtualizedStart = startIndex;
      const virtualizedEnd = Math.min(endIndex, layoutInfo.length);

      for (let i = virtualizedStart; i < virtualizedEnd; i++) {
        const charLayout = layoutInfo[i];

        let format: Style | undefined | null;
        const textItem = formattedText[textIndex];
        format = textItem.format;

        if (!format) {
          format = defaultStyle;
        }

        // if (charLayout.x === -1 && charLayout.y -1) {
        //   console.info("no position", charLayout.char);
        //   continue;
        // }

        renderItems.push({
          char: charLayout.char,
          x: charLayout.x,
          y: charLayout.y,
          width: charLayout.width,
          height: charLayout.height,
          capHeight: charLayout.capHeight,
          format: format,
          page: charLayout.page,
        });
      }

      textIndex++;
    }

    return renderItems;
  }

  rebalancePages(startPageIndex: number, initialize = false) {
    const pageHeight = this.size.height;

    // TODO: may not account for large text pasted in (creating mutliple new pages)
    let totalPages = this.pages.length;
    if (initialize) {
      totalPages =
        Math.round(this.pages[0].content.length / this.avgPageLength) - 1; // 0-indexed
    }

    console.info("total pages", startPageIndex, this.pages.length, totalPages);

    for (let i = startPageIndex; i < totalPages; i++) {
      const currentPage = this.pages[i];

      if (typeof currentPage === "undefined") {
        break;
      }

      console.info("page", i);

      const nextPage =
        this.pages[i + 1] || new FormattedPage(this.size, this.fontData);

      currentPage.pageNumber = i; // Update page number
      nextPage.pageNumber = i + 1;

      while (currentPage.content.length > this.avgPageLength) {
        // const overflow = currentPage.content.length - pageHeight;
        // const overflow = Math.abs(
        //   this.avgPageLength - currentPage.content.length
        // );
        // const overflowText = currentPage.content.slice(-overflow).join("");
        // const overflowText = currentPage.content.substring(
        //   currentPage.content.length - overflow
        // );
        // console.info("overflow", overflow, currentPage.content.length);
        const overflowText = currentPage.content.substring(this.avgPageLength);
        const overflowFormatting = currentPage.formatting.search(
          // [this.size.height, Infinity],
          [this.avgPageLength, Infinity],
          (value, key) => ({
            interval: key,
            format: value,
          })
        ) as unknown as MappedFormat[];

        // currentPage.delete(pageHeight, currentPage.content.length);
        currentPage.delete(this.avgPageLength, currentPage.content.length);
        nextPage.insert(0, overflowText, overflowFormatting[0].format);
      }

      // if (nextPage.content.length > 0 && i + 1 >= this.pages.length) {
      if (nextPage.content.length > 0 && !this.pages[i + 1]) {
        this.pages.push(nextPage);
      }
      // TODO: add splice operation for existing page in this.pages

      // put in squential loop to prevent slowing this loop
      // currentPage.updateLayout(0, currentPage.content.length);
    }

    // update layouts in staggered manner
    this.pages[startPageIndex].updateLayout(
      0,
      this.pages[startPageIndex].content.length
    );
  }

  updatePageLayouts(startPageIndex: number) {
    for (let i = startPageIndex + 1; i < this.pages.length; i++) {
      this.pages[i].updateLayout(
        this.pages[i].content.length - this.avgPageLength,
        this.pages[i].content.length
      );
    }
  }

  getPageIndexForGlobalIndex(globalIndex: number) {
    let accumIndex = 0;
    for (let i = 0; i < this.pages.length; i++) {
      if (accumIndex + this.pages[i].content.length > globalIndex) {
        return i;
      }
      accumIndex += this.pages[i].content.length;
    }
    return this.pages.length - 1; // need page index, not number
    // return this.pages.length;
  }

  getLocalIndex(globalIndex: number, pageIndex: number) {
    let accumIndex = 0;
    for (let i = 0; i < pageIndex; i++) {
      accumIndex += this.pages[i].content.length;
    }
    return globalIndex - accumIndex;
  }

  getFormattedText(startIndex: number, endIndex: number) {
    let result: FormattedText[] = [];
    let currentIndex = startIndex;
    let startPage = this.getPageIndexForGlobalIndex(startIndex);
    let endPage = this.getPageIndexForGlobalIndex(endIndex);

    // console.info("getFormattedText", startPage, endPage);

    for (let i = startPage; i <= endPage; i++) {
      const page = this.pages[i];
      const pageStartIndex =
        i === startPage ? this.getLocalIndex(startIndex, i) : 0;
      const pageEndIndex =
        i === endPage ? this.getLocalIndex(endIndex, i) : page.content.length;

      result = result.concat(
        page.getFormattedText(pageStartIndex, pageEndIndex)
      );
      currentIndex += pageEndIndex - pageStartIndex;
    }

    return result;
  }
}

export const useMultiPageRTE = (
  initialMarkdown: string,
  mainTextSize: DocumentSize
) => {
  const [fontData, setFontData] = useState(null);
  const [masterJson, setMasterJson] = useState<RenderItem[]>([]);
  const [isSelectingText, setIsSelectingText] = useState(false);
  // const [selectedTextNodes, setSelectedTextNodes] = useState([]);
  const [firstSelectedNode, setFirstSelectedNode] = useState(null);
  const [lastSelectedNode, setLastSelectedNode] = useState(null);

  // use ref to get up-to-date values in event listener
  const [editorInstance, _setEditorInstance] = useState<MultiPageEditor | null>(
    null
  );
  const editorInstanceRef = useRef(editorInstance);
  const setEditorInstance = (editor: MultiPageEditor) => {
    editorInstanceRef.current = editor;
    _setEditorInstance(editor);
  };

  const [editorActive, _setEditorActive] = useState(false);
  const editorActiveRef = useRef(editorActive);
  const setEditorActive = (active: boolean) => {
    editorActiveRef.current = active;
    _setEditorActive(active);
  };

  useEffect(() => {
    loadFont(setFontData);
  }, []);

  useEffect(() => {
    if (fontData) {
      console.info(
        "fontdata loaded, intializing editor",
        initialMarkdown.length
      );

      const multiPageEditor = new MultiPageEditor(mainTextSize, 70, fontData);
      multiPageEditor.insert(
        0,
        initialMarkdown,
        defaultStyle,
        setMasterJson,
        true
      );

      // const renderable = multiPageEditor.renderVisible();

      // console.info("renderable: ", renderable);

      setEditorInstance(multiPageEditor);
      // setMasterJson(renderable);
    }
  }, [fontData]);

  const handleKeydown = (e: KeyboardEvent) => {
    e.preventDefault();

    if (editorActiveRef.current) {
      // const characterId = uuidv4();

      if (!window.__canvasRTEInsertCharacterIndex) {
        console.info("trigger key with no cursor?");
        return;
      }

      switch (e.key) {
        case "Enter":
          {
            const character = "\n";

            editorInstanceRef.current?.insert(
              window.__canvasRTEInsertCharacterIndex,
              character,
              defaultStyle,
              setMasterJson,
              false
            );

            window.__canvasRTEInsertCharacterIndex =
              window.__canvasRTEInsertCharacterIndex + 1;
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
            const type = "tab";
            const character = "    ";

            editorInstanceRef.current?.insert(
              window.__canvasRTEInsertCharacterIndex,
              character,
              defaultStyle,
              setMasterJson,
              false
            );

            window.__canvasRTEInsertCharacterIndex =
              window.__canvasRTEInsertCharacterIndex + 1;
          }
          break;
        default:
          {
            // any other character
            const type = "character";
            const character = e.key;

            // console.info("char", character);

            if (!editorActiveRef.current) {
              console.error("No editor");
            }

            editorInstanceRef.current?.insert(
              window.__canvasRTEInsertCharacterIndex,
              character,
              defaultStyle,
              setMasterJson,
              false
            );

            window.__canvasRTEInsertCharacterIndex =
              window.__canvasRTEInsertCharacterIndex + 1;
          }
          break;
      }

      // const renderable = editorInstanceRef.current?.renderVisible();

      // if (renderable) {
      //   setMasterJson(renderable);
      // }
    }
  };

  useEffect(() => {
    if (fontData) {
      console.info("welcome to multi-page rte!");

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
  };

  // set the insert index to this character
  const handleTextClick = (e: KonvaEventObject<MouseEvent>) => {
    console.info("text click");

    const target = e.target;
    const characterId = target.id();
    const characterIndex = parseInt(characterId.split("-")[2]);

    console.info("characterId", characterId, characterIndex);

    const character = masterJson[characterIndex];

    window.__canvasRTEInsertCharacterIndex = characterIndex;

    setEditorActive(true);
  };

  const handleTextMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    console.info("text down", e);
    setIsSelectingText(true);

    const target = e.target;
    const characterId = target.id();

    setFirstSelectedNode(characterId);
    setLastSelectedNode(null);
  };
  const handleTextMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (isSelectingText && e.evt.buttons) {
      console.info("selecting text", e);

      const target = e.target;
      const characterId = target.id();

      // setSelectedTextNodes((nodes) => [characterId, ...nodes]);
      setLastSelectedNode(characterId);
    }
  };
  const handleTextMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    console.info("text up", e);
    setIsSelectingText(false);
  };

  const jsonByPage = useMemo(() => {
    const pages = masterJson.reduce(
      (acc, char) => {
        // if (!char.page) return acc;
        if (!acc[char.page]) {
          acc[char.page] = [];
        }

        acc[char.page].push(char);

        return acc;
      },
      {} as { [key: number]: RenderItem[] }
    );

    return pages;
  }, [masterJson]);

  return {
    masterJson,
    jsonByPage,
    firstSelectedNode,
    lastSelectedNode,
    handleCanvasClick,
    handleTextClick,
    handleTextMouseDown,
    handleTextMouseMove,
    handleTextMouseUp,
  };
};
