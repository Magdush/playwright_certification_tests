import { test, expect, APIRequestContext } from "@playwright/test";
import accountsData from "../../src/assets/data/acountData.json";
import { LoginPage } from "../../src/login_page.ts";
import { AccountsAPI } from "../../src/api/new_account_api.ts";
import { faker, Faker } from "@faker-js/faker";
import { UserLoginAPI } from "../../src/api/user_login.api.ts";

test.describe("Data Driven – account balances", () => {
  accountsData.forEach((account) => {
    test(`Balance verification: ${account.balance}`, async ({
      page,
      request,
    }) => {
      // Data pro vytvoření usera
      const username = faker.internet.username().toLowerCase();
      const password = faker.internet.password({ length: 10 });
      const email = faker.internet.email().toLowerCase();

      // Registrace přes Frontend
      await page.goto(
        "https://tegb-frontend-88542200c6db.herokuapp.com/register"
      );

      await page.locator("[data-testid='username-input']").fill(username);
      await page.locator("[data-testid='password-input']").fill(password);
      await page.locator("[data-testid='email-input']").fill(email);

      const [registerResponse] = await Promise.all([
        page.waitForResponse(
          (r) =>
            r.url().includes("/register") &&
            r.request().method() === "POST" &&
            r.ok()
        ),
        page.locator("[data-testid='submit-button']").click(),
      ]);

      expect(registerResponse.ok()).toBeTruthy();

      //Přihlášení přes API
      const loginApi = new UserLoginAPI(request);
      const apiLoginResponse = await loginApi.loginUser(username, password);

      expect(apiLoginResponse.ok()).toBeTruthy();
      const { access_token: token } = await apiLoginResponse.json();
      expect(token).toBeTruthy();

      // Vytvoření účtu přes API
      const accountsApi = new AccountsAPI(request);
      await accountsApi.createAccount(
        token,
        account.balance,
        account.accountType
      );

      //
      const loginPage = new LoginPage(page);
      await loginPage.open();
      await loginPage.fillUsername(username);
      await loginPage.fillPassword(password);

      await Promise.all([
        page.waitForResponse(
          (r) =>
            r.url().endsWith("/login") &&
            r.request().method() === "POST" &&
            r.status() === 201
        ),
        loginPage.clickLogin(),
      ]);

      // čekání na načtení účtů
      await expect(page.getByText("Načítám účty")).toBeHidden();

      // ověření zůstatku na frontendu
      const balanceText = await page
        .locator("table tr")
        .last()
        .locator("td")
        .nth(1)
        .textContent();

      await expect(
        page.locator("table tr").last().locator("td").nth(1)
      ).toContainText(account.balance.toString());
    });
  });
});
