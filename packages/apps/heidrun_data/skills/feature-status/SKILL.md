---
name: feature-status
description: Write a deep report on the status of one feature of a repository - what the feature is, its purpose, its current behavior, its history, and whether it is fully implemented - from the issues, the pull requests, the commits, and the chat sessions with the coding agent that the command line heidrun_data gives, and from the current source files. Use it when the developer asks for the status of a feature, for example "give me the status of this feature", "where am I with this feature", or "is this feature finished". The report is read-only.
---

# feature-status

A developer worked on a feature for some days, then did other work, and does not remember the status of the feature. This skill collects every record about the feature, reads the current code of the feature, and writes one deep report. The report tells the developer what the feature is, why it exists, what it does now, how it got there, and what work is still open.

This skill needs the skill [heidrun-data](../heidrun-data/SKILL.md). Read the skill `heidrun-data` before step 2: it gives the commands, the tables, the joins, and the limits of the data. Never guess a field name: `heidrun_data schema <table>` gives the fields.

## The report is read-only

Change no file, no issue, no pull request, no branch, and no worktree. Write no comment. You may run the tests of the feature, because a test run changes nothing. Write the report in the chat, unless the developer asks for a file, or the rules of the repository say where a report goes (for example the folder `outputs/` of `testbed_folder/AGENTS.md`).

## 1. Find the feature

1. Get the name of the feature from the developer. When the developer points to a file or a folder, start from it. When the name is not clear, ask one question, and give the candidates that you found.
2. Find the folders and the files of the feature in the current source files: search the code for the name, and read the files `CONTEXT.md` and `README.md` of the folders that you find.
3. Write down the search keys of the feature, and use them in every step below:
   - The paths of the folders and of the files of the feature.
   - The words that name the feature: the name of the feature, its folder names, and its main type or command names.

## 2. Check the data

1. Run `heidrun_data sources --format jsonl`. Compare `lastUpdatedAt` of each source with today. When the data is older than the last work on the feature, run `heidrun_data update --format jsonl`, and say so in the report.
2. Get the repository name `owner/name`, and put `repository = 'owner/name'` in every query.

## 3. Collect the records

Collect every record that is related to the feature. Keep the number, the hash, or the id of each record, because the report gives them as sources.

1. **The issues and the pull requests.** Search the title and the body for each word of the feature:
   ```bash
   heidrun_data query --format jsonl "
   SELECT number, json_extract(data, '$.title') AS title, json_extract(data, '$.state') AS state, updatedAt
   FROM issues
   WHERE repository = 'owner/name'
     AND (json_extract(data, '$.title') LIKE '%<word>%' OR json_extract(data, '$.body') LIKE '%<word>%')
   ORDER BY updatedAt"
   ```
   Do the same on the table `pull_requests`. Then follow the links: the text `Fixes #N`, `fixes #N`, or `Part of #N` in a pull request or in a commit message, and each issue number that a record names. Add each linked record.
2. **The commits.** A search of the commit messages finds too few commits. Read the files of each commit of the period of the feature with `heidrun_data read commit <hash> --no-diff --format jsonl`, and keep the commits that change a path of the feature. Read the diff of the last commits of the feature, because they show the last state of the work.
3. **The chat sessions.** Find them with the link tables `chat_session_issues` and `chat_session_pull_requests` on the numbers of step 3.1, and with the table `chat_session_files` on the paths of the feature. A chat session that started in a worktree is not in the table `chat_sessions`: when no chat session is found, write "no chat session found", and do not guess one.
4. **Read the records.** Read each issue with `heidrun_data read issue <number>`, and each pull request with `heidrun_data read pull_request <number> --no-diff`. Read the newest chat sessions in full with `heidrun_data read chat_session <id>`: the last chat sessions tell what the developer did last, what failed, and what the developer planned next.
5. **The work that is not merged.** Look for the open pull requests, and for the branches and the worktrees whose name or whose commits match the feature (`git branch --all`, `git worktree list`, and `git status` in each matching worktree). This work is the most likely place of the last days of work. When the rules of the repository allow only `heidrun_data`, skip this step, and write it in the section "Not checked" of the report.

## 4. Read the current code

The records tell the history. Only the current source files tell what the feature does now.

1. Read the source files and the tests of the feature in the current checkout of the target branch.
2. Search the code for the signs of open work: `TODO`, `FIXME`, a function that is not implemented, a test that is skipped.
3. Run the tests of the feature when the repository has a command for them. Report the command and the result. When you do not run them, write it in the section "Not checked".
4. Compare the code with the issues: for each behavior that an issue asks for, find the code and the test that implement it, or write that you did not find them.

When the rules of the repository allow only `heidrun_data` as a source of data, the current source files are still the code, not the data: read them, and say in the report which files you read.

## 5. Write the report

Write the report with these sections, in this order. Give a source for each fact: the number of an issue or of a pull request, the hash of a commit, the id of a chat session, or the path of a file. Mark each statement as one of the three kinds: a fact from a source, an interpretation of yours, or an unknown.

1. **Status in one line.** One of these values, with the main reason:
   - Fully implemented.
   - Partly implemented.
   - Work in progress.
   - Stopped.
   - Not started.
2. **What the feature is.** The feature in two or three sentences, with its folders and its files.
3. **Purpose.** Why the feature exists: the problem that it solves, and for whom. Quote the issue that asked for it.
4. **Current behavior.** What the feature does now, from the code and from the tests. Give the result of the tests.
5. **History.** A timeline, oldest first: the issues, the pull requests, the commits, and the chat sessions, each with its date in UTC and one line. Name the decisions and their reasons. When a reason is not in any record, write "reason unknown".
6. **Open work.** The open issues, the open pull requests, the work that is not merged, the signs of open work in the code, and the behaviors of an issue that the code does not implement.
7. **Where to start again.** The last thing that the developer did, from the newest chat session or commit, and the next step that the records name. Do not invent a next step.
8. **Not checked.** What you did not read or did not run, and why. Say when a search was by keyword only.
9. **Sources.** The list of the records that the report rests on.

## Rules

- A record that only names a word of the feature is related, not proof: say "related" in the report, and keep only the records with a strong link in the timeline.
- A count, a date, or a status in the report comes from a record, never from memory.
- The conclusion is yours: write it as your interpretation, with its sources.
- A chat session can hold a secret that the developer pasted. Quote only what the report needs.
