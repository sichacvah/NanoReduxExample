import { exhaustiveCheck, none } from '../lib/nano-redux/effect/utils'
import { Effect, pair, Pair, TypedData } from '../lib/nano-redux/types'

/// State
export enum EState {
  Empty = 'Empty',

  EmptyProgress = 'EmptyProgress',

  EmptyError = 'EmptyError',

  Data = 'Data',

  Refresh = 'Refresh',

  NewPageProgress = 'NewPageProgress',

  FullData = 'FullData'
}



type Empty = TypedData<EState.Empty>
export const empty: Empty = {type: EState.Empty}

type EmptyProgress = TypedData<EState.EmptyProgress>
const emptyProgress: EmptyProgress = {type: EState.EmptyProgress}

type EmptyError = TypedData<EState.EmptyError, { error: Error }>
const emptyError = (error: Error): EmptyError => ({ type: EState.EmptyError, data: { error } })

type Data<T> = TypedData<EState.Data, { value: T[], pageCount: number }>
const data = <T>(pageCount: number, value: T[]): Data<T> => ({
  type: EState.Data,
  data: { value, pageCount }
})

type Refresh<T> = TypedData<EState.Refresh, { value: T[], pageCount: number }>
const refresh = <T>(pageCount: number, value: T[]): Refresh<T> => ({
  type: EState.Refresh,
  data: { value, pageCount }
})

type NewPageProgress<T> = TypedData<EState.NewPageProgress, { value: T[], pageCount: number }>
const newPageProgress = <T>(pageCount: number, value: T[]): NewPageProgress<T> => ({
  type: EState.NewPageProgress,
  data: { value, pageCount }
})

type FullData<T> = TypedData<EState.FullData, { value: T[], pageCount: number }>
const fullData = <T>(pageCount: number, value: T[]): FullData<T> => ({
  type: EState.FullData,
  data: { value, pageCount }
})

export type Model<T> =
  Empty |
  EmptyProgress |
  EmptyError |
  Data<T> |
  Refresh<T> |
  NewPageProgress<T> |
  FullData<T>


// MSG


export enum EMsg {
  Refresh = 'Refresh',
  Restart = 'Restart',
  LoadMore = 'LoadMore',
  NewPage = 'NewPage',
  PageError = 'PageError'
}

type RefreshMsg = TypedData<EMsg.Refresh>
export const refreshMsg: RefreshMsg = { type: EMsg.Refresh }

type RestartMsg = TypedData<EMsg.Restart>
export const restartMsg: RestartMsg = { type: EMsg.Restart }

type LoadMoreMsg = TypedData<EMsg.LoadMore>
export const loadMoreMsg: LoadMoreMsg = { type: EMsg.LoadMore }

type NewPageMsg<T> = TypedData<EMsg.NewPage, { page: T[] }>
export const newPageMsg = <T>(page: T[]): NewPageMsg<T> => ({
  type: EMsg.NewPage,
  data: { page }
})

type PageErrorMsg = TypedData<EMsg.PageError, { error: Error }>
export const pageErrorMsg = (error: Error): PageErrorMsg => ({
  type: EMsg.PageError,
  data: { error }
})

export type Msg<T> =
  RefreshMsg |
  RestartMsg |
  LoadMoreMsg |
  NewPageMsg<T> |
  PageErrorMsg

// Update

const makeUpdateRefresh = <T>(loadPage: LoadPage<T>) => (_: RefreshMsg, model: Model<T>): Pair<Model<T>, Effect<Msg<T>>> => {
  const loadPageEffect = makeLoadPageEffect(loadPage)
  switch (model.type) {
    case EState.EmptyError:
      return pair(emptyProgress, loadPageEffect(1))
    case EState.Empty:
      return pair(emptyProgress, loadPageEffect(1))
    case EState.Data:
      return pair(refresh(model.data.pageCount, model.data.value), loadPageEffect(1))
    case EState.NewPageProgress:
      return pair(refresh(model.data.pageCount, model.data.value), loadPageEffect(1))
    case EState.FullData:
      return pair(refresh(model.data.pageCount, model.data.value), loadPageEffect(1))
    default:
      return pair(model, none())
  }
}

