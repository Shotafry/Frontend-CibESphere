from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    try:
        print("Navigating to /login...")
        response = page.goto("http://localhost:4173/login")
        print(f"Status: {response.status}")
        print(f"Title: {page.title()}")

        page.on("console", lambda msg: print(f"Console: {msg.text}"))

        # Wait a bit for JS to execute
        page.wait_for_timeout(2000)

        print("Waiting for canvas...")
        if page.locator("canvas").count() > 0:
            print("Canvas found.")
        else:
            print("Canvas NOT found.")
            # Print body to debug
            print("Body HTML:")
            print(page.inner_html("body")[:1000]) # First 1000 chars

        page.wait_for_selector("canvas", timeout=5000)

        page.screenshot(path="verification/particles.png")
        print("Screenshot taken.")
    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification/error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
