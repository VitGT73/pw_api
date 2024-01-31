// global.d.ts

export {};

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeOneOfValues(array: any[]): R;
      toBeValidDate(): R;
      toBeOneOfTypes(array: string[]);
      toBeString(): R;
      toBeNumber(): R;
      toBeBoolean(): R;
      toBeObject(): R;
    }
  }
}
