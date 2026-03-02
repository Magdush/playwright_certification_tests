import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/login_page.ts";
import { DashboardPage } from "../../src/dashboard_page.ts";

test.describe("Atomic test – Dashboard structure", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.fillUsername("test_user");
    await loginPage.fillPassword("tester1");
    await loginPage.clickLogin();

    await expect(page).toHaveURL(
      "https://tegb-frontend-88542200c6db.herokuapp.com/dashboard"
    );
  });

  test("Dashboard has all required structural elements", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await test.step("Profile information is visible", async () => {
      await expect.soft(dashboardPage.profileNameDisplay).toBeVisible();
      await expect.soft(dashboardPage.profileSurnameDisplay).toBeVisible();
      await expect.soft(dashboardPage.profileEmailDisplay).toBeVisible();
      await expect.soft(dashboardPage.profilePhoneDisplay).toBeVisible();
      await expect.soft(dashboardPage.profileAgeDisplay).toBeVisible();
    });

    await test.step("Account information is visible", async () => {
      await expect.soft(dashboardPage.accountNumberDisplay).toBeVisible();
      await expect.soft(dashboardPage.accountBalanceDisplay).toBeVisible();
      await expect.soft(dashboardPage.accountTypeDisplay).toBeVisible();
    });

    await test.step("Dashboard navigation menu is visible", async () => {
      await expect
        .soft(dashboardPage.dasboardHomeDisplay)
        .toContainText("Domů");
      await expect
        .soft(dashboardPage.dashboardAccountsDisplay)
        .toContainText("Účty");
      await expect
        .soft(dashboardPage.dashboardTransfersDisplay)
        .toContainText("Transakce");
      await expect
        .soft(dashboardPage.dashboardHelpsDisplay)
        .toContainText("Podpora");
    });

    await test.step("Dashboard header elements are visible", async () => {
      await expect.soft(dashboardPage.dashboardLogoDisplay).toBeVisible();
      await expect.soft(dashboardPage.dashboardLogoutButton).toBeVisible();
    });
  });
});
