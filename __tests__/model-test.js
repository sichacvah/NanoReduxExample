import { decrement, increment, init as makeInit, makeModel, update as makeUpdate } from '../src/Child/Domain'

const init = makeInit(async () => 0)
const update = makeUpdate(() => Promise.resolve())
describe('Model', () => {
  test('initial Model count should be 0', () => {
    const expected = init()

    const [expectedModel] = expected

    expect(expectedModel).toStrictEqual(makeModel(0))
  })
})

describe('Update', () => {
  test('increment msg should increment Model count', () => {
    const msg = increment
    const model = makeModel(0)
    const expected = makeModel(1)
    const [resultModel] = update(msg, model)
    expect(resultModel).toStrictEqual(expected)
  })

  test('decrement msg should decrement Model count', () => {
    const msg = decrement
    const model = makeModel(1)
    const expected = makeModel(0)
    const [resultModel] = update(msg, model)
    expect(resultModel).toStrictEqual(expected)
  })
})