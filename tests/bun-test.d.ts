declare module 'bun:test' {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
  export function expect<T>(value: T): {
    toBe(expected: T): void;
    toBeTrue(): void;
    toBeFalse(): void;
    toContain(expected: any): void;
  };
  export function mock<T extends (...args: any[]) => any>(fn: T): T;
}
