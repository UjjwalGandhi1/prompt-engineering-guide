from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Load the page
        page.goto("http://localhost:8000")

        # 2. Verify Search
        page.fill("#search-input", "Chain-of-Thought")
        page.wait_for_selector(".technique-card") # Wait for results
        page.screenshot(path="verification/search_results.png")
        print("Search verified.")

        # Clear search
        page.fill("#search-input", "")
        page.keyboard.press("Enter") # Trigger search reset if needed, or input event
        page.wait_for_timeout(500) # Wait for re-render

        # 3. Verify Favorites
        # Click the heart on the first card
        page.click(".technique-card button")
        # Click Favorites in Nav
        page.click("text=Favorites")
        page.wait_for_timeout(500)
        page.screenshot(path="verification/favorites.png")
        print("Favorites verified.")

        # 4. Verify Quiz
        page.click("text=Quiz Mode")
        page.wait_for_selector("#quiz-modal:not(.hidden)")
        page.screenshot(path="verification/quiz.png")
        print("Quiz verified.")

        # 5. Verify Playground
        # Close quiz
        page.click("#close-quiz-modal")
        # Go back to home
        page.click("text=Foundational Techniques")
        # Open details
        page.click(".technique-card >> nth=0")
        page.wait_for_selector("#simulation-modal:not(.hidden)")

        # Edit prompt
        page.fill("#example-prompt", "This is an edited prompt.")
        page.screenshot(path="verification/playground.png")
        print("Playground verified.")

        browser.close()

if __name__ == "__main__":
    verify_app()
