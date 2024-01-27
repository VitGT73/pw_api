import { mergeExpects } from "@playwright/test";
import { expect as toBeOneOfValuesExpect } from "@fixtures/toBeOneOfValues";
import { expect as toBeValidDate } from "@fixtures/toBeValidDate";
import { expect as typesExpects } from "@fixtures/typesExpects";

// declare global {
//   interface expect {
//     toBeValidDate(received: any): this;
//   }
// }

export { test } from "@playwright/test";

export const expect = mergeExpects(toBeOneOfValuesExpect, toBeValidDate, typesExpects);
