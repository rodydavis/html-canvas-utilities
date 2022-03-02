export function color(elem: HTMLElement, value: string) {
  if (value.startsWith("--")) {
    const style = getComputedStyle(elem);
    return style.getPropertyValue(value);
  }
  return value;
}
