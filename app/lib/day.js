const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const { getCurrentDate } = require('./time')

function copyToClipboard(text) {
  const platform = process.platform

  if (platform === 'darwin') {
    const res = spawnSync('pbcopy', { input: text, encoding: 'utf8' })
    if (res.error) throw res.error
    if (res.status !== 0) throw new Error(res.stderr || 'pbcopy failed')
    return
  }

  if (platform === 'win32') {
    // `clip` reads from stdin
    const res = spawnSync('cmd', ['/c', 'clip'], { input: text, encoding: 'utf8' })
    if (res.error) throw res.error
    if (res.status !== 0) throw new Error(res.stderr || 'clip failed')
    return
  }

  // Linux: try xclip, then xsel
  let res = spawnSync('xclip', ['-selection', 'clipboard'], { input: text, encoding: 'utf8' })
  if (!res.error && res.status === 0) return

  res = spawnSync('xsel', ['--clipboard', '--input'], { input: text, encoding: 'utf8' })
  if (!res.error && res.status === 0) return

  throw new Error('No clipboard utility found. Install xclip or xsel (Linux), or run on macOS/Windows.')
}

function createDay(testCalendar = null) {
  const today = getCurrentDate()
  const month = String(today.getMonth() + 1)
  const leadingZeroMonth = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate())
  const leadingZeroDay = String(today.getDate()).padStart(2, '0')
  const filename = testCalendar === null ? `${day}.md` : `${leadingZeroMonth}-${leadingZeroDay}.md`
  const filepath = path.join(process.cwd(), filename)

  const fileContent = `[${day}](./index.md)\n`
  const docLink = `[${today.getDate()}](./${filename})`

  const pattern = new RegExp(`(\\|\\s*)${today.getDate()}(\\s*\\|)`)

  let calendar
  if (!testCalendar) {
    // If dated note does not already exist
    if (!fs.existsSync(filepath)) {
      // Create a new dated note
      fs.writeFileSync(filepath, fileContent)
    }
    const readmeContent = fs.readFileSync(path.join(process.cwd(), 'index.md'), 'utf8')
    calendar = readmeContent.replace(pattern, `$1${docLink}$2`)
    fs.writeFileSync(path.join(process.cwd(), 'index.md'), calendar)
  } else {
    calendar = testCalendar.replace(pattern, `$1${docLink}$2`)
  }

  return {
    filename,
    filepath,
    docLink,
    fileContent,
    calendar
  }
}

const deleteDay = () => {
  // delete file corresponding to today
  const today = getCurrentDate()
  const day = String(today.getDate())
  const filename = `${day}.md`
  const filepath = path.join(process.cwd(), filename)
  fs.unlinkSync(filepath)

  // delete link from day in calendar
  const docLink = `[${today.getDate()}](./${filename})`
  const readmeContent = fs.readFileSync(path.join(process.cwd(), 'index.md'), 'utf8')
  const updatedContent = readmeContent.replace(docLink, `${today.getDate()}`)
  fs.writeFileSync(path.join(process.cwd(), 'index.md'), updatedContent)
}

module.exports = { createDay, deleteDay }
