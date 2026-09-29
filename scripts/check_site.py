#!/usr/bin/env python3
"""Check published HTML and CSS references using only Python's standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
SKIP = {'.git', '_archive', '_site', '.venv'}


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.refs, self.ids, self.errors = path, [], set(), []
        self.title = self.lang = self.redirect = False
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            if attrs['id'] in self.ids:
                self.errors.append(f'duplicate id: {attrs["id"]}')
            self.ids.add(attrs['id'])
        if tag == 'html':
            self.lang = bool(attrs.get('lang'))
        if tag == 'title':
            self.title = True
        if tag == 'meta' and attrs.get('http-equiv', '').lower() == 'refresh':
            self.redirect = True
            match = re.search(r'url=(.+)', attrs.get('content', ''), re.I)
            if match:
                self.refs.append(match[1].strip())
        for key in ('href', 'src'):
            if key in attrs:
                self.refs.append(attrs[key])


def published(path):
    return not any(part in SKIP for part in path.relative_to(ROOT).parts)


def check():
    pages = {p.resolve(): Page(p) for p in ROOT.rglob('*.html') if published(p)}
    errors = []
    refs = []
    for path, page in pages.items():
        errors.extend(f'{path.relative_to(ROOT)}: {e}' for e in page.errors)
        if not page.lang or not page.title:
            errors.append(f'{path.relative_to(ROOT)}: missing language or title')
        refs.extend((path, ref) for ref in page.refs)
    for path in (ROOT / 'assets/css').glob('*.css'):
        # Includes fonts, backgrounds, and CSS @imports.
        refs.extend((path, m.group(2).strip()) for m in
                    re.finditer(r'url\(\s*([\'"]?)(.*?)\1\s*\)', path.read_text()))
    for source, ref in refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc:
            continue
        if not ref or ref == '#':
            errors.append(f'{source.relative_to(ROOT)}: empty placeholder link')
            continue
        target = ((ROOT / unquote(url.path).lstrip('/')) if url.path.startswith('/')
                  else (source.parent / unquote(url.path)) if url.path else source).resolve()
        if target.is_dir():
            target /= 'index.html'
        if not target.is_relative_to(ROOT) or not target.exists() or not published(target):
            errors.append(f'{source.relative_to(ROOT)}: missing/excluded target {ref}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{source.relative_to(ROOT)}: missing anchor {ref}')
        elif source in pages and pages[source].redirect and target == source:
            errors.append(f'{source.relative_to(ROOT)}: redirect points to itself')
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        return 1
    print(f'OK: {len(pages)} HTML pages and {len(refs)} references checked; no broken local links.')
    return 0


if __name__ == '__main__':
    sys.exit(check())
