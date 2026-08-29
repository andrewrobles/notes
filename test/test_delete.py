import os
import shutil
import subprocess
import unittest
from pathlib import Path

TEST_DIR = Path(__file__).resolve().parent
NOTES_DIR = TEST_DIR / "notes"
CLI_PATH = TEST_DIR.parent / "app" / "bin" / "main.js"
TEST_DATE = "2026-07-21T12:00:00"

class TestDeleteNote(unittest.TestCase):
    def setUp(self):
        shutil.rmtree(NOTES_DIR, ignore_errors=True)
        NOTES_DIR.mkdir(parents=True, exist_ok=True)
        env = os.environ.copy()
        env["NOTES_TEST_DATE"] = TEST_DATE
        subprocess.run(["node", str(CLI_PATH), "month"], cwd=NOTES_DIR, env=env, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    def tearDown(self):
        shutil.rmtree(NOTES_DIR, ignore_errors=True)

    def test_delete_titled_note(self):
        '''
        The complement of `note new "test"`.

        Given a titled note has been created for the current day:

        $ note new "test"

        Deleting it by title removes only the titled note for the day:

        $ note delete "test"

        The titled note file ("21/test.md") is removed and the link back to it
        is removed from the dated note ("21.md"). The dated note itself and the
        calendar link in index.md are left untouched.
        '''
        env = os.environ.copy()
        env["NOTES_TEST_DATE"] = TEST_DATE

        # Create the titled note that we are going to delete.
        subprocess.run(["node", str(CLI_PATH), "new", "test"], cwd=NOTES_DIR, env=env, check=True, capture_output=True, text=True)

        '''
        $ note delete "test"
        '''
        result = subprocess.run(["node", str(CLI_PATH), "delete", "test"], cwd=NOTES_DIR, env=env, check=True, capture_output=True, text=True)
        expected = ''
        self.assertEqual(result.stdout, expected)

        '''
        $ ls
        '''
        result = subprocess.run(["ls", str(NOTES_DIR)], capture_output=True, text=True, check=True)
        stdout = '''21.md
index.md
'''
        self.assertEqual(result.stdout, stdout)

        '''
        The titled note file no longer exists.
        '''
        self.assertFalse((NOTES_DIR / "21" / "test.md").exists())

        '''
        $ cat 21.md
        '''
        stdout = '[21](./index.md)\n'
        result = subprocess.run(["cat", str(NOTES_DIR / "21.md")], capture_output=True, text=True, check=True)
        self.assertEqual(result.stdout, stdout)

        '''
        $ cat index.md
        '''
        stdout = '''July

| S | M | T | W | T | F | S |
|---|---|---|---|---|---|---|
|   |   |   | 1 | 2 | 3 | 4 |
| 5 | 6 | 7 | 8 | 9 | 10 | 11 |
| 12 | 13 | 14 | 15 | 16 | 17 | 18 |
| 19 | 20 | [21](./21.md) | 22 | 23 | 24 | 25 |
| 26 | 27 | 28 | 29 | 30 | 31 |   |

'''
        result = subprocess.run(["cat", str(NOTES_DIR / "index.md")], capture_output=True, text=True, check=True)
        self.assertEqual(result.stdout, stdout)

    def test_delete_day_note(self):
        '''
        The complement of `note new`.

        Given a dated note has been created for the current day:

        $ note new

        Deleting without a title removes the dated note:

        $ note delete

        The dated note file ("21.md") is removed and the calendar link in
        index.md is reverted back to the plain day number.
        '''
        env = os.environ.copy()
        env["NOTES_TEST_DATE"] = TEST_DATE

        # Create the dated note that we are going to delete.
        subprocess.run(["node", str(CLI_PATH), "new"], cwd=NOTES_DIR, env=env, check=True, capture_output=True, text=True)

        '''
        $ note delete
        '''
        result = subprocess.run(["node", str(CLI_PATH), "delete"], cwd=NOTES_DIR, env=env, check=True, capture_output=True, text=True)
        expected = ''
        self.assertEqual(result.stdout, expected)

        '''
        $ ls
        '''
        result = subprocess.run(["ls", str(NOTES_DIR)], capture_output=True, text=True, check=True)
        stdout = '''index.md
'''
        self.assertEqual(result.stdout, stdout)

        '''
        The dated note file no longer exists.
        '''
        self.assertFalse((NOTES_DIR / "21.md").exists())

        '''
        $ cat index.md
        '''
        stdout = '''July

| S | M | T | W | T | F | S |
|---|---|---|---|---|---|---|
|   |   |   | 1 | 2 | 3 | 4 |
| 5 | 6 | 7 | 8 | 9 | 10 | 11 |
| 12 | 13 | 14 | 15 | 16 | 17 | 18 |
| 19 | 20 | 21 | 22 | 23 | 24 | 25 |
| 26 | 27 | 28 | 29 | 30 | 31 |   |

'''
        result = subprocess.run(["cat", str(NOTES_DIR / "index.md")], capture_output=True, text=True, check=True)
        self.assertEqual(result.stdout, stdout)


if __name__ == "__main__":
    unittest.main()
