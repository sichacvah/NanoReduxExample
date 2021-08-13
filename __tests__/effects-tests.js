import {
  GetCount,
  init,
  makeModel,
  PutCount,
  setCount,
  update
} from '../src/Child/Domain'

describe('Effects', () => {
  test('initial Effect should dispatch SetCount', async () => {
    const getCount = async () => 0
    const expected = setCount(await getCount())
    const [_, effect] = init(getCount)()
    await effect((msg) => {
      expect(msg).toStrictEqual(expected)
    })
  })

  test('update effect should put count', async () => {
    const msg = setCount(42)
    const model = makeModel(0)
    const putCount = async (count) => {
      expect(count).toStrictEqual(msg.data)
    }

    const [_, effect] = update(putCount)(msg, model)
    await effect((msg) => {})
  })
})