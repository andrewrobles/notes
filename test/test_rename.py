import os
import shutil
import subprocess
import unittest
from pathlib import Path

TEST_DIR = Path(__file__).resolve().parent
NOTES_DIR = TEST_DIR / "notes"
CLI_PATH = TEST_DIR.parent / "app" / "bin" / "main.js"
TEST_DATE = "2026-07-22T12:00:00"

class TestRename(unittest.TestCase):
    def setUp(self):
        shutil.rmtree(NOTES_DIR, ignore_errors=True)
        NOTES_DIR.mkdir(parents=True, exist_ok=True)
        env = os.environ.copy()
        env["NOTES_TEST_DATE"] = TEST_DATE
        subprocess.run(["node", str(CLI_PATH), "month"], cwd=NOTES_DIR, env=env, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    def test_rename(self):
        env = os.environ.copy()
        env["NOTES_TEST_DATE"] = TEST_DATE
        subprocess.run(["node", str(CLI_PATH), "lorem"], cwd=NOTES_DIR, env=env, check=True, capture_output=True, text=True)
        subprocess.run(["node", str(CLI_PATH), "rename", "lorem", "ipsum"], cwd=NOTES_DIR, env=env, check=True, capture_output=True, text=True)
        result = subprocess.run(["ls", str(NOTES_DIR / "22")], capture_output=True, text=True, check=True)
        expected = 'ipsum.md\n'
        self.assertEqual(result.stdout, expected)

    def tearDown(self):
        shutil.rmtree(NOTES_DIR, ignore_errors=True)

if __name__ == "__main__":
    unittest.main()
