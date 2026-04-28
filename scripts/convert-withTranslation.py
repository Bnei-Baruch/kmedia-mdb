#!/usr/bin/env python3
"""Convert withTranslation HOC to useTranslation hook in functional components."""

import re
import os
import glob


def remove_t_from_params(params):
    """Remove 't' from a destructured params string (content inside { })."""
    # Only t
    if re.match(r'^\s*t\s*$', params):
        return ''
    # t, rest
    p = re.sub(r'^(\s*)t\s*,\s*', r'\1', params)
    if p != params:
        return p.rstrip()
    # rest, t
    p = re.sub(r',\s*t\s*$', '', params)
    if p != params:
        return p.rstrip()
    # rest, t, more
    p = re.sub(r',\s*t\s*,', ',', params)
    return p.rstrip()


def get_body_indent(lines, next_idx):
    """Get indentation from the next non-empty line."""
    for j in range(next_idx, min(next_idx + 5, len(lines))):
        if lines[j].strip():
            n = len(lines[j]) - len(lines[j].lstrip())
            return ' ' * n
    return '  '


def add_hook_to_component(content, comp_name):
    """Find component function, remove t from params, insert useTranslation hook."""
    lines = content.split('\n')
    result = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # ── Case A: single-line params, block body ────────────────────────────
        # const Name = ({ t, a }) => {
        # const Name = ({ t, a }) => { ... }  (everything on one line)
        m = re.match(
            r'^(\s*const\s+' + re.escape(comp_name) + r'\s*=\s*)\((\{[^{}]*\})\)(\s*=>\s*)(\{.*)',
            line
        )
        if m:
            prefix, raw_params, arrow, rest = m.groups()
            params = remove_t_from_params(raw_params[1:-1])  # strip { }
            new_params = f'({{ {params} }})' if params.strip() else '()'
            indent = get_body_indent(lines, i + 1)
            # Insert hook right after the opening {
            brace_idx = rest.find('{')
            new_line = (prefix + new_params + arrow
                        + rest[:brace_idx + 1]
                        + f'\n{indent}const {{ t }} = useTranslation();'
                        + rest[brace_idx + 1:])
            result.append(new_line)
            i += 1
            continue

        # ── Case B: single-line params, expression body ───────────────────────
        # const Name = ({ t }) => (
        m = re.match(
            r'^(\s*const\s+' + re.escape(comp_name) + r'\s*=\s*)\((\{[^{}]*\})\)(\s*=>\s*)(\(.*)',
            line
        )
        if m:
            prefix, raw_params, arrow, rest = m.groups()
            params = remove_t_from_params(raw_params[1:-1])
            new_params = f'({{ {params} }})' if params.strip() else '()'
            indent = '  '
            # Convert to block body
            new_line = (prefix + new_params + arrow.rstrip()
                        + f' {{\n{indent}const {{ t }} = useTranslation();\n{indent}return '
                        + rest.lstrip())
            result.append(new_line)
            i += 1
            # Find the closing ) of the expression body and add };
            paren_depth = rest.count('(') - rest.count(')')
            while i < len(lines):
                cl = lines[i]
                paren_depth += cl.count('(') - cl.count(')')
                if paren_depth <= 0:
                    result.append(cl)
                    result.append('};')
                    i += 1
                    break
                result.append(cl)
                i += 1
            continue

        # ── Case C: multiline params starting with ({: const Name = ({  ───────
        # const Name = ({
        #   t,
        #   a,
        # }) => {
        m = re.match(r'^\s*const\s+' + re.escape(comp_name) + r'\s*=\s*\(\{', line)
        if m and '=>' not in line:
            result.append(line)
            i += 1
            while i < len(lines):
                cl = lines[i]
                # Remove t param line (e.g., "  t," or "  t")
                if re.match(r'^\s*t\s*,?\s*$', cl):
                    # Also clean trailing comma from previous line if this was last
                    if result and re.search(r',\s*$', result[-1]):
                        # Check if next non-t line is the closing
                        j = i + 1
                        while j < len(lines) and re.match(r'^\s*t\s*,?\s*$', lines[j]):
                            j += 1
                        if j < len(lines) and re.match(r'\s*\}\)', lines[j]):
                            # t was the last param — strip trailing comma from prev line
                            result[-1] = re.sub(r',\s*$', '', result[-1])
                    i += 1
                    continue
                # Closing }) => { line
                if re.match(r'\s*\}\)\s*=>', cl):
                    result.append(cl)
                    body_match = re.search(r'=>\s*\{', cl)
                    if body_match:
                        indent = get_body_indent(lines, i + 1)
                        result.append(f'{indent}const {{ t }} = useTranslation();')
                    i += 1
                    break
                result.append(cl)
                i += 1
            continue

        # ── Case D: multiline params with outer paren: const Name = (  ────────
        # const Name = (
        #   {
        #     t,
        #     a,
        #   }
        # ) => {
        m = re.match(r'^\s*const\s+' + re.escape(comp_name) + r'\s*=\s*\(\s*$', line)
        if m:
            result.append(line)
            i += 1
            while i < len(lines):
                cl = lines[i]
                # Remove t param line
                if re.match(r'^\s*t\s*,?\s*$', cl):
                    if result and re.search(r',\s*$', result[-1]):
                        j = i + 1
                        while j < len(lines) and re.match(r'^\s*t\s*,?\s*$', lines[j]):
                            j += 1
                        if j < len(lines) and re.match(r'\s*\}', lines[j]):
                            result[-1] = re.sub(r',\s*$', '', result[-1])
                    i += 1
                    continue
                # Closing ) => { line
                if re.match(r'\s*\)\s*=>', cl):
                    result.append(cl)
                    body_match = re.search(r'=>\s*\{', cl)
                    if body_match:
                        indent = get_body_indent(lines, i + 1)
                        result.append(f'{indent}const {{ t }} = useTranslation();')
                    i += 1
                    break
                result.append(cl)
                i += 1
            continue

        # ── Case E: function declaration ─────────────────────────────────────
        # function Name({ t, a }) {
        m = re.match(
            r'^(\s*function\s+' + re.escape(comp_name) + r'\s*\()(\{[^{}]*\})(\)\s*\{)',
            line
        )
        if m:
            prefix, raw_params, suffix = m.groups()
            params = remove_t_from_params(raw_params[1:-1])
            if params.strip():
                new_params = f'{{ {params} }}'
                new_line = f'{prefix}{new_params}{suffix}'
            else:
                new_line = f'{prefix[:-1]}){suffix[1:]}'  # function Name() {
            indent = get_body_indent(lines, i + 1)
            result.append(new_line)
            result.append(f'{indent}const {{ t }} = useTranslation();')
            i += 1
            continue

        result.append(line)
        i += 1

    return '\n'.join(result)


