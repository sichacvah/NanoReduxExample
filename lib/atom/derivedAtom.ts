import {atom} from './atom'
import type {Atom, ReadonlyAtom, Listener, IDisposable} from './types'

export const derivedAtom = <S, B>(
  source: ReadonlyAtom<S>,
  converter: (s: S, prevS?: B) => B,
): Atom<B> & IDisposable => {
  const derived = atom(converter(source.deref(), undefined))
  const listener: Listener<S> = (next) => {
    derived.reset(converter(next, derived.deref()))
  }
  source.addListener(listener)

  return {
    ...derived,
    dispose: () => source.removeListener(listener),
  }
}
