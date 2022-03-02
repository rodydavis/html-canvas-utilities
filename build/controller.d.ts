import { CanvasTransformer, CanvasTransformerOptions } from "./transformer";
export declare class CanvasController<T extends CanvasWidget = CanvasWidget> extends CanvasTransformer<T> {
    readonly canvas: HTMLCanvasElement;
    readonly options: CanvasTransformerOptions;
    constructor(canvas: HTMLCanvasElement, options?: CanvasTransformerOptions);
    children: T[];
    selection: T[];
    hovered: T[];
    canSelect: boolean;
    canMove: boolean;
    canDelete: boolean;
    spacePressed: boolean;
    middleClick: boolean;
    drawBackground(): void;
    resize(): void;
    paint(): void;
    drawContent(ctx: CanvasRenderingContext2D): void;
    drawOutline(ctx: CanvasRenderingContext2D, rect: DOMRect, strokeColor: string): void;
    select(point: DOMPoint, max?: number): T[];
    onMouseDown(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onTouchStart(e: TouchEvent): void;
    onTouchMove(e: TouchEvent): void;
    move(delta: DOMPoint): void;
    onKeyDownEvent(e: KeyboardEvent): void;
    onKeyUpEvent(e: KeyboardEvent): void;
    updateCursor(): void;
    updateSelection(selection: T[]): void;
    clearSelection(): void;
    removeSelection(): void;
    addChild(widget: T): void;
}
export interface CanvasWidget {
    rect: DOMRect;
    draw(ctx: CanvasRenderingContext2D): void;
}
