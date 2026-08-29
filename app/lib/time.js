function getCurrentDate() {
    const override = process.env.NOTES_TEST_DATE

    if (override) {
        const parsed = new Date(override)
        if (!Number.isNaN(parsed.getTime())) {
            return parsed
        }
    }

    return new Date()
}

module.exports = { getCurrentDate }
