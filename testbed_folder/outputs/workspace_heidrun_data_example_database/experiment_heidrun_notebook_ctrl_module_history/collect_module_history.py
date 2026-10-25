"""Collect the history records of the package heidrun_notebook_ctrl with the command line heidrun_data.

Every record comes through `heidrun_data`. The script runs no Git command and no GitHub command.
It writes module_history_data.json, which the page index.html reads.
"""
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
import json
import os
import re
import subprocess

EXPERIMENT_DIR = Path(__file__).resolve().parent
TESTBED_DIR = EXPERIMENT_DIR.parents[2]
HEIDRUN_DATA_COMMAND = os.environ.get('HEIDRUN_DATA_COMMAND', str(TESTBED_DIR.parent / 'target' / 'debug' / 'heidrun_data'))
DATABASE = TESTBED_DIR / 'databases' / 'heidrun_data_example_database.sqlite'
REPOSITORY = 'heidrun-org/heidrun_notebook'
REPOSITORY_FOLDER = Path.home() / 'webwork' / 'heidrun_notebook'
PACKAGE_NAME = 'heidrun_notebook_ctrl'
PACKAGE_PREFIX = 'packages/heidrun_notebook_ctrl/'
GITHUB_BASE = 'https://github.com/' + REPOSITORY
AREA_ALIASES = {'packages/server': 'packages/web_server', 'packages/frontend': 'packages/web_frontend'}
EXECUTED_COMMANDS: list[dict] = []


class HeidrunData:
    """Runs the command line heidrun_data and reads its jsonl output."""

    @staticmethod
    def run(arguments: list[str], purpose: str, working_folder: Path | None = None, is_recorded: bool = True) -> list[dict]:
        """Run one heidrun_data command.

        Args:
            arguments: the arguments after the command name.
            purpose: why the command runs, written in the page.
            working_folder: the folder where the command starts.
            is_recorded: false for a command that runs many times, which is recorded once by the caller.

        Returns:
            One dictionary for each jsonl line of the output.
        """
        completed = subprocess.run(
            [HEIDRUN_DATA_COMMAND, *arguments, '--format', 'jsonl'],
            cwd=working_folder,
            capture_output=True,
            text=True,
        )
        if completed.returncode != 0:
            raise RuntimeError('heidrun_data ' + ' '.join(arguments)[:200] + ' failed: ' + completed.stdout[:300] + completed.stderr[:300])
        if is_recorded is True:
            EXECUTED_COMMANDS.append({'purpose': purpose, 'command': 'heidrun_data ' + ' '.join(arguments)})
        return [json.loads(line) for line in completed.stdout.splitlines() if line.strip() != '']

    @staticmethod
    def query(sql: str, purpose: str) -> list[dict]:
        """Run one read-only SQL statement on the database of the workspace.

        Args:
            sql: the statement.
            purpose: why the statement runs.

        Returns:
            One dictionary for each row.
        """
        return HeidrunData.run(['query', '--database', str(DATABASE), '--limit', '0', sql], purpose)


class RenamedPath:
    """Reads the paths that Git writes for a renamed file, such as `packages/{frontend => web_frontend}/main.ts`."""

    @staticmethod
    def split(path: str) -> tuple[str, str]:
        """Split a path of a changed file into its old path and its new path.

        Args:
            path: the path as `read commit` prints it.

        Returns:
            The old path and the new path, equal when the file was not renamed.
        """
        path = path.strip('"')
        braces = re.search(r'\{([^{}]*) => ([^{}]*)\}', path)
        if braces is not None:
            before, after = path[:braces.start()], path[braces.end():]
            old = (before + braces.group(1) + after).replace('//', '/')
            new = (before + braces.group(2) + after).replace('//', '/')
            return old, new
        if ' => ' in path:
            old, new = path.split(' => ', 1)
            return old, new
        return path, path


class ModuleHistoryCollector:
    """Builds the records of the page from the rows of heidrun_data."""

    def __init__(self) -> None:
        self.commits_by_hash: dict[str, dict] = {}
        self.issues: dict[int, dict] = {}
        self.pull_requests: dict[int, dict] = {}

    def collect(self) -> dict:
        """Collect every record and return the content of module_history_data.json.

        Returns:
            The dictionary written in module_history_data.json.
        """
        sources = HeidrunData.run(['sources', '--database', str(DATABASE)], 'Count the rows of each source and read the date of the newest record.')
        self._collect_commits()
        self._collect_issues_and_pull_requests()
        module_commits = [commit for commit in self.commits_by_hash.values() if commit['isModuleCommit'] is True]
        self._link_commits_to_numbers(module_commits)
        module_pull_requests = self._select_pull_requests(module_commits)
        module_issues = self._select_issues(module_commits, module_pull_requests)
        chat_sessions = self._collect_chat_sessions(module_issues, module_pull_requests)
        return {
            'module': PACKAGE_NAME,
            'repository': REPOSITORY,
            'githubBase': GITHUB_BASE,
            'generatedAt': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
            'sources': sources,
            'repositoryTotals': {
                'commits': len(self.commits_by_hash),
                'issues': len(self.issues),
                'pullRequests': len(self.pull_requests),
            },
            'commits': sorted(module_commits, key=lambda commit: commit['at']),
            'pullRequests': sorted(module_pull_requests, key=lambda item: item['number']),
            'issues': sorted(module_issues, key=lambda item: item['number']),
            'chatSessions': sorted(chat_sessions, key=lambda item: item['firstRecordAt'] or ''),
            'files': self._aggregate_files(module_commits),
            'coChange': self._aggregate_co_change(module_commits),
            'authors': Counter(commit['authorName'] for commit in module_commits if commit['isMerge'] is False),
            'executedCommands': EXECUTED_COMMANDS,
        }

    def _collect_commits(self) -> None:
        rows = HeidrunData.query(
            "SELECT hash, committedAt, json_extract(data,'$.authorName') authorName, json_extract(data,'$.subject') subject, "
            "json_extract(data,'$.body') body, json_extract(data,'$.parents') parents, json_extract(data,'$.filesChanged') filesChanged, "
            "json_extract(data,'$.insertions') insertions, json_extract(data,'$.deletions') deletions "
            "FROM commits WHERE repository = '" + REPOSITORY + "' ORDER BY committedAt",
            'Read every commit of the repository: hash, date, author, message, and size.',
        )
        read_arguments_example = None
        for row in rows:
            read_arguments = ['read', 'commit', row['hash'], '--no-diff']
            files = HeidrunData.run(read_arguments, 'Read the files changed by one commit.', REPOSITORY_FOLDER, is_recorded=False)[0]['files']
            read_arguments_example = read_arguments_example or 'read commit <hash> --no-diff'
            parents = json.loads(row['parents']) if row['parents'] is not None else []
            package_files = []
            all_paths = []
            for file in files:
                old_path, new_path = RenamedPath.split(file['path'])
                all_paths.append(new_path)
                if new_path.startswith(PACKAGE_PREFIX):
                    package_files.append({**file, 'path': new_path, 'renamedFrom': old_path if old_path != new_path else None})
                elif old_path.startswith(PACKAGE_PREFIX):
                    package_files.append({**file, 'path': old_path, 'renamedFrom': None, 'movedOutTo': new_path})
            self.commits_by_hash[row['hash']] = {
                'hash': row['hash'],
                'at': row['committedAt'],
                'authorName': row['authorName'],
                'subject': row['subject'],
                'body': row['body'],
                'isMerge': len(parents) > 1,
                'filesChanged': row['filesChanged'],
                'insertions': row['insertions'],
                'deletions': row['deletions'],
                'allFiles': all_paths,
                'packageFiles': package_files,
                'isModuleCommit': len(package_files) > 0,
                'referencedNumbers': [],
                'pullRequestNumber': None,
            }
        EXECUTED_COMMANDS.append({
            'purpose': 'Read the files changed by each of the ' + str(len(rows)) + ' commits, started in a folder of the repository.',
            'command': 'heidrun_data ' + read_arguments_example,
        })

    def _collect_issues_and_pull_requests(self) -> None:
        for row in HeidrunData.query(
            "SELECT number, json_extract(data,'$.title') title, json_extract(data,'$.body') body, json_extract(data,'$.state') state, "
            "json_extract(data,'$.stateReason') stateReason, json_extract(data,'$.author') author, json_extract(data,'$.labels') labels, "
            "json_extract(data,'$.createdAt') createdAt, json_extract(data,'$.closedAt') closedAt, "
            "json_extract(data,'$.commentCount') commentCount FROM issues WHERE repository = '" + REPOSITORY + "'",
            'Read every issue of the repository: title, body, state, dates, and number of comments.',
        ):
            row['labels'] = json.loads(row['labels']) if row['labels'] is not None else []
            self.issues[row['number']] = row
        for row in HeidrunData.query(
            "SELECT number, json_extract(data,'$.title') title, json_extract(data,'$.body') body, json_extract(data,'$.state') state, "
            "json_extract(data,'$.author') author, json_extract(data,'$.mergeCommit') mergeCommit, json_extract(data,'$.headRefName') headRefName, "
            "json_extract(data,'$.createdAt') createdAt, json_extract(data,'$.mergedAt') mergedAt, json_extract(data,'$.additions') additions, "
            "json_extract(data,'$.deletions') deletions, json_extract(data,'$.changedFiles') changedFiles, "
            "json_extract(data,'$.commitCount') commitCount FROM pull_requests WHERE repository = '" + REPOSITORY + "'",
            'Read every pull request of the repository: title, body, state, dates, merge commit, and size.',
        ):
            self.pull_requests[row['number']] = row

    def _link_commits_to_numbers(self, module_commits: list[dict]) -> None:
        for commit in module_commits:
            text = commit['subject'] + '\n' + (commit['body'] or '')
            merge_match = re.match(r'Merge pull request #(\d+)', commit['subject'])
            if merge_match is not None:
                commit['pullRequestNumber'] = int(merge_match.group(1))
            commit['referencedNumbers'] = ModuleHistoryCollector._references(text)

    @staticmethod
    def _references(text: str) -> list[dict]:
        references = []
        for match in re.finditer(r'(?i)\b(fixes|fix|closes|part of|related to|for issue|for|see)?\s*(?:issue |pull request )?#(\d+)', text):
            verb = (match.group(1) or '').lower()
            references.append({'number': int(match.group(2)), 'verb': 'fixes' if verb in ('fixes', 'fix', 'closes') else verb})
        return references

    def _select_pull_requests(self, module_commits: list[dict]) -> list[dict]:
        merge_commits_by_hash = {commit['hash']: commit for commit in module_commits if commit['isMerge'] is True}
        selected: dict[int, dict] = {}
        for number, pull_request in self.pull_requests.items():
            reasons = []
            if pull_request['mergeCommit'] in merge_commits_by_hash:
                reasons.append('The merge of the pull request changes files of the package.')
            if PACKAGE_NAME in (pull_request['title'] + ' ' + (pull_request['body'] or '')):
                reasons.append('The title or the body names the package.')
            if len(reasons) > 0:
                selected[number] = {
                    'number': number,
                    'title': pull_request['title'],
                    'body': pull_request['body'],
                    'state': pull_request['state'],
                    'author': pull_request['author'],
                    'headRefName': pull_request['headRefName'],
                    'createdAt': pull_request['createdAt'],
                    'mergedAt': pull_request['mergedAt'],
                    'mergeCommit': pull_request['mergeCommit'],
                    'additions': pull_request['additions'],
                    'deletions': pull_request['deletions'],
                    'changedFiles': pull_request['changedFiles'],
                    'commitCount': pull_request['commitCount'],
                    'reasons': reasons,
                    'isDirect': 'The merge of the pull request changes files of the package.' in reasons,
                    'referencedNumbers': ModuleHistoryCollector._references(pull_request['title'] + '\n' + (pull_request['body'] or '')),
                }
        return list(selected.values())

    def _select_issues(self, module_commits: list[dict], module_pull_requests: list[dict]) -> list[dict]:
        reasons_by_number: dict[int, list[dict]] = defaultdict(list)
        for commit in module_commits:
            if commit['isMerge'] is True:
                continue
            for reference in commit['referencedNumbers']:
                if reference['number'] in self.issues:
                    reasons_by_number[reference['number']].append({
                        'kind': 'commit',
                        'id': commit['hash'],
                        'verb': reference['verb'],
                        'text': 'A commit that changes the package refers to it' + (' with "fixes".' if reference['verb'] == 'fixes' else '.'),
                    })
        for pull_request in module_pull_requests:
            for reference in pull_request['referencedNumbers']:
                if reference['number'] in self.issues and reference['verb'] in ('fixes', 'part of'):
                    reasons_by_number[reference['number']].append({
                        'kind': 'pull_request',
                        'id': pull_request['number'],
                        'verb': reference['verb'],
                        'text': 'A pull request about the package says "' + reference['verb'] + '" for it.',
                    })
        for number, issue in self.issues.items():
            title = issue['title']
            if PACKAGE_NAME in title or 'command line tool' in title.lower():
                reasons_by_number[number].append({'kind': 'title', 'id': number, 'verb': '', 'text': 'The title names the package or the command line tool.'})
            elif PACKAGE_NAME in (issue['body'] or ''):
                reasons_by_number[number].append({'kind': 'body', 'id': number, 'verb': '', 'text': 'The body names the package.'})
        selected = []
        for number, reasons in reasons_by_number.items():
            issue = self.issues[number]
            is_direct = any(reason['kind'] == 'title' or reason['verb'] == 'fixes' for reason in reasons)
            selected.append({**issue, 'reasons': reasons, 'isDirect': is_direct})
        return selected

    def _collect_chat_sessions(self, module_issues: list[dict], module_pull_requests: list[dict]) -> list[dict]:
        reasons_by_id: dict[str, list[dict]] = defaultdict(list)
        issue_numbers = ','.join(str(issue['number']) for issue in module_issues)
        pull_request_numbers = ','.join(str(item['number']) for item in module_pull_requests)
        direct_issues = {issue['number'] for issue in module_issues if issue['isDirect'] is True}
        direct_pull_requests = {item['number'] for item in module_pull_requests if item['isDirect'] is True}
        for row in HeidrunData.query(
            "SELECT chatSessionId, issueNumber FROM chat_session_issues WHERE repository = '" + REPOSITORY + "' AND issueNumber IN (" + issue_numbers + ')',
            'Find the chat sessions that the data links to the issues of the package.',
        ):
            reasons_by_id[row['chatSessionId']].append({'type': 'issue', 'number': row['issueNumber'], 'isDirect': row['issueNumber'] in direct_issues})
        for row in HeidrunData.query(
            "SELECT chatSessionId, pullRequestNumber FROM chat_session_pull_requests WHERE repository = '" + REPOSITORY + "' AND pullRequestNumber IN (" + pull_request_numbers + ')',
            'Find the chat sessions that the data links to the pull requests of the package.',
        ):
            reasons_by_id[row['chatSessionId']].append({'type': 'pull_request', 'number': row['pullRequestNumber'], 'isDirect': row['pullRequestNumber'] in direct_pull_requests})
        for row in HeidrunData.query(
            "SELECT chatSessionId, path FROM chat_session_files WHERE repository = '" + REPOSITORY + "' AND path LIKE '%/" + PACKAGE_PREFIX + "%'",
            'Find the chat sessions that wrote a file of the package.',
        ):
            reasons_by_id[row['chatSessionId']].append({'type': 'file', 'path': row['path'].split(PACKAGE_PREFIX, 1)[1], 'isDirect': True})
        quoted_ids = ','.join("'" + chat_id + "'" for chat_id in reasons_by_id)
        sessions = []
        for row in HeidrunData.query(
            "SELECT id, json_extract(data,'$.codingAgent') codingAgent, json_extract(data,'$.title') title, "
            "json_extract(data,'$.firstRecordAt') firstRecordAt, json_extract(data,'$.lastRecordAt') lastRecordAt, "
            "json_extract(data,'$.userMessageCount') userMessageCount FROM chat_sessions "
            "WHERE repository = '" + REPOSITORY + "' AND id IN (" + quoted_ids + ')',
            'Read the title, the dates, and the number of messages of those chat sessions.',
        ):
            reasons = reasons_by_id[row['id']]
            sessions.append({**row, 'reasons': reasons, 'isDirect': any(reason['isDirect'] is True for reason in reasons)})
        return sessions

    @staticmethod
    def _aggregate_files(module_commits: list[dict]) -> list[dict]:
        totals: dict[str, dict] = {}
        for commit in module_commits:
            if commit['isMerge'] is True:
                continue
            for file in commit['packageFiles']:
                path = file['path'][len(PACKAGE_PREFIX):]
                entry = totals.setdefault(path, {'path': path, 'commits': 0, 'insertions': 0, 'deletions': 0, 'firstAt': commit['at'], 'lastAt': commit['at'], 'hashes': []})
                entry['commits'] += 1
                entry['insertions'] += file['insertions']
                entry['deletions'] += file['deletions']
                entry['lastAt'] = commit['at']
                entry['hashes'].append(commit['hash'])
        return sorted(totals.values(), key=lambda entry: (-entry['commits'], entry['path']))

    @staticmethod
    def _aggregate_co_change(module_commits: list[dict]) -> list[dict]:
        areas: dict[str, set[str]] = defaultdict(set)
        for commit in module_commits:
            if commit['isMerge'] is True:
                continue
            for path in commit['allFiles']:
                if path.startswith(PACKAGE_PREFIX):
                    continue
                parts = path.split('/')
                area = '/'.join(parts[:2]) if parts[0] == 'packages' and len(parts) > 2 else (parts[0] if len(parts) > 1 else '(root files)')
                area = AREA_ALIASES.get(area, area)
                areas[area].add(commit['hash'])
        return sorted(({'area': area, 'commits': len(hashes), 'hashes': sorted(hashes)} for area, hashes in areas.items()), key=lambda entry: (-entry['commits'], entry['area']))


if __name__ == '__main__':
    data = ModuleHistoryCollector().collect()
    (EXPERIMENT_DIR / 'module_history_data.json').write_text(json.dumps(data, indent=1, ensure_ascii=False) + '\n')
    print('commits', len(data['commits']), 'of which merges', sum(1 for c in data['commits'] if c['isMerge']))
    print('pull requests', len(data['pullRequests']), 'issues', len(data['issues']), 'direct', sum(1 for i in data['issues'] if i['isDirect']))
    print('chat sessions', len(data['chatSessions']), 'direct', sum(1 for c in data['chatSessions'] if c['isDirect']))
    print('files', len(data['files']), 'areas', [(a['area'], a['commits']) for a in data['coChange'][:8]])
