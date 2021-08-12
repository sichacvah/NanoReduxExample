import {atom} from './atom'
import type {Atom} from './types'

export const multiSourceAtom = <S, B>(
  sources: Atom<S>[],
  convert: (states: S[]) => B,
) => {
  const recalc = () => convert(sources.map((s) => s.deref()))
  const sink = atom(recalc())
  const listener = () => {
    sink.reset(recalc())
  }
  sources.forEach((source) => {
    source.addListener(listener)
  })

  return sink
}
