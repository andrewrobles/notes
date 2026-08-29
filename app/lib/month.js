const fs = require('fs')
const path = require('path')
const { getCurrentDate } = require('./time')

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

const write = (string, testReadme = null) => {
  const newContent = string + '\n\n'

  if (testReadme !== null) {
    return newContent + testReadme
  }

  const filename = 'index.md'
  const filepath = path.join(process.cwd(), filename)
  const existingContent = fs.existsSync(filepath)
    ? fs.readFileSync(filepath, 'utf8')
    : ''

  fs.writeFileSync(filepath, newContent + existingContent)
  return newContent + existingContent
}

function createMonth(index = 0, testReadme = null) {
  const weekStartsOn = 0

  const now = getCurrentDate()
  const year = now.getFullYear()
  const monthIndex = now.getMonth() + index
  const monthName = monthNames[monthIndex]

  const firstDay = new Date(year, monthIndex, 1)
  const lastDay = new Date(year, monthIndex + 1, 0)
  const daysInMonth = lastDay.getDate()

  const headersSunday = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const headersMonday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const headers = weekStartsOn === 0 ? headersSunday : headersMonday

  const headerRow = `| ${headers.join(' | ')} |`
  const separatorRow = `|${headers.map(() => '---').join('|')}|`

  const jsDow = firstDay.getDay()
  const offset = weekStartsOn === 0 ? jsDow : (jsDow + 6) % 7

  const rows = []
  let row = Array(7).fill('')
  let col = offset

  for (let day = 1; day <= daysInMonth; day++) {
    row[col] = String(day)
    col++

    if (col === 7) {
      rows.push(row)
      row = Array(7).fill('')
      col = 0
    }
  }

  if (row.some(cell => cell !== '')) rows.push(row)

  const bodyRows = rows.map(r =>
    `| ${r.map(x => (x === '' ? ' ' : x)).join(' | ')} |`
  )

  const output = [headerRow, separatorRow, ...bodyRows].join('\n')
  const contentToWrite = testReadme !== null ? output : `${monthName}\n\n${output}`

  if (testReadme !== null) {
    write(contentToWrite, testReadme)
    return output
  }

  write(contentToWrite)
  return monthName
}

function monthExists(index = 0) {
  const now = getCurrentDate()
  const monthName = monthNames[now.getMonth() + index]
  const filepath = path.join(process.cwd(), 'index.md')

  if (!fs.existsSync(filepath)) {
    return false
  }

  const content = fs.readFileSync(filepath, 'utf8')
  return content.includes(monthName)
}

module.exports = { createMonth, monthExists }