export function color(elem, value) {
    if (value.startsWith("--")) {
        var style = getComputedStyle(elem);
        return style.getPropertyValue(value);
    }
    return value;
}
//# sourceMappingURL=utils.js.map