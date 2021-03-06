## 0.2.1

- Adding getter and setter for all classes
- Adding option types for all classes

## 0.2.0

- Adding update callback for animation
- Adding frame element (w/ scale independent label)
- Fixing click and double click events
- Updating examples
- Adding init method
- Fix for active element
- Adding edit text
- Adding canvas context:

```js
// Old
draw(ctx: CanvasRenderingContext2D, size: Size): void {
// New
draw(context: CanvasContext): void {
    const { ctx, size } = context;
```

## 0.1.1

- Adding tests

## 0.1.0

- Adding padding and margin to box
- Adding image filter
- Adding zoomIn, zoomOut, reset
- Adding padding to box
- New resize, move and rect getters to widget

## 0.0.9

- Fixing mobile double click

## 0.0.8

- Adding Shapes
    - Star
    - Rect
    - Ellipse
    - Polygon
    - Line
    - Image
        - Smoothing options
- Adding Group
    - Stack
- Updating Example
- Adding Box

## 0.0.7

- Removing all dependencies
- Updating example
- Multi selection (with shift)
- Move multi selection if hovered
- Updating CSS Custom Properties from `--canvas-controller` to `--canvas`
- Selected outlined outer rect

## 0.0.6

- Fixed mobile touch scale gesture
- Adding children with relative rect
- Adding double click to click inner child
- Adding create canvas if not defined
- Outer rect outline

## 0.0.5

- Adding override for drawBackground
- Adding override for drawOutline
- Adding control key for mobile
- Removing log statements

## 0.0.4

- Fixing control key event

## 0.0.3

- Fixing install

## 0.0.2

- Ignoring files

## 0.0.1

- Adding package
