from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 720})
    page = context.new_page()

    try:
        # Navigate to login page which likely renders Layout
        page.goto("http://localhost:5173/login")

        # Wait for canvas to be present
        canvas = page.locator("canvas")
        canvas.wait_for(state="visible", timeout=10000)

        # Take screenshot
        page.screenshot(path="verification_particles.png")
        print("Screenshot saved to verification_particles.png")

    except Exception as e:
        print(f"Error: {e}")
        # Debug screenshot
        page.screenshot(path="verification_error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