const updateRestart = <T>(_: RestartMsg, model: Model<T>): Pair<Model<T>, Effect<Msg<T>>> => {
  switch (model.type) {
    case EState.Data:
      return pair(emptyProgress, none())
    case EState.Empty:
      return pair(emptyProgress, none())
    case EState.EmptyError:
      return pair(emptyProgress, none())
    case EState.EmptyProgress:
      return pair(emptyProgress, none())
    case EState.Refresh:
      return pair(emptyProgress, none())
    case EState.FullData:
      return pair(emptyProgress, none())
    case EState.NewPageProgress:
      return pair(emptyProgress, none())
  }
  exhaustiveCheck(model)
}

type LoadPage<T> = (pageNumber: number) => Promise<T[]>
type ErrorHandler = (error: Error) => void

const makeUpdateLoadMore = <T>(loadPage: LoadPage<T>) => (_: LoadMoreMsg, model: Model<T>): Pair<Model<T>, Effect<Msg<T>>> => {
  switch (model.type) {
    case EState.Data:
      return pair(newPageProgress(model.data.pageCount, model.data.value), makeLoadPageEffect(loadPage)(model.data.pageCount + 1))
    default:
      return pair(model, none())
  }
}

const makeLoadPageEffect = <T>(loadPage: LoadPage<T>) => (pageNumber: number): Effect<Msg<T>> => async (dispatch) => {
  try {
    const page = await loadPage(pageNumber)
    console.log('page', page)
    dispatch(newPageMsg(page))
  } catch (error) {
    dispatch(pageErrorMsg(error))
  }
}

const makeErrorHandlerEffect = (errorHandler: ErrorHandler) => <T>(error: Error): Effect<Msg<T>> => async () => {
  errorHandler(error)
}

const makeUpdatePageError = (errorHandler: ErrorHandler) => <T>(msg: PageErrorMsg, model: Model<T>): Pair<Model<T>, Effect<Msg<T>>> => {
  const errorHandlerEffect = makeErrorHandlerEffect(errorHandler)
  switch (model.type) {
    case EState.Empty:
      return pair(emptyError(msg.data.error), none())
    case EState.Refresh:
      return pair(
        data(model.data.pageCount, model.data.value),
        errorHandlerEffect(msg.data.error)
      )
    case EState.NewPageProgress:
      return pair(
        data(model.data.pageCount, model.data.value),
        errorHandlerEffect(msg.data.error)
      )
    default:
      return pair(model, none())
  }
}

const updateNewPage = <T>(msg: NewPageMsg<T>, model: Model<T>): Pair<Model<T>, Effect<Msg<T>>> => {
  const items = msg.data.page
  switch (model.type) {
    case EState.EmptyProgress:
      if (items.length === 0) return pair(empty, none())
      return pair(data(1, items), none())
    case EState.Refresh:
      if (items.length === 0) return pair(empty, none())
      return pair(data(1, items), none())
    case EState.NewPageProgress:
      if (items.length === 0) return pair(fullData(model.data.pageCount, model.data.value), none())
      return pair(data(model.data.pageCount + 1, model.data.value.concat(msg.data.page)), none())
    default:
      return pair(model, none())
  }
}

export const update = <T>(loadPage: LoadPage<T>, errorHandler: ErrorHandler) => (msg: Msg<T>, model: Model<T>): Pair<Model<T>, Effect<Msg<T>>> => {
  const updateLoadMore = makeUpdateLoadMore(loadPage)
  const updatePageError = makeUpdatePageError(errorHandler)
  const updateRefresh = makeUpdateRefresh(loadPage)
  switch (msg.type) {
    case EMsg.Refresh:
      return updateRefresh(msg, model)
    case EMsg.Restart:
      return updateRestart(msg, model)
    case EMsg.LoadMore:
      return updateLoadMore(msg, model)
    case EMsg.PageError:
      return updatePageError(msg, model)
    case EMsg.NewPage:
      return updateNewPage(msg, model)
  }

  return exhaustiveCheck(msg)
}

