const { createMonth } = require('./month')

describe('createMonth', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('creates February 2026', () => {
    jest.setSystemTime(new Date('2026-02-15T12:00:00'))

    const md = createMonth(0, '')

    const expected = `
| S | M | T | W | T | F | S |
|---|---|---|---|---|---|---|
| 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| 8 | 9 | 10 | 11 | 12 | 13 | 14 |
| 15 | 16 | 17 | 18 | 19 | 20 | 21 |
| 22 | 23 | 24 | 25 | 26 | 27 | 28 |
`.trim()

    expect(md).toEqual(expected)
  })

  test('creates March 2026', () => {
    jest.setSystemTime(new Date('2026-03-15T12:00:00'))

    const md = createMonth(0, '')

    const expected = `
| S | M | T | W | T | F | S |
|---|---|---|---|---|---|---|
| 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| 8 | 9 | 10 | 11 | 12 | 13 | 14 |
| 15 | 16 | 17 | 18 | 19 | 20 | 21 |
| 22 | 23 | 24 | 25 | 26 | 27 | 28 |
| 29 | 30 | 31 |   |   |   |   |
`.trim()

    expect(md).toEqual(expected)
  })
})