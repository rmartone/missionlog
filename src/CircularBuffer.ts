/**
 * A fixed-size circular buffer implementation for cursor points
 * This provides O(1) operations for adding points without array shifts
 */
export class CircularBuffer<T> {
  private _buffer: Array<T | null>;
  private _size: number;
  private _head: number = 0;
  private _tail: number = 0;
  private _count: number = 0;

  constructor(capacity: number) {
    this._size = capacity;
    this._buffer = new Array<T | null>(capacity).fill(null);
  }

  /**
   * Adds an item to the buffer, overwriting the oldest item if full
   */
  public push(item: T): void {
    this._buffer[this._head] = item;
    this._head = (this._head + 1) % this._size;

    if (this._count === this._size) {
      // Buffer is full, move tail pointer
      this._tail = (this._tail + 1) % this._size;
    } else {
      // Buffer is not full yet
      this._count++;
    }
  }

  /**
   * Gets an item at a specific index
   * @param index The index to get (0 is the oldest item, count-1 is the newest)
   */
  public get(index: number): T | null {
    if (index < 0 || index >= this._count) {
      return null;
    }

    const bufferIndex = (this._tail + index) % this._size;
    return this._buffer[bufferIndex] ?? null;
  }

  /**
   * Gets the most recent item added to the buffer
   */
  public getLatest(): T | null {
    if (this._count === 0) return null;

    const latestIndex = (this._head - 1 + this._size) % this._size;
    return this._buffer[latestIndex] ?? null;
  }

  /**
   * Gets the second most recent item added to the buffer
   */
  public getPrevious(): T | null {
    if (this._count < 2) return null;

    const previousIndex = (this._head - 2 + this._size) % this._size;
    return this._buffer[previousIndex] ?? null;
  }

  /**
   * Gets all items in the buffer as an array
   */
  public toArray(): T[] {
    const result: T[] = [];

    for (let i = 0; i < this._count; i++) {
      const item = this.get(i);
      if (item !== null) {
        result.push(item);
      }
    }

    return result;
  }

  /**
   * Clears the buffer
   */
  public clear(): void {
    this._buffer.fill(null);
    this._head = 0;
    this._tail = 0;
    this._count = 0;
  }

  /**
   * Gets the number of items in the buffer
   */
  public get count(): number {
    return this._count;
  }

  /**
   * Gets the capacity of the buffer
   */
  public get capacity(): number {
    return this._size;
  }
}
