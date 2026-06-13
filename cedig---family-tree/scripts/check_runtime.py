from playwright.sync_api import sync_playwright
import os, json

url = 'http://localhost:3456'
OUT = 'C:\\Users\\G15\\AppData\\Local\\Temp\\opencode'
os.makedirs(OUT, exist_ok=True)

console_logs = []
page_errors = []

def log(msg):
    console_logs.append(msg)
    print(msg)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-setuid-sandbox'])
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})

    def handle_console(msg):
        text = msg.text
        t = msg.type
        log(f"[{t}] {text}")
        if t == 'error':
            try:
                stack = msg.stack_trace
                for frame in stack[:5]:
                    log(f"  at {frame.url}:{frame.line_number}:{frame.column_number}")
            except:
                pass

    def handle_page_error(err):
        page_errors.append(str(err))
        log(f"[PAGE_ERROR] {err}")

    page.on("console", handle_console)
    page.on("pageerror", handle_page_error)

    # Navigate
    page.goto(url, wait_until='domcontentloaded', timeout=30000)
    page.wait_for_load_state('networkidle', timeout=30000)
    page.wait_for_timeout(2000)
    log("[INFO] Page loaded")

    # Login flow
    for text in ['Demo үзэх']:
        btn = page.get_by_text(text, exact=False)
        if btn.count() > 0 and btn.first.is_visible():
            btn.first.click()
            page.wait_for_timeout(3000)
            break

    # Fill login
    inputs = page.locator('input')
    inputs.nth(0).fill('test@cedig.mn')
    inputs.nth(1).fill('test123')
    
    login_btn = page.get_by_text('Нэвтрэх')
    login_btn.first.click()
    page.wait_for_timeout(3000)
    log("[INFO] Logged in - on onboarding screen")

    page.screenshot(path=os.path.join(OUT, '04-onboarding.png'), full_page=True)

    # Click "Жишээ мод ачааллах" (Load Example Tree) to go directly to workspace
    for text in ['Жишээ мод ачааллах', 'Жишээ']:
        try:
            btn = page.get_by_text(text, exact=False)
            if btn.count() > 0 and btn.first.is_visible():
                log(f"[INFO] Clicking '{text}'")
                btn.first.click()
                page.wait_for_timeout(5000)
                page.screenshot(path=os.path.join(OUT, '05-workspace.png'), full_page=True)
                break
        except Exception as e:
            log(f"[INFO] Error clicking '{text}': {e}")

    # Check if we're in the workspace now
    try:
        text = page.inner_text('body')
        log(f"[INFO] Workspace body text: {text[:600]}")
    except:
        pass

    # Look for tree elements
    for sel in ['[class*="react-flow"]', '.react-flow__node', '[class*="node"]', 'foreignObject']:
        try:
            el = page.locator(sel)
            cnt = el.count()
            if cnt > 0:
                log(f"[INFO] '{sel}': {cnt} found, first visible? {el.first.is_visible() if cnt > 0 else 'N/A'}")
        except:
            pass

    # Look for tree nodes that we can click
    page.wait_for_timeout(3000)
    page.screenshot(path=os.path.join(OUT, '06-tree.png'), full_page=True)

    # Try clicking various tree elements
    for sel in ['foreignObject', '.react-flow__node', 'g[class*="node"]', '[class*="person"]', 'circle']:
        try:
            items = page.locator(sel)
            for i in range(min(items.count(), 10)):
                it = items.nth(i)
                if it.is_visible():
                    log(f"[INFO] Clicking {sel} #{i} (visible)")
                    try:
                        it.click()
                        page.wait_for_timeout(3000)
                        page.screenshot(path=os.path.join(OUT, f'07-click-{sel}-{i}.png'), full_page=True)
                        
                        # Check for modals
                        for ms in ['#book-modal-portal', '.fixed.inset-0', '[class*="modal"]']:
                            m = page.locator(ms)
                            if m.count() > 0 and m.first.is_visible():
                                log(f"[INFO] MODAL OPENED! Found: {ms}")
                                page.wait_for_timeout(5000)
                                page.screenshot(path=os.path.join(OUT, f'08-modal-{sel}-{i}.png'), full_page=True)
                                
                                # Check book content
                                book_text = page.inner_text('#book-modal-portal') if page.locator('#book-modal-portal').count() > 0 else 'no book portal'
                                log(f"[INFO] Modal text: {book_text[:300]}")
                                
                                # Check for any errors inside modal
                                mod_html = page.locator('#book-modal-portal').first.inner_html() if page.locator('#book-modal-portal').count() > 0 else ''
                                if 'opacity-0' in mod_html:
                                    log("[INFO] WARNING: Book container has opacity-0 (not ready)")
                                if 'opacity-100' in mod_html:
                                    log("[INFO] Book container has opacity-100 (ready)")
                                break
                    except Exception as ex:
                        log(f"[INFO] Click error: {ex}")
                    break
        except Exception as e:
            log(f"[INFO] Error with {sel}: {e}")

    page.screenshot(path=os.path.join(OUT, '99-final.png'), full_page=True)
    browser.close()

result = {'console_logs': console_logs, 'page_errors': page_errors}
with open(os.path.join(OUT, 'runtime_results5.json'), 'w', encoding='utf-8') as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

log(f"\n=== SUMMARY ===")
log(f"Console messages: {len(console_logs)}")
log(f"Page errors: {len(page_errors)}")
for err in page_errors:
    log(f"  ERROR: {err}")
