type ListenableCallback<T> = (controller: Listenable<T>) => void;

export class Listenable<T> {
  listeners: ListenableCallback<T>[] = [];

  addListener(listener: ListenableCallback<T>) {
    this.listeners.push(listener);
  }

  removeListener(listener: ListenableCallback<T>) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  notifyListeners() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }
}
