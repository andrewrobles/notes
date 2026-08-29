const fs = require('fs')
const { createNote } = require('./note')

describe('note test 1', () => {

let testInputDay = `
[1/1](./index.md)
`
let testOutputDayExpected = `
[1/1](./index.md)

- [Hello, World!](./01-01/hello,-world.md)
`
const testOutputNoteExpected = `[Hello, World!](../01-01.md)
`
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    test('creates note', () => {
        jest.setSystemTime(new Date("2026-01-01T12:00:00"))
        const output = createNote("Hello, World!", testInputDay)
        expect(output.titledNote).toEqual(testOutputNoteExpected)
        expect(output.datedNote).toEqual(testOutputDayExpected)
    })

})

