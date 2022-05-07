export function cssValue(elem: HTMLElement, value: string) {
  if (value.startsWith("--")) {
    const style = getComputedStyle(elem);
    return style.getPropertyValue(value) || "";
  }
  return value || "";
}

export function pxSize(value?: string): number | undefined {
  if (value) {
    if (value.endsWith("px")) return Number(value.replace("px", ""));
    return Number(value);
  }
  return undefined;
}
