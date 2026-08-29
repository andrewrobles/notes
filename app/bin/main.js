#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { createDay, deleteDay } = require('../lib/day')
const { createMonth, monthExists } = require('../lib/month')
const { createNote, renameNote, deleteNote, clearNote } = require('../lib/note')
const { getCurrentDate } = require('../lib/time')

function printHelp() {
  console.log(`
new
rename
`)
}

async function main() {
  const args = process.argv.slice(2)
  const cmd = args[0]
  const subCmd = args[1]
  const subValue = args[2]

  if (!cmd || cmd === '-h' || cmd === '--help') {
    printHelp()
    process.exit(0)
  }

  try {
    if (cmd === 'init') {
      const notesDir = path.join(process.cwd(), subCmd)
      fs.mkdirSync(notesDir, { recursive: true })
      fs.writeFileSync(path.join(notesDir, 'index.md'), '')
      process.exit(0)
    }

    if (cmd === "rename") {
      const nameBefore = args[1]
      const nameAfter = args[2]
      renameNote(nameBefore, nameAfter)
      console.log(`Renamed note: ${nameAfter}`)
      process.exit(0)
    }

    if (cmd === 'clear') {
      clearNote()
      process.exit(0)
    }

    if (cmd === 'new') {
      if (subCmd === '-d') {
        deleteDay()
      } else {
        if (!monthExists()) {
          createMonth()
        }
        createDay()
        const title = args.slice(1).join(' ').trim()
        if (title) {
          createNote(title)
        }
      }
      process.exit(0)
    }

    if (cmd === 'delete') {
      const title = args.slice(1).join(' ').trim()
      if (title) {
        deleteNote(title)
      } else {
        deleteDay()
      }
      process.exit(0)
    }

    if (cmd === 'month') {
      const offset = subCmd === '-i' ? parseInt(subValue, 10) : 0
      const monthName = createMonth(offset)
      console.log(`Created month: "${monthName}"`)
      process.exit(0)
    }

    // ---- DEFAULT: CREATE NOTE ----

    const result = createDay()
    if (result?.message) console.log(result.message)

    const title = cmd === 'new'
      ? args.slice(1).join(' ').trim() || String(getCurrentDate().getDate())
      : args.join(' ').trim()

    if (!title) {
      console.error('Error: title is required\n')
      console.log('Usage: note "<title>"')
      process.exit(1)
    }

    createNote(title)
    process.stdout.write(`Created note: "${title}"`)
    process.exit(0)

  } catch (err) {
    console.error(err?.stack || err)
    process.exit(1)
  }
}

main()