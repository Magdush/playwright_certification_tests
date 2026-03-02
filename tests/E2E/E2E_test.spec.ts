import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { LoginPage } from "../../src/login_page.ts";
import { DashboardPage } from "../../src/dashboard_page.ts";
import { UserLoginAPI } from "../../src/api/user_login.api.ts";
import { AccountsAPI } from "../../src/api/new_account_api.ts";

test("E2E – Registration, API new account creation, change profile , profile changes check, logout", async ({
  page,
  request,
}) => {
  /* Testovací user */
  const username = faker.internet.username().toLowerCase();
  const password = faker.internet.password({ length: 10 });
  const email = faker.internet.email().toLowerCase();

  const profileData = {
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    phone: faker.number.int({ min: 100000000, max: 999999999 }).toString(),
    age: faker.number.int({ min: 18, max: 80 }).toString(),
  };

  /* registrace na Frontendu */
  await test.step("Register new user via frontend", async () => {
    await page.goto(
      "https://tegb-frontend-88542200c6db.herokuapp.com/register"
    );

    await page.locator("input[data-testid='username-input']").fill(username);
    await page.locator("input[data-testid='password-input']").fill(password);
    await page.locator("input[data-testid='email-input']").fill(email);

    const [registerResponse] = await Promise.all([
      page.waitForResponse(
        (response) => response.url().includes("/register") && response.ok()
      ),
      page.locator("button[data-testid='submit-button']").click(),
    ]);

    expect(registerResponse.ok()).toBeTruthy();
  });

  /* Přihlášení nově založeného usera */
  let token: string;

  await test.step("Login user via API and get token", async () => {
    const loginApi = new UserLoginAPI(request);
    const response = await loginApi.loginUser(username, password);

    expect(response.status()).toBe(201);
    const body = await response.json();

    token = body.access_token;
    expect(token).toBeTruthy();
  });

  /* Vytvoření bank.účtu pře API*/
  await test.step("Create bank account API", async () => {
    const accountsApi = new AccountsAPI(request);
    const response = await accountsApi.createAccount(token, 10000, "Test");

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchObject({
      accountType: "Test",
      balance: 10000,
      status: "Active",
    });
  });

  /* Přihlášení nově registrovaného usera */
  await test.step("Login with created user", async () => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.fillUsername(username);
    await loginPage.fillPassword(password);
    await loginPage.clickLogin();

    await expect(page).toHaveURL(
      "https://tegb-frontend-88542200c6db.herokuapp.com/dashboard"
    );
  });

  const dashboardPage = new DashboardPage(page);

  /* Vyplnění profilu*/
  await test.step("Change profile", async () => {
    await dashboardPage.clickChangeProfile();
    await dashboardPage.fillChangeProfileName(profileData.name);
    await dashboardPage.fillChangeProfileSurname(profileData.surname);
    await dashboardPage.fillChangeProfileEmail(profileData.email);
    await dashboardPage.fillChangeProfilePhone(profileData.phone);
    await dashboardPage.fillChangeProfileAge(profileData.age);
    await dashboardPage.clickChangeProfileSubmit();
  });

  /* Ověření změn v profilu */
  await test.step("Profile check changes", async () => {
    await expect(dashboardPage.profileNameDisplay).toContainText(
      profileData.name
    );
    await expect(dashboardPage.profileSurnameDisplay).toContainText(
      profileData.surname
    );
    await expect(dashboardPage.profileEmailDisplay).toContainText(
      profileData.email
    );
    await expect(dashboardPage.profilePhoneDisplay).toContainText(
      profileData.phone
    );
    await expect(dashboardPage.profileAgeDisplay).toContainText(
      profileData.age
    );
  });

  /*Ověření bankovního účtu */
  await test.step("Bank account check", async () => {
    await expect(dashboardPage.accountNumberDisplay).toBeVisible();
    await expect(dashboardPage.accountBalanceDisplay).toContainText("10000.00");
    await expect(dashboardPage.accountTypeDisplay).toHaveText("Test");
  });

  /* Odhlášení */
  await test.step("Logout user", async () => {
    await dashboardPage.logout();
    await expect(page).toHaveURL(
      "https://tegb-frontend-88542200c6db.herokuapp.com"
    );
  });
});
