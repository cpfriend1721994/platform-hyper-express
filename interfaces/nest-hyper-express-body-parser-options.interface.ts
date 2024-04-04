/**
 * Type alias to keep compatibility with @types/body-parser
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/body-parser/index.d.ts
 * @publicApi
 */
export interface NestHyperExpressBodyParserOptions {
  /** When set to true, then deflated (compressed) bodies will be inflated; when false, deflated bodies are rejected. Defaults to true. */
  inflate?: boolean | undefined;

  /**
   * Controls the maximum request body size. If this is a number,
   * then the value specifies the number of bytes; if it is a string,
   * the value is passed to the bytes library for parsing. Defaults to '100kb'.
   */
  limit?: number | string | undefined;

  /**
   * The type option is used to determine what media type the middleware will parse
   */
  type?: string | string[] | undefined;

  // Catch-all for body-parser type specific options
  [key: string]: unknown;
}
