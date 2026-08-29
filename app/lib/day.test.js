const fs = require('fs')
const { createDay } = require('./day')

describe('day test 1', () => {

let inputCalendar = `
| S | M | T | W | T | F | S |
|---|---|---|---|---|---|---|
| [1](./03-01.md)| 2 | 3 | 4 | 5 | 6 | 7 |
| 8 | 9 | 10 | 11 | 12 | 13 | 14 |
| 15 | 16 | 17 | 18 | 19 | 20 | 21 |
| 22 | 23 | 24 | 25 | 26 | 27 | 28 |
| 29 | 30 | 31 |   |   |   |   |
`
let expectedCalendar = `
| S | M | T | W | T | F | S |
|---|---|---|---|---|---|---|
| [1](./03-01.md)| 2 | 3 | 4 | [5](./03-05.md) | 6 | 7 |
| 8 | 9 | 10 | 11 | 12 | 13 | 14 |
| 15 | 16 | 17 | 18 | 19 | 20 | 21 |
| 22 | 23 | 24 | 25 | 26 | 27 | 28 |
| 29 | 30 | 31 |   |   |   |   |
`
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    test('adds second new day', () => {
        jest.setSystemTime(new Date("2026-03-05T12:00:00"))
        const actual = createDay(inputCalendar)
        expect(actual.calendar).toEqual(expectedCalendar)
    })

})


describe('day test 2', () => {

inputCalendar = `
| S | M | T | W | T | F | S |
|---|---|---|---|---|---|---|
| 15 | 16 | 17 | 18 | 19 | 20 | 21 |
| 22 | 23 | 24 | 25 | 26 | 27 | 28 |
| 1 | 2 | 3 | 4 | 5 | 6 | 7 |
`
expectedCalendar = `
| S | M | T | W | T | F | S |
|---|---|---|---|---|---|---|
| 15 | 16 | 17 | 18 | 19 | 20 | 21 |
| 22 | 23 | 24 | 25 | 26 | 27 | 28 |
| 1 | 2 | 3 | 4 | 5 | [6](./03-06.md) | 7 |
`

    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    test('adds day', () => {
        jest.setSystemTime(new Date("2026-03-06T12:00:00"))
        const actual = createDay(inputCalendar)
        expect(actual.calendar).toEqual(expectedCalendar)
    })

})

