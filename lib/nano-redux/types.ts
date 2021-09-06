
export type TypedData<T, Data = undefined> =
  Data extends undefined ?
  { type: T } :
  { type: T, data: Data }

export type Pair<F, S> = { first: F, second: S } &
  [first: F, second: S]

export const pair = <F, S>(first: F, second: S) => {
  let arr = [first, second] as Pair<F, S>
  arr.first = first
  arr.second = second
  return arr
}
export type Dispatch<Msg> = (msg: Msg) => void

export type DisposeCb = () => void
export type Effect<Msg> = (dispatch: Dispatch<Msg>, onDispose: (cb: DisposeCb) => void) => Promise<any>

export const init = <Model, Msg>(block: () => Pair<Model, Effect<Msg>>) => block
export const effect = <Msg>(block: Effect<Msg>) => block
export const update = <Model, Msg>(block: (msg: Msg, model: Model) => Pair<Model, Effect<Msg>>) => block


