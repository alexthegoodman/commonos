// import RopeSequence from "rope-sequence";
import { ComponentRope } from "../helpers/ComponentRope";
import IntervalTree, {
  Interval,
  SearchOutput,
} from "@flatten-js/interval-tree";
import * as fontkit from "fontkit";

interface LayoutInfo {}

export type Style = {
  color: string;
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
  italic: boolean;
  underline: boolean;
};

export type DocumentSize = {
  width: number;
  height: number;
};

const letterSpacing = 1;
const defaultStyle: Style = {
  color: "black",
  fontSize: 16,
  fontWeight: "normal",
  fontFamily: "Inter",
  italic: false,
  underline: false,
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

class LayoutTree {
  public root: LayoutNode;

  constructor() {
    this.root = new LayoutNode(0, Infinity);
  }

  update(start: number, end: number, layoutInfo: LayoutInfo) {
    this.root.update(start, end, layoutInfo);
  }

  query(start: number, end: number) {
    return this.root.query(start, end);
  }
}

class LayoutNode {
  public start: number;
  public end: number;
  public left: number | null;
  public right: number | null;
  public layoutInfo: LayoutInfo | null;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
    this.left = null;
    this.right = null;
    this.layoutInfo = null;
  }

  update(start: number, end: number, layoutInfo: LayoutInfo) {
    // Implementation to update the tree
  }

  query(start: number, end: number) {
    // Implementation to query the tree
  }
}

class FormattedPage {
  //   public content: RopeSequence<any>;
  public content: ComponentRope;
  public formatting: IntervalTree;
  public layout: LayoutTree;
  public size: DocumentSize;

  constructor(size: DocumentSize) {
    this.content = new ComponentRope("");
    this.formatting = new IntervalTree();
    this.layout = new LayoutTree();
    this.size = size;
  }

  insert(index: number, text: string, format: Style) {
    this.content.insert(index, text);
    if (format) {
      this.formatting.insert([index, index + text.length], format);
    }
    this.adjustFormatting(index, text.length);
  }

  delete(start: number, end: number) {
    const deleteLength = end - start;
    this.content.remove(start, deleteLength);
    this.formatting.remove([start, end]);
    this.adjustFormatting(start, -deleteLength);
  }

  adjustFormatting(index: number, length: number) {
    // this.formatting.forEach([index, Infinity], (interval: Interval) => {
    // TODO: optimize
    this.formatting.forEach((interval: Interval) => {
      if (interval[0] >= index) {
        this.formatting.remove(interval);
        this.formatting.insert([
          interval[0] + length,
          interval[1] + length,
          //   interval[2],
        ]);
      } else if (interval[1] > index) {
        this.formatting.remove(interval);
        this.formatting.insert([
          interval[0],
          interval[1] + length,
          //   interval[2],
        ]);
      }
    });
  }

  getFormattedText(start: number, end: number) {
    const text = this.content.substring(start, end);
    const formats = this.formatting.search([start, end]);
    return this.mergeTextAndFormatting(text, formats, start);
  }

  mergeTextAndFormatting(
    text: string,
    formats: SearchOutput<any>,
    offset: number
  ) {
    let result = [];
    let currentIndex = 0;

    formats.sort((a, b) => a[0] - b[0]);

    for (let [start, end, format] of formats) {
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
    const formats = this.formatting.search([start, end]);
    const layoutInfo = this.calculateLayout(text, formats, start);
    this.layout.update(start, end, layoutInfo);
  }

  calculateLayout(text: string, formats: any, offset: number) {
    let layoutInfo = [];
    let currentX = 0;
    let currentY = 0;
    let lineHeight = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const format = this.getFormatAtIndex(i, formats);
      const fontData = this.getFontData(format.fontFamily);
      const style = { ...defaultStyle, fontSize: format.fontSize };

      const { width, height } = getCharacterBoundingBox(fontData, char, style);
      const capHeight = getCapHeightPx(style.fontSize);

      // Check if we need to wrap to the next line
      if (currentX + width > this.size.width) {
        currentX = 0;
        currentY += lineHeight;
        lineHeight = 0;
      }

      layoutInfo.push({
        char,
        x: currentX,
        y: currentY,
        width,
        height,
        capHeight,
        format,
      });

      currentX += width;
      lineHeight = Math.max(lineHeight, capHeight);
    }

    return layoutInfo;
  }

  getFormatAtIndex(index: number, formats) {
    // Find the applicable format for the given index
  }

  getFontData(fontFamily) {
    // Retrieve or load font data for the given font family
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

class MultiPageEditor {
  public pages: FormattedPage[];
  public size: DocumentSize;
  public visibleLines: any;
  public scrollPosition: number;

  constructor(size: DocumentSize, visibleLines: any) {
    this.pages = [new FormattedPage(size)];
    this.size = size; // Height of a page in characters or pixels
    this.visibleLines = visibleLines;
    this.scrollPosition = 0;
  }

  renderVisible() {
    const startIndex = this.scrollPosition * this.size.height;
    const endIndex = startIndex + this.visibleLines * this.size.height;
    const formattedText = this.getFormattedText(startIndex, endIndex);
    const layout = this.getLayoutInfo(startIndex, endIndex);

    return this.combineTextAndLayout(formattedText, layout);
  }

  getLayoutInfo(start: number, end: number) {
    let result = [];
    let currentIndex = start;
    let startPage = this.getPageIndexForGlobalIndex(start);
    let endPage = this.getPageIndexForGlobalIndex(end);

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

  combineTextAndLayout(formattedText, layout) {
    // Combine formatted text with layout information for rendering
  }

  insert(globalIndex: number, text: string, format: Style) {
    let pageIndex = this.getPageIndexForGlobalIndex(globalIndex);
    let localIndex = this.getLocalIndex(globalIndex, pageIndex);

    this.pages[pageIndex].insert(localIndex, text, format);
    this.rebalancePages(pageIndex);
  }

  rebalancePages(startPageIndex: number) {
    for (let i = startPageIndex; i < this.pages.length; i++) {
      const currentPage = this.pages[i];
      const nextPage = this.pages[i + 1] || new FormattedPage(this.size);

      while (currentPage.content.length > this.size.height) {
        const overflow = currentPage.content.length - this.size.height;
        const overflowText = currentPage.content.slice(-overflow).join("");
        const overflowFormatting = currentPage.formatting.search([
          this.size.height,
          Infinity,
        ]);

        currentPage.delete(this.size.height, currentPage.content.length);
        nextPage.insert(0, overflowText, overflowFormatting);
      }

      if (nextPage.content.length > 0 && i + 1 >= this.pages.length) {
        this.pages.push(nextPage);
      }
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
    return this.pages.length - 1;
  }

  getLocalIndex(globalIndex: number, pageIndex: number) {
    let accumIndex = 0;
    for (let i = 0; i < pageIndex; i++) {
      accumIndex += this.pages[i].content.length;
    }
    return globalIndex - accumIndex;
  }

  getFormattedText(startIndex: number, endIndex: number) {
    let result = [];
    let currentIndex = startIndex;
    let startPage = this.getPageIndexForGlobalIndex(startIndex);
    let endPage = this.getPageIndexForGlobalIndex(endIndex);

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
  return {};
};
