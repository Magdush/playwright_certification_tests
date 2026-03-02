import { expect, test } from "@playwright/test";
import { LoginPage } from "../../src/login_page.ts";

test("Profile visual test", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.fillUsername("test_user");
  await loginPage.fillPassword("tester1");
  await loginPage.clickLogin();

  await expect(page).toHaveURL(
    "https://tegb-frontend-88542200c6db.herokuapp.com/dashboard"
  );

  await expect(
    page.locator("div[data-testid='account-summary']")
  ).toHaveScreenshot("profile_test.png");
});
