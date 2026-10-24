"""Serve output reports locally and refresh the browser after HTML changes."""
from functools import partial
from hashlib import sha256
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import json

ROOT = Path(__file__).resolve().parent

class OutputHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = Path(self.translate_path(self.path))
        if path.is_dir():
            path = path / 'index.html'
        if path.suffix != '.html' or not path.is_file():
            return super().do_GET()
        content = path.read_bytes()
        revision = sha256(content).hexdigest()
        script = '''<script>
class OutputRefresh {
    static async check() {
        if (document.visibilityState !== 'visible' || OutputRefresh.isChecking === true) {
            return;
        }
        OutputRefresh.isChecking = true;
        try {
            const response = await fetch(location.href, {
                method: 'HEAD',
                cache: 'no-store',
            });
            const revision = response.headers.get('ETag');
            if (response.ok === true && revision !== null && revision !== REVISION) {
                location.reload();
            }
        } catch {
            // Retry on the next check if the local server is unavailable.
        } finally {
            OutputRefresh.isChecking = false;
        }
    }
}
OutputRefresh.isChecking = false;
setInterval(() => OutputRefresh.check(), 2000);
document.addEventListener('visibilitychange', () => OutputRefresh.check());
</script>'''.replace('REVISION', json.dumps('"' + revision + '"'))
        content = content.replace(b'</body>', script.encode() + b'</body>')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(content)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('ETag', '"' + revision + '"')
        self.end_headers()
        self.wfile.write(content)

    def do_HEAD(self):
        path = Path(self.translate_path(self.path))
        if path.is_dir():
            path = path / 'index.html'
        if path.suffix != '.html' or not path.is_file():
            return super().do_HEAD()
        content = path.read_bytes()
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('ETag', '"' + sha256(content).hexdigest() + '"')
        self.end_headers()

if __name__ == '__main__':
    server = ThreadingHTTPServer(('127.0.0.1', 8765), partial(OutputHandler, directory=str(ROOT)))
    print('Outputs navigation: http://127.0.0.1:8765/index.html', flush=True)
    server.serve_forever()
