export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonArray
  | JsonObject;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}
