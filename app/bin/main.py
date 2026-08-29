#!/usr/bin/env python3
import calendar
import os
import sys
from datetime import datetime
from pathlib import Path


def get_current_date():
    override = os.environ.get('NOTES_TEST_DATE')
    if override:
        try:
            return datetime.fromisoformat(override)
        except ValueError:
            pass
    return datetime.now()


def format_month_readme(date_obj):
    month_name = date_obj.strftime('%B')
    year = date_obj.year
    month = date_obj.month
    first_weekday, days_in_month = calendar.monthrange(year, month)

    headers = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    header_row = f"| {' | '.join(headers)} |"
    separator_row = f"|{'|'.join(['---'] * 7)}|"

    rows = []
    row = [' '] * 7
    weekday = (first_weekday + 1) % 7

    for day in range(1, days_in_month + 1):
        row[weekday] = str(day)
        weekday += 1
        if weekday == 7:
            rows.append(row)
            row = [' '] * 7
            weekday = 0

    if any(cell != ' ' for cell in row):
        rows.append(row)

    body_rows = []
    today = str(date_obj.day)
    for row in rows:
        row_text = f"| {' | '.join(row)} |"
        if f"| {today} |" in row_text:
            row_text = row_text.replace(f"| {today} |", f"| [{today}](./{today}.md) |")
        body_rows.append(row_text)

    return f"{month_name}\n\n{header_row}\n{separator_row}\n{'\n'.join(body_rows)}\n\n"


def main():
    args = sys.argv[1:]

    if not args or args[0] in {'-h', '--help'}:
        print('Usage: note new <title>')
        return 0

    if args[0] != 'create':
        print('Python entrypoint placeholder: only \'create\' is supported for now')
        return 2

    title = ' '.join(args[1:]).strip()

    readme_path = Path.cwd() / 'index.md'
    readme_path.write_text(format_month_readme(get_current_date()), encoding='utf-8')

    today = get_current_date()
    day = str(today.day)
    dated_note_path = Path.cwd() / f"{day}.md"

    if title:
        folder_path = Path.cwd() / day
        folder_path.mkdir(parents=True, exist_ok=True)

        note_path = folder_path / f"{title.lower().replace(' ', '-')}.md"
        note_path.write_text(f"[{title}](../{day}.md)\n", encoding='utf-8')

        slug = title.lower().replace(' ', '-')
        dated_note_path.write_text(f"[{day}](./index.md)\n\n* [{title}](./{day}/{slug}.md)", encoding='utf-8')
    else:
        dated_note_path.write_text(f"[{day}](./index.md)\n", encoding='utf-8')

    return 0


if __name__ == '__main__':
    sys.exit(main())
