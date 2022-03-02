"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.color = void 0;
function color(elem, value) {
    if (value.startsWith("--")) {
        var style = getComputedStyle(elem);
        return style.getPropertyValue(value);
    }
    return value;
}
exports.color = color;
//# sourceMappingURL=utils.js.map