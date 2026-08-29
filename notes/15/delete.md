[delete](../15.md)

```bash
M345373@R5579333 MINGW64 ~/Projects/n/test (2026-08-15)
$ n init notebook

M345373@R5579333 MINGW64 ~/Projects/n/test (2026-08-15)
$ cd notebook

M345373@R5579333 MINGW64 ~/Projects/n/test/notebook (2026-08-15)
$ n month
Created month: "August"

M345373@R5579333 MINGW64 ~/Projects/n/test/notebook (2026-08-15)
$ n new "lorem"

M345373@R5579333 MINGW64 ~/Projects/n/test/notebook (2026-08-15)
$ n delete "lorem"

M345373@R5579333 MINGW64 ~/Projects/n/test/notebook (2026-08-15)
$ ls
15.md  index.md

M345373@R5579333 MINGW64 ~/Projects/n/test/notebook (2026-08-15)
$ cat 15.md
[15](./index.md)
```

```bash
M345373@R5579333 MINGW64 ~/Projects/n/test (2026-08-15)
$ n init "notebook"

M345373@R5579333 MINGW64 ~/Projects/n/test (2026-08-15)
$ cd notebook

M345373@R5579333 MINGW64 ~/Projects/n/test/notebook (2026-08-15)
$ note month
Created month: "August"

M345373@R5579333 MINGW64 ~/Projects/n/test/notebook (2026-08-15)
$ cat index.md 
August

| S | M | T | W | T | F | S |
|---|---|---|---|---|---|---|
|   |   |   |   |   |   | 1 |
| 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| 9 | 10 | 11 | 12 | 13 | 14 | 15 |
| 16 | 17 | 18 | 19 | 20 | 21 | 22 |
| 23 | 24 | 25 | 26 | 27 | 28 | 29 |
| 30 | 31 |   |   |   |   |   |


M345373@R5579333 MINGW64 ~/Projects/n/test/notebook (2026-08-15)
$ note new

M345373@R5579333 MINGW64 ~/Projects/n/test/notebook (2026-08-15)
$ cat index.md 
August

| S | M | T | W | T | F | S |
|---|---|---|---|---|---|---|
|   |   |   |   |   |   | 1 |
| 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| 9 | 10 | 11 | 12 | 13 | 14 | [15](./15.md) |
| 16 | 17 | 18 | 19 | 20 | 21 | 22 |
| 23 | 24 | 25 | 26 | 27 | 28 | 29 |
| 30 | 31 |   |   |   |   |   |


M345373@R5579333 MINGW64 ~/Projects/n/test/notebook (2026-08-15)
$ ls
15.md  index.md

M345373@R5579333 MINGW64 ~/Projects/n/test/notebook (2026-08-15)
$ n delete

M345373@R5579333 MINGW64 ~/Projects/n/test/notebook (2026-08-15)
$ cat index.md 
August

| S | M | T | W | T | F | S |
|---|---|---|---|---|---|---|
|   |   |   |   |   |   | 1 |
| 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| 9 | 10 | 11 | 12 | 13 | 14 | 15 |
| 16 | 17 | 18 | 19 | 20 | 21 | 22 |
| 23 | 24 | 25 | 26 | 27 | 28 | 29 |
| 30 | 31 |   |   |   |   |   |


M345373@R5579333 MINGW64 ~/Projects/n/test/notebook (2026-08-15)
$ ls
index.md
```