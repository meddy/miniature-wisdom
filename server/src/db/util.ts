export function buildParams(values: any[]): string {
  return new Array<string>(values.length).fill("?").join(", ");
}
