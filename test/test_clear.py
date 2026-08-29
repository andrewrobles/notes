import os
import shutil
import subprocess
import unittest
from pathlib import Path

TEST_DIR = Path(__file__).resolve().parent
NOTES_DIR = TEST_DIR / "notes"
CLI_PATH = TEST_DIR.parent / "app" / "bin" / "main.js"
TEST_DATE = "2026-07-21T12:00:00"

class TestClear(unittest.TestCase):
    def setUp(self):
        shutil.rmtree(NOTES_DIR, ignore_errors=True)
        NOTES_DIR.mkdir(parents=True, exist_ok=True)
        env = os.environ.copy()
        env["NOTES_TEST_DATE"] = TEST_DATE
        subprocess.run(["node", str(CLI_PATH), "month"], cwd=NOTES_DIR, env=env, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    def tearDown(self):
        shutil.rmtree(NOTES_DIR, ignore_errors=True)

    def test_clear_moves_scratch_to_dated_note(self):
        '''
        Write some contents into the scratch ".md" file, then run:

        $ note clear

        The contents of ".md" should be moved into the dated note (21.md)
        and the scratch ".md" file should be emptied.
        '''
        env = os.environ.copy()
        env["NOTES_TEST_DATE"] = TEST_DATE

        # Create the dated note so there is somewhere to move contents into.
        subprocess.run(["node", str(CLI_PATH), "new"], cwd=NOTES_DIR, env=env, check=True, capture_output=True, text=True)

        # Seed the scratch ".md" file with contents.
        scratch = NOTES_DIR / ".md"
        scratch.write_text("some scratch thoughts\nmore thoughts\n")

        '''
        $ note clear
        '''
        result = subprocess.run(["node", str(CLI_PATH), "clear"], cwd=NOTES_DIR, env=env, check=True, capture_output=True, text=True)
        expected = ''
        self.assertEqual(result.stdout, expected)

        '''
        $ cat .md
        '''
        result = subprocess.run(["cat", str(scratch)], capture_output=True, text=True, check=True)
        self.assertEqual(result.stdout, '')

        '''
        $ cat 21.md
        '''
        stdout = '[21](./index.md)\n\nsome scratch thoughts\nmore thoughts\n'
        result = subprocess.run(["cat", str(NOTES_DIR / "21.md")], capture_output=True, text=True, check=True)
        self.assertEqual(result.stdout, stdout)

    def test_clear_links_dated_note_in_index(self):
        env = os.environ.copy()
        env["NOTES_TEST_DATE"] = TEST_DATE

        scratch = NOTES_DIR / ".md"
        scratch.write_text("some scratch thoughts\n")

        subprocess.run(["node", str(CLI_PATH), "clear"], cwd=NOTES_DIR, env=env, check=True, capture_output=True, text=True)

        result = subprocess.run(["cat", str(NOTES_DIR / "index.md")], capture_output=True, text=True, check=True)
        self.assertIn("[21](./21.md)", result.stdout)

        result = subprocess.run(["cat", str(NOTES_DIR / "21.md")], capture_output=True, text=True, check=True)
        self.assertEqual(result.stdout, "[21](./index.md)\n\nsome scratch thoughts\n")


if __name__ == "__main__":
    unittest.main()
