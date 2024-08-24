// import RopeSequence from "rope-sequence";
import { ComponentRope } from "../helpers/ComponentRope";
import IntervalTree, {
  Interval,
  SearchOutput,
} from "@flatten-js/interval-tree";
import * as fontkit from "fontkit";

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

interface RenderItem {
  char: string;
  x: number;
  y: number;
  width: number;
  height: number;
  capHeight: number;
  format: Style;
}

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
export const defaultStyle: Style = {
  color: "black",
  fontSize: 16,
  fontWeight: "normal",
  fontFamily: "Inter",
  italic: false,
  underline: false,
};

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
    console.info("LayoutNode update: ", start, end, layoutInfo);

    // best here?
    this.layoutInfo = layoutInfo;

    // If the update range is completely outside this node's range, do nothing
    if (end <= this.start || start >= this.end) {
      return;
    }

    // If this node is completely contained in the update range
    if (start <= this.start && end >= this.end) {
      return;
    }

    console.info("working on update...");

    // Recurse on children
    if (this.left) {
      this.left.update(start, end, layoutInfo);
    }
    if (this.right) {
      this.right.update(start, end, layoutInfo);
    }

    // If this node is a leaf and partially overlaps, split it
    if (!this.left && !this.right) {
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

    console.info("LayoutNode query: ", result);

    return result;
  }

  split() {
    const mid = Math.floor((this.start + this.end) / 2);
    this.left = new LayoutNode(this.start, mid);
    this.right = new LayoutNode(mid, this.end);
    if (this.layoutInfo) {
      console.info("split set layoutInfo", this.layoutInfo);
      this.left.layoutInfo = this.layoutInfo;
      this.right.layoutInfo = this.layoutInfo;
    }
  }
}

class FormattedPage {
  //   public content: RopeSequence<any>;
  public content: ComponentRope;
  public formatting: IntervalTree;
  public layout: LayoutTree;
  public size: DocumentSize;

  public fontData: fontkit.Font;

  constructor(size: DocumentSize, fontData: fontkit.Font) {
    this.content = new ComponentRope("");
    this.formatting = new IntervalTree();
    this.layout = new LayoutTree();
    this.size = size;
    this.fontData = fontData;
  }

  insert(index: number, text: string, format: Style) {
    this.content.insert(index, text);
    if (format) {
      // this.formatting.insert([index, index + text.length], format);
      this.formatting.insert(new Interval(index, index + text.length), format);
    }
    this.adjustFormatting(index, text.length);

    console.info("inserted to page: ", this.content, this.formatting);
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

    console.info("formats", formats);

    for (let { interval, format } of formats) {
      // let start = interval[0];
      // let end = interval[1];
      let start = interval.low;
      let end = interval.high;

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
    const layoutInfo = this.calculateLayout(text, formats, start);
    console.info("updateLayout: ", layoutInfo);
    this.layout.update(start, end, layoutInfo);
  }

  calculateLayout(
    text: string,
    formats: MappedFormat[],
    offset: number
  ): RenderItem[] {
    let layoutInfo: RenderItem[] = [];
    let currentX = 0;
    let currentY = 0;
    let lineHeight = 0;

    console.info("calculate layout: ", text, formats, offset);

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const format = this.getFormatAtIndex(i, formats);
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

    console.info("layout info: ", layoutInfo);

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

        if (start <= index && start >= prev.interval.low && end > index) {
          return curr;
        }
        return prev;
      },
      { interval: { low: -1, high: -1 }, format: defaultStyle }
    );

    return applicableFormat.format;
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
  renderVisible() {
    const startIndex = this.scrollPosition * this.size.height;
    const endIndex = Math.round(
      startIndex + this.visibleLines * this.size.height
    );

    // testing
    this.pages[0].updateLayout(startIndex, endIndex);

    const formattedText = this.getFormattedText(startIndex, endIndex);
    const layout = this.getLayoutInfo(startIndex, endIndex);

    console.info(
      "render visible: ",
      startIndex,
      endIndex,
      formattedText,
      layout
    );

    // set to React via supplied state setter?
    return this.combineTextAndLayout(formattedText, layout);
  }

  insert(globalIndex: number, text: string, format: Style) {
    let pageIndex = this.getPageIndexForGlobalIndex(globalIndex);
    let localIndex = this.getLocalIndex(globalIndex, pageIndex);

    console.info("insert indexes: ", pageIndex, localIndex);

    this.pages[pageIndex].insert(localIndex, text, format);
    this.rebalancePages(pageIndex);
  }

  getLayoutInfo(start: number, end: number) {
    let result: LayoutNode[] = [];
    let currentIndex = start;
    let startPage = this.getPageIndexForGlobalIndex(start);
    let endPage = this.getPageIndexForGlobalIndex(end);

    console.info("getLayoutInfo: ", startPage, endPage);

    // Optimization for single-page queries
    if (startPage === endPage) {
      const page = this.pages[startPage];
      const pageStartIndex = this.getLocalIndex(start, startPage);
      const pageEndIndex = this.getLocalIndex(end, startPage);
      return page.layout.query(pageStartIndex, pageEndIndex);
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
    layout: LayoutNode[]
  ): RenderItem[] {
    let renderItems: RenderItem[] = [];
    let textIndex = 0;

    for (const layoutItem of layout) {
      const { start, end, layoutInfo } = layoutItem;

      if (!layoutInfo) {
        return [];
      }

      for (let i = 0; i < layoutInfo.length; i++) {
        const charLayout = layoutInfo[i];
        let format: Style | undefined | null;

        // Find the corresponding formatted text
        while (textIndex < formattedText.length) {
          const textItem = formattedText[textIndex];
          if (start + i < textItem.text.length) {
            format = textItem.format;
            break;
          }
          textIndex++;
        }

        if (!format) {
          console.warn(`No format found for character at index ${start + i}`);
          continue;
        }

        renderItems.push({
          char: formattedText[textIndex].text[start + i - textIndex],
          x: charLayout.x,
          y: charLayout.y,
          width: charLayout.width,
          height: charLayout.height,
          capHeight: charLayout.capHeight,
          format: format,
        });
      }
    }

    return renderItems;
  }

  rebalancePages(startPageIndex: number) {
    for (let i = startPageIndex; i < this.pages.length; i++) {
      const currentPage = this.pages[i];
      const nextPage =
        this.pages[i + 1] || new FormattedPage(this.size, this.fontData);

      while (currentPage.content.length > this.size.height) {
        const overflow = currentPage.content.length - this.size.height;
        // const overflowText = currentPage.content.slice(-overflow).join("");
        const overflowText = currentPage.content.substring(
          currentPage.content.length - overflow
        );
        const overflowFormatting = currentPage.formatting.search(
          [this.size.height, Infinity],
          (value, key) => ({
            interval: key,
            format: value,
          })
        );

        currentPage.delete(this.size.height, currentPage.content.length);
        nextPage.insert(0, overflowText, overflowFormatting[1]);
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