def handle_inline_wrap(content, comp_name):
    """Handle: const X = useTranslation()(\n  ({ t }) => {\n    ...\n  }\n);"""
    lines = content.split('\n')
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Match: const X = useTranslation()(
        m = re.match(r'^(\s*)const\s+' + re.escape(comp_name) + r'\s*=\s*useTranslation\(\)\(\s*$', line)
        if m:
            outer_indent = m.group(1)
            i += 1
            # Next line should be: ({ t, ... }) => {
            while i < len(lines):
                inner = lines[i]
                arrow_m = re.match(r'\s*\(\{([^}]*)\}\)\s*=>\s*\{', inner)
                if arrow_m:
                    params = remove_t_from_params(arrow_m.group(1))
                    inner_indent = get_body_indent(lines, i + 1)
                    new_params = f'({{ {params} }})' if params.strip() else '()'
                    result.append(f'{outer_indent}const {comp_name} = {new_params} => {{')
                    result.append(f'{inner_indent}const {{ t }} = useTranslation();')
                    i += 1
                    break
                i += 1
            # Collect body until depth 0, then skip the ); closing line
            depth = 1
            while i < len(lines) and depth > 0:
                cl = lines[i]
                depth += cl.count('{') - cl.count('}')
                if depth == 0:
                    result.append(cl)  # closing }
                    i += 1
                    # Skip ); that closes useTranslation()(
                    if i < len(lines) and re.match(r'\s*\);\s*$', lines[i]):
                        i += 1
                    break
                result.append(cl)
                i += 1
        else:
            result.append(line)
            i += 1
    return '\n'.join(result)


def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'withTranslation' not in content:
        return False

    # Skip class components
    if re.search(r'\bclass\s+\w+\s+extends\s+\w*Component', content):
        print('  SKIP (class component)')
        return False

    original = content

    # ── 1. Fix import ──────────────────────────────────────────────────────────
    content = re.sub(r'\bwithTranslation\b', 'useTranslation', content)
    # Deduplicate: useTranslation, useTranslation → useTranslation
    content = re.sub(r'\buseTranslation\s*,\s*useTranslation\b', 'useTranslation', content)

    # ── 2. Fix export ──────────────────────────────────────────────────────────
    content = re.sub(
        r'export default React\.memo\(useTranslation\(\)\((\w+)\),\s*(\w+)\);',
        r'export default React.memo(\1, \2);',
        content
    )
    content = re.sub(
        r'export default useTranslation\(\)\((withRouter\(\w+\))\);',
        r'export default \1;',
        content
    )
    content = re.sub(
        r'export default useTranslation\(\)\((\w+)\);',
        r'export default \1;',
        content
    )

    # ── 3. Remove t from PropTypes ─────────────────────────────────────────────
    content = re.sub(r'\n[ \t]*t\s*:\s*PropTypes\.func\.isRequired,?\n', '\n', content)

    # ── 4. Handle inline wrap: const X = useTranslation()( ... ) ──────────────
    inline_match = re.search(r'const\s+(\w+)\s*=\s*useTranslation\(\)\(', content)
    if inline_match:
        comp_name = inline_match.group(1)
        content = handle_inline_wrap(content, comp_name)

    # ── 5. Add hook to component function ─────────────────────────────────────
    export_match = re.search(
        r'export default (?:React\.memo\()?(?:withRouter\()?(\w+)',
        content
    )
    if export_match:
        comp_name = export_match.group(1)
        content = add_hook_to_component(content, comp_name)

    # ── 6. Clean up empty PropTypes / unused PropTypes import ─────────────────
    content = re.sub(r'\n\w+\.propTypes\s*=\s*\{\s*\};\n', '\n', content)
    content = re.sub(r'\n\w+\.defaultProps\s*=\s*\{\s*\};\n', '\n', content)
    if 'PropTypes' not in re.sub(r'import[^\n]*PropTypes[^\n]*\n', '', content):
        content = re.sub(r"import PropTypes from 'prop-types';\n", '', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False


def main():
    src_dir = '/Users/davgur/WebstormProjects/kmedia-mdb/src'
    files = sorted(glob.glob(f'{src_dir}/**/*.js', recursive=True))

    converted = []
    skipped = []
    errors = []

    for filepath in files:
        try:
            with open(filepath, encoding='utf-8') as f:
                src = f.read()
        except Exception:
            continue

        if 'withTranslation' not in src:
            continue

        rel = os.path.relpath(filepath, src_dir)
        print(f'Processing: {rel}')
        try:
            ok = process_file(filepath)
            if ok:
                converted.append(rel)
                print('  -> CONVERTED')
            else:
                skipped.append(rel)
        except Exception as e:
            import traceback
            print(f'  -> ERROR: {e}')
            traceback.print_exc()
            errors.append((rel, str(e)))

    print(f'\nConverted: {len(converted)}  Skipped: {len(skipped)}  Errors: {len(errors)}')
    if errors:
        print('\nErrors:')
        for f, e in errors:
            print(f'  {f}: {e}')
    if skipped:
        print('\nSkipped (class components or no changes):')
        for f in skipped:
            print(f'  {f}')


if __name__ == '__main__':
    main()
