from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 720})
    page = context.new_page()

    try:
        # Navigate to home page
        page.goto("http://localhost:5173/")

        # Wait for something else to load, e.g. 'body'
        page.wait_for_selector("body")

        # Take screenshot of whatever loaded
        page.screenshot(path="verification_debug.png")
        print("Debug screenshot saved.")

        # Check if canvas exists
        if page.locator("canvas").count() > 0:
            print("Canvas found in DOM.")
        else:
            print("Canvas NOT found in DOM.")
            # Print HTML for debugging
            print(page.content())

    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
