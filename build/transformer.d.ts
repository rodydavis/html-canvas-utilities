import { Listenable } from "./listenable";
export interface CanvasTransformerOptions {
    scale: number;
    offset: DOMPoint;
}
export declare const defaultOptions: CanvasTransformerOptions;
export declare class CanvasTransformer<T> extends Listenable<T> {
    readonly canvas: HTMLCanvasElement;
    readonly options: CanvasTransformerOptions;
    constructor(canvas: HTMLCanvasElement, options?: CanvasTransformerOptions);
    gestureEvent: boolean;
    touches?: TouchList;
    mouse: DOMPoint;
    mouseDown: boolean;
    private transform;
    get matrix(): DOMMatrix;
    set matrix(matrix: DOMMatrix);
    shouldNotify: boolean;
    notify(): void;
    /** Canvas Context */
    readonly ctx: CanvasRenderingContext2D;
    minScale: number;
    maxScale: number;
    /**
     * Transforms the mouse coordinates to the local coordinates of the canvas
     *
     * @param point X and Y coordinates of the vector
     */
    localPoint(point: DOMPoint): DOMPoint;
    /**
     * Apply a new transform to the canvas
     *
     * @param ctx Canvas Rendering Context
     */
    applyTransform(ctx: CanvasRenderingContext2D): void;
    /**
     * Scale the canvas by a factor and origin in the viewport
     *
     * @param delta Scale delta
     * @param origin Origin to scale at
     */
    scale(scale: number, origin?: DOMPoint): void;
    /**
     * Pan the canvas in a given direction
     *
     * @param delta X and Y coordinates of the vector
     */
    pan(delta: DOMPoint): void;
    get info(): {
        scale: number;
        offset: DOMPoint;
        rotation: number;
        mouse: DOMPoint;
        mouseDown: boolean;
    };
    private onWheelEvent;
    onMouseDown(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onTouchStart(e: TouchEvent): void;
    onTouchMove(e: TouchEvent): void;
    onTouchEnd(e: TouchEvent): void;
    onKeyDownEvent(e: KeyboardEvent): void;
    onKeyUpEvent(e: KeyboardEvent): void;
    preventDefault(e: Event): void;
}
