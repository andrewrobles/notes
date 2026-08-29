const fs = require('fs')
const path = require('path')
const { getCurrentDate } = require('./time')
const { createDay } = require('./day')

function slugifyTitle(title) {
  return title.toLowerCase().replace(/!+$/, '').replace(/ /g, '-')
}

function createNote(title, testInputDay = null) {
  const today = getCurrentDate()
  const leadingZeroMonth = String(today.getMonth() + 1).padStart(2, '0')
  const leadingZeroDay = String(today.getDate()).padStart(2, '0')
  const day = String(today.getDate())
  const filename = testInputDay === null ? `${day}.md` : `${leadingZeroMonth}-${leadingZeroDay}.md`
  const foldername = testInputDay === null ? `${day}` : `${leadingZeroMonth}-${leadingZeroDay}`

  // Slug for calendar link: remove trailing exclamation marks, keep commas, replace spaces
  const slug = slugifyTitle(title)
  const sluggedFilename = `${slug}.md`

  const titledNote = `[${title}](../${filename})\n`

  let datedNote = ''
  if (testInputDay) {
    datedNote = `${testInputDay}\n- [${title}](./${foldername}/${slug}.md)\n`
  } else {
    const cwd = process.cwd()
    const folderPath = path.join(cwd, foldername)
    const titledNotePath = path.join(folderPath, sluggedFilename)
    const datedNotePath = path.join(cwd, filename)

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }

    if (!fs.existsSync(titledNotePath)) {
      fs.writeFileSync(path.join(folderPath, sluggedFilename), titledNote)
    }

    const datedLink = `* [${title}](./${foldername}/${slug}.md)`

    if (fs.existsSync(datedNotePath)) {
      // TODO: Handle both cases when there is a new line at the end of the file or not
      fs.appendFileSync(datedNotePath, `\n${datedLink}`)
    }
  }

  return {
    titledNote,
    datedNote
  }
}

function renameNote(nameBefore, nameAfter) {
  const cwd = process.cwd()
  const slugBefore = slugifyTitle(nameBefore)
  const slugAfter = slugifyTitle(nameAfter)

  const today = getCurrentDate()
  const day = String(today.getDate())
  const foldername = day
  const filename = `${day}.md`

  const folderPath = path.join(cwd, foldername)
  const oldNotePath = path.join(folderPath, `${slugBefore}.md`)
  const newNotePath = path.join(folderPath, `${slugAfter}.md`)
  const datedNotePath = path.join(cwd, filename)

  if (fs.existsSync(oldNotePath)) {
    fs.renameSync(oldNotePath, newNotePath)

    if (fs.existsSync(newNotePath)) {
      let noteContent = fs.readFileSync(newNotePath, 'utf8')
      const oldPageLink = `[${nameBefore}](../${filename})`
      const newPageLink = `[${nameAfter}](../${filename})`
      noteContent = noteContent.replace(oldPageLink, newPageLink)
      fs.writeFileSync(newNotePath, noteContent)
    }
  }

  if (fs.existsSync(datedNotePath)) {
    let content = fs.readFileSync(datedNotePath, 'utf8')
    const oldLink = `* [${nameBefore}](./${foldername}/${slugBefore}.md)`
    const newLink = `* [${nameAfter}](./${foldername}/${slugAfter}.md)`
    content = content.replace(oldLink, newLink)
    fs.writeFileSync(datedNotePath, content)
  }
}

function deleteNote(title) {
  const cwd = process.cwd()
  const slug = slugifyTitle(title)

  const today = getCurrentDate()
  const day = String(today.getDate())
  const foldername = day
  const filename = `${day}.md`

  const folderPath = path.join(cwd, foldername)
  const titledNotePath = path.join(folderPath, `${slug}.md`)
  const datedNotePath = path.join(cwd, filename)

  if (fs.existsSync(titledNotePath)) {
    fs.unlinkSync(titledNotePath)
  }

  if (fs.existsSync(folderPath) && fs.readdirSync(folderPath).length === 0) {
    fs.rmdirSync(folderPath)
  }

  if (fs.existsSync(datedNotePath)) {
    let content = fs.readFileSync(datedNotePath, 'utf8')
    const datedLink = `* [${title}](./${foldername}/${slug}.md)`
    content = content.replace(`\n${datedLink}`, '')
    fs.writeFileSync(datedNotePath, content)
  }
}

function clearNote() {
  const cwd = process.cwd()
  const today = getCurrentDate()
  const day = String(today.getDate())
  const datedNotePath = path.join(cwd, `${day}.md`)
  const scratchPath = path.join(cwd, '.md')

  if (!fs.existsSync(scratchPath)) {
    return
  }

  const scratchContent = fs.readFileSync(scratchPath, 'utf8')

  createDay()

  if (fs.existsSync(datedNotePath)) {
    fs.appendFileSync(datedNotePath, `\n${scratchContent}`)
  }

  fs.writeFileSync(scratchPath, '')
}

module.exports = { createNote, renameNote, deleteNote, clearNote }