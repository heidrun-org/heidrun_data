"""Check that every source of module_history_statements.json exists and holds its quote.

Every record is read again with the command line heidrun_data. The script writes module_history_verification.json,
which the page shows, and exits with the code 1 when one source fails.
"""
from datetime import datetime, timezone
from pathlib import Path
import json
import re
import sys

from collect_module_history import DATABASE, REPOSITORY, REPOSITORY_FOLDER, HeidrunData

EXPERIMENT_DIR = Path(__file__).resolve().parent


class Verifier:
    """Reads the records cited by the statements and tests the quotes."""

    def __init__(self) -> None:
        self.cache: dict[tuple, object] = {}
        self.hashes: dict[str, str] = {}

    def run(self) -> dict:
        """Check every source.

        Returns:
            The content of module_history_verification.json.
        """
        statements = json.loads((EXPERIMENT_DIR / 'module_history_statements.json').read_text())
        results = []
        for statement in Verifier._all_statements(statements):
            for source in statement['sources']:
                results.append(self._check(source))
        failures = [result for result in results if result['isOk'] is False]
        return {
            'checkedAt': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
            'sourceCount': len(results),
            'quoteCount': sum(1 for result in results if result['hasQuote'] is True),
            'failureCount': len(failures),
            'failures': failures,
        }

    @staticmethod
    def _all_statements(statements: dict) -> list[dict]:
        found = []
        for key in ('summary', 'origin', 'constraints', 'attempts', 'openQuestions'):
            found.extend(statements[key])
        for decision in statements['decisions']:
            for part in decision['parts']:
                found.extend(part['statements'])
        return found

    def _check(self, source: dict) -> dict:
        label = source['kind'] + ' ' + str(source['id']) + ' ' + source['part']
        result = {'source': label, 'quote': source.get('quote'), 'hasQuote': 'quote' in source, 'isOk': True, 'reason': ''}
        try:
            if 'fields' in source:
                self._check_fields(source)
            else:
                text = self._text(source)
                if text is None:
                    result.update(isOk=False, reason='The record or the part was not found.')
                elif 'quote' in source and Verifier._normalize(source['quote']) not in Verifier._normalize(text):
                    result.update(isOk=False, reason='The quote is not in the record.')
        except Exception as error:
            result.update(isOk=False, reason=str(error)[:200])
        return result

    @staticmethod
    def _normalize(text: str) -> str:
        return re.sub(r'\s+', ' ', text).strip()

    def _check_fields(self, source: dict) -> None:
        table = 'issues' if source['kind'] == 'issue' else 'pull_requests'
        for field, expected in source['fields'].items():
            rows = HeidrunData.query(
                "SELECT json_extract(data,'$." + field + "') value FROM " + table + " WHERE repository = '" + REPOSITORY + "' AND number = " + str(source['id']),
                'Check one field of one record.',
            )
            if len(rows) != 1 or rows[0]['value'] != expected:
                raise ValueError('The field ' + field + ' is not ' + expected + '.')

    def _text(self, source: dict) -> str | None:
        kind, identifier, part = source['kind'], source['id'], source['part']
        if kind == 'issue':
            records = self._cached(('issue', identifier), lambda: HeidrunData.run(['read', 'issue', str(identifier), '--repository', REPOSITORY], 'Read an issue.', REPOSITORY_FOLDER))
            if part == 'body':
                return records[0]['text']
            if part == 'comment':
                return '\n'.join(record['text'] for record in records if record['kind'] == 'comment' and record['at'] == source['at'])
        elif kind == 'pull_request':
            records = self._cached(('pull_request', identifier), lambda: HeidrunData.run(['read', 'pull_request', str(identifier), '--repository', REPOSITORY, '--no-diff'], 'Read a pull request.', REPOSITORY_FOLDER))
            if part == 'title':
                return records[0]['title']
            if part == 'body':
                return records[0]['text']
        elif kind == 'commit':
            full_hash = self._full_hash(identifier)
            records = self._cached(('commit', full_hash), lambda: HeidrunData.run(['read', 'commit', full_hash], 'Read a commit with its diff.', REPOSITORY_FOLDER))
            if part == 'message':
                return records[0]['message']
            if part == 'diff':
                return records[0]['diff']
        elif kind == 'chat_session' and part == 'chat':
            records = self._cached(('chat_session', identifier), lambda: HeidrunData.run(['read', 'chat_session', identifier], 'Read a chat session.', REPOSITORY_FOLDER))
            return '\n'.join(record['text'] for record in records if record.get('role') in ('developer', 'coding_agent'))
        return None

    def _full_hash(self, prefix: str) -> str:
        if prefix not in self.hashes:
            rows = HeidrunData.query("SELECT hash FROM commits WHERE hash LIKE '" + prefix + "%'", 'Find the full hash of a commit.')
            if len(rows) != 1:
                raise ValueError('The commit prefix ' + prefix + ' matches ' + str(len(rows)) + ' commits.')
            self.hashes[prefix] = rows[0]['hash']
        return self.hashes[prefix]

    def _cached(self, key: tuple, load):
        if key not in self.cache:
            self.cache[key] = load()
        return self.cache[key]


if __name__ == '__main__':
    verification = Verifier().run()
    (EXPERIMENT_DIR / 'module_history_verification.json').write_text(json.dumps(verification, indent=1, ensure_ascii=False) + '\n')
    print('sources', verification['sourceCount'], 'quotes', verification['quoteCount'], 'failures', verification['failureCount'])
    for failure in verification['failures']:
        print('FAIL', failure['source'], '|', failure['reason'], '|', (failure['quote'] or '')[:100])
    sys.exit(1 if verification['failureCount'] > 0 else 0)
