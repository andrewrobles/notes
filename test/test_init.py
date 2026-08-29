import os
import shutil
import subprocess
import unittest
from pathlib import Path

TEST_DIR = Path(__file__).resolve().parent
NOTES_DIR = TEST_DIR / "notes"
CLI_PATH = TEST_DIR.parent / "app" / "bin" / "main.js"
TEST_DATE = "2026-07-21T12:00:00"

class TestNewNote(unittest.TestCase):
    def setUp(self):
        shutil.rmtree(NOTES_DIR, ignore_errors=True)
        NOTES_DIR.mkdir(parents=True, exist_ok=True)
        env = os.environ.copy()
        env["NOTES_TEST_DATE"] = TEST_DATE
        # subprocess.run(["node", str(CLI_PATH), "month"], cwd=NOTES_DIR, env=env, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    def tearDown(self):
        shutil.rmtree(NOTES_DIR, ignore_errors=True)

    def test_new_day_note(self):
        '''
        $ note new "test"
        Created note: "test"
        '''
        env = os.environ.copy()
        env["NOTES_TEST_DATE"] = TEST_DATE
        result = subprocess.run(["node", str(CLI_PATH), "init", "notebook"], cwd=NOTES_DIR, env=env, check=True, capture_output=True, text=True)
        expected = ''
        self.assertEqual(result.stdout, expected)

#         '''
#         $ cat index.md
#         '''
#         stdout = '''July

# | S | M | T | W | T | F | S |
# |---|---|---|---|---|---|---|
# |   |   |   | 1 | 2 | 3 | 4 |
# | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
# | 12 | 13 | 14 | 15 | 16 | 17 | 18 |
# | 19 | 20 | [21](./21.md) | 22 | 23 | 24 | 25 |
# | 26 | 27 | 28 | 29 | 30 | 31 |   |

# '''
#         result = subprocess.run(["cat", str(NOTES_DIR / "index.md")], capture_output=True, text=True, check=True)
#         self.assertEqual(result.stdout, stdout)
#         '''
#         $ ls
#         '''

        result = subprocess.run(["ls", str(NOTES_DIR / "notebook")], capture_output=True, text=True, check=True)
        stdout = '''index.md
'''
        self.assertEqual(result.stdout, stdout)
#         '''
#         $ cat 21.md
#         '''
#         stdout = '[21](./index.md)\n'
#         result = subprocess.run(["cat", str(NOTES_DIR / "21.md")], capture_output=True, text=True, check=True)
#         self.assertEqual(result.stdout, stdout)




if __name__ == "__main__":
    unittest.main()
