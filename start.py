#!/usr/bin/env python3
"""Start HFS — Hand Flight Simulator locally using only Python's standard library."""
import functools
import http.server
import pathlib
import threading
import webbrowser

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      '.mjs': 'text/javascript', '.js': 'text/javascript'}
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()
    def log_message(self, *_):
        pass

if __name__ == '__main__':
    root = pathlib.Path(__file__).resolve().parent
    for port in range(8000, 8011):
        try:
            server = http.server.ThreadingHTTPServer(('127.0.0.1', port), functools.partial(Handler, directory=str(root)))
            break
        except OSError:
            continue
    else:
        raise SystemExit('Ports 8000–8010 are busy. Close an older copy and try again.')
    url = f'http://127.0.0.1:{port}'
    print(f'\nHFS — Hand Flight Simulator: {url}\nKeep this window open. Press Ctrl+C to stop.\n', flush=True)
    threading.Timer(.5, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
