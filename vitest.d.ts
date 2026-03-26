import type { Assertion, AsymmetricMatchersContaining } from 'vitest';

interface CustomMatchers {
  toBeInTheDocument(): Assertion;
  toHaveAttribute(attr: string, value?: any): Assertion;
  toHaveClass(...classes: string[]): Assertion;
  toBeVisible(): Assertion;
  toBeDisabled(): Assertion;
  toBeChecked(): Assertion;
  toHaveFocus(): Assertion;
  toHaveTextContent(text: string | RegExp): Assertion;
  toHaveStyle(css: Record<string, any>): Assertion;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
