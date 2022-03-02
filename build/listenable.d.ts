declare type ListenableCallback<T> = (controller: Listenable<T>) => void;
export declare class Listenable<T> {
    listeners: ListenableCallback<T>[];
    addListener(listener: ListenableCallback<T>): void;
    removeListener(listener: ListenableCallback<T>): void;
    notifyListeners(): void;
}
export {};
