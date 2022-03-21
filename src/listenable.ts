type ListenableCallback<T> = (context?: T) => void;

export class Listenable<T> {
  listeners: ListenableCallback<T>[] = [];

  addListener(listener: ListenableCallback<T>) {
    this.listeners.push(listener);
  }

  removeListener(listener: ListenableCallback<T>) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  notifyListeners(value?: T) {
    for (const listener of this.listeners) {
      listener(value);
    }
  }
}

export class ValueNotifier<T> extends Listenable<T> {
  value: T;

  constructor(value: T) {
    super();
    this.value = value;
  }

  update(value: T) {
    this.value = value;
    this.notifyListeners();
  }
}
