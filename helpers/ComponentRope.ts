// originally from: https://github.com/component/rope/blob/master/index.js

/**
 * Creates a rope data structure
 *
 * @param str - String to populate the rope.
 * @api public
 */
export class ComponentRope {
  private _value?: string;
  private _left?: ComponentRope;
  private _right?: ComponentRope;
  public length: number;

  // Static properties
  static SPLIT_LENGTH = 1000;
  static JOIN_LENGTH = 500;
  static REBALANCE_RATIO = 1.2;

  constructor(str: string) {
    this._value = str;
    this.length = str.length;
    this.adjust();
  }

  /**
   * Adjusts the tree structure, so that very long nodes are split
   * and short ones are joined
   *
   * @api private
   */
  private adjust(): void {
    if (typeof this._value !== "undefined") {
      if (this.length > ComponentRope.SPLIT_LENGTH) {
        const divide = Math.floor(this.length / 2);
        this._left = new ComponentRope(this._value.substring(0, divide));
        this._right = new ComponentRope(this._value.substring(divide));
        delete this._value;
      }
    } else {
      if (this.length < ComponentRope.JOIN_LENGTH) {
        this._value = this._left!.toString() + this._right!.toString();
        delete this._left;
        delete this._right;
      }
    }
  }

  /**
   * Converts the rope to a JavaScript String.
   *
   * @api public
   */
  public toString(): string {
    if (typeof this._value !== "undefined") {
      return this._value;
    } else {
      return this._left!.toString() + this._right!.toString();
    }
  }

  /**
   * Removes text from the rope between the `start` and `end` positions.
   * The character at `start` gets removed, but the character at `end` is
   * not removed.
   *
   * @param start - Initial position (inclusive)
   * @param end - Final position (not-inclusive)
   * @api public
   */
  public remove(start: number, end: number): void {
    if (start < 0 || start > this.length)
      throw new RangeError("Start is not within rope bounds.");
    if (end < 0 || end > this.length)
      throw new RangeError("End is not within rope bounds.");
    if (start > end) throw new RangeError("Start is greater than end.");
    if (typeof this._value !== "undefined") {
      this._value =
        this._value.substring(0, start) + this._value.substring(end);
      this.length = this._value.length;
    } else {
      const leftLength = this._left!.length;
      const leftStart = Math.min(start, leftLength);
      const leftEnd = Math.min(end, leftLength);
      const rightLength = this._right!.length;
      const rightStart = Math.max(0, Math.min(start - leftLength, rightLength));
      const rightEnd = Math.max(0, Math.min(end - leftLength, rightLength));
      if (leftStart < leftLength) {
        this._left!.remove(leftStart, leftEnd);
      }
      if (rightEnd > 0) {
        this._right!.remove(rightStart, rightEnd);
      }
      this.length = this._left!.length + this._right!.length;
    }
    this.adjust();
  }

  /**
   * Inserts text into the rope on the specified position.
   *
   * @param position - Where to insert the text
   * @param value - Text to be inserted on the rope
   * @api public
   */
  public insert(position: number, value: string): void {
    if (typeof value !== "string") {
      value = value.toString();
    }
    if (position < 0 || position > this.length)
      throw new RangeError("position is not within rope bounds.");
    if (typeof this._value !== "undefined") {
      this._value =
        this._value.substring(0, position) +
        value.toString() +
        this._value.substring(position);
      this.length = this._value.length;
    } else {
      const leftLength = this._left!.length;
      if (position < leftLength) {
        this._left!.insert(position, value);
        this.length = this._left!.length + this._right!.length;
      } else {
        this._right!.insert(position - leftLength, value);
      }
    }
    this.adjust();
  }

  /**
   * Rebuilds the entire rope structure, producing a balanced tree.
   *
   * @api public
   */
  public rebuild(): void {
    if (typeof this._value === "undefined") {
      this._value = this._left!.toString() + this._right!.toString();
      delete this._left;
      delete this._right;
      this.adjust();
    }
  }

  /**
   * Finds unbalanced nodes in the tree and rebuilds them.
   *
   * @api public
   */
  public rebalance(): void {
    if (typeof this._value === "undefined") {
      if (
        this._left!.length / this._right!.length >
          ComponentRope.REBALANCE_RATIO ||
        this._right!.length / this._left!.length > ComponentRope.REBALANCE_RATIO
      ) {
        this.rebuild();
      } else {
        this._left!.rebalance();
        this._right!.rebalance();
      }
    }
  }

  /**
   * Returns text from the rope between the `start` and `end` positions.
   * The character at `start` gets returned, but the character at `end` is
   * not returned.
   *
   * @param start - Initial position (inclusive)
   * @param end - Final position (not-inclusive)
   * @api public
   */
  public substring(start: number, end?: number): string {
    if (typeof end === "undefined") {
      end = this.length;
    }
    if (start < 0 || isNaN(start)) {
      start = 0;
    } else if (start > this.length) {
      start = this.length;
    }
    if (end < 0 || isNaN(end)) {
      end = 0;
    } else if (end > this.length) {
      end = this.length;
    }
    if (typeof this._value !== "undefined") {
      return this._value.substring(start, end);
    } else {
      const leftLength = this._left!.length;
      const leftStart = Math.min(start, leftLength);
      const leftEnd = Math.min(end, leftLength);
      const rightLength = this._right!.length;
      const rightStart = Math.max(0, Math.min(start - leftLength, rightLength));
      const rightEnd = Math.max(0, Math.min(end - leftLength, rightLength));

      if (leftStart !== leftEnd) {
        if (rightStart !== rightEnd) {
          return (
            this._left!.substring(leftStart, leftEnd) +
            this._right!.substring(rightStart, rightEnd)
          );
        } else {
          return this._left!.substring(leftStart, leftEnd);
        }
      } else {
        if (rightStart !== rightEnd) {
          return this._right!.substring(rightStart, rightEnd);
        } else {
          return "";
        }
      }
    }
  }

  /**
   * Returns a string of `length` characters from the rope, starting
   * at the `start` position.
   *
   * @param start - Initial position (inclusive)
   * @param length - Size of the string to return
   * @api public
   */
  public substr(start: number, length?: number): string {
    let end: number;
    if (start < 0) {
      start = this.length + start;
      if (start < 0) {
        start = 0;
      }
    }
    if (typeof length === "undefined") {
      end = this.length;
    } else {
      if (length < 0) {
        length = 0;
      }
      end = start + length;
    }
    return this.substring(start, end);
  }

  /**
   * Returns the character at `position`
   *
   * @param position
   * @api public
   */
  public charAt(position: number): string {
    return this.substring(position, position + 1);
  }

  /**
   * Returns the code of the character at `position`
   *
   * @param position
   * @api public
   */
  public charCodeAt(position: number): number {
    return this.substring(position, position + 1).charCodeAt(0);
  }
}
