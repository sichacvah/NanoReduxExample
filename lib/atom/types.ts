export interface IDerefable<S> {
  deref: () => S
}

export interface IDisposable {
  dispose: () => void
}

export type Listener<S> = (next: S, prev: S) => void

export interface IListenable<S> {
  addListener: (listener: Listener<S>) => IListenable<S>
  removeListener: (listener: Listener<S>) => IListenable<S>
  listenersCount: () => number
}


export interface Atom<S = any> extends IListenable<S>, IDerefable<S> {
  reset: (next: S) => Atom<S>
  swap: <Args extends any[] = any[]>(
    updater: (state: S, ...args: Args) => S,
    ...args: Args
  ) => Atom<S>
  toString: () => string
}

export type ReadonlyAtom<S> = IDerefable<S> & IListenable<S>
