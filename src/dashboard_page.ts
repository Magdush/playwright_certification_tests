import { Page, expect, Locator } from "@playwright/test";
import { LoginPage } from "./login_page.ts";

export class DashboardPage {
  readonly page: Page;
  readonly changeProfileButton: Locator;
  readonly changeProfileNameInput: Locator;
  readonly changeProfileSurnameInput: Locator;
  readonly changeProfileEmailInput: Locator;
  readonly changeProfilePhoneInpput: Locator;
  readonly changeProfileAgeInput: Locator;
  readonly changeProfileSubmitButton: Locator;
  readonly profileNameDisplay: Locator;
  readonly profileSurnameDisplay: Locator;
  readonly profileEmailDisplay: Locator;
  readonly profilePhoneDisplay: Locator;
  readonly profileAgeDisplay: Locator;
  readonly accountNumberDisplay: Locator;
  readonly accountBalanceDisplay: Locator;
  readonly accountTypeDisplay: Locator;
  readonly dasboardHomeDisplay: Locator;
  readonly dashboardAccountsDisplay: Locator;
  readonly dashboardTransfersDisplay: Locator;
  readonly dashboardHelpsDisplay: Locator;
  readonly dashboardLogoDisplay: Locator;
  readonly dashboardLogoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.changeProfileButton = page.locator(
      "button[data-testid='toggle-edit-profile-button']"
    );
    this.changeProfileNameInput = page.locator(
      "input[data-testid='chage-name-input']"
    );
    this.changeProfileSurnameInput = page.locator(
      "input[data-testid='chage-surname-input']"
    );
    this.changeProfileEmailInput = page.locator(
      "input[data-testid='chage-email-input']"
    );
    this.changeProfilePhoneInpput = page.locator(
      "input[data-testid='chage-phone-input']"
    );
    this.changeProfileAgeInput = page.locator(
      "input[data-testid='chage-age-input']"
    );
    this.changeProfileSubmitButton = page.locator(
      "button[data-testid='save-changes-button']"
    );
    this.profileNameDisplay = page.locator("div[data-testid='name']");
    this.profileSurnameDisplay = page.locator("div[data-testid='surname']");
    this.profileEmailDisplay = page.locator("div[data-testid='email']");
    this.profilePhoneDisplay = page.locator("div[data-testid='phone']");
    this.profileAgeDisplay = page.locator("div[data-testid='age']");

    this.accountNumberDisplay = page.locator(
      "td[data-testid='account-number']"
    );
    this.accountBalanceDisplay = page.locator(
      "td[data-testid='account-balance']"
    );
    this.accountTypeDisplay = page.locator("td[data-testid='account-type']");
    this.dasboardHomeDisplay = page.locator("li:nth-child(1)");
    this.dashboardAccountsDisplay = page.locator("li:nth-child(2)");
    this.dashboardTransfersDisplay = page.locator("li:nth-child(3)");
    this.dashboardHelpsDisplay = page.locator("li:nth-child(4)");
    this.dashboardLogoDisplay = page.locator("img[data-testid='logo-img']");
    this.dashboardLogoutButton = page.locator(
      "button[data-testid='logout-button']"
    );
  }

  async clickChangeProfile() {
    await this.changeProfileButton.click();
    return this;
  }
  async fillChangeProfileName(name: string) {
    await this.changeProfileNameInput.fill(name);
    return this;
  }
  async fillChangeProfileSurname(surname: string) {
    await this.changeProfileSurnameInput.fill(surname);
    return this;
  }
  async fillChangeProfileEmail(email: string) {
    await this.changeProfileEmailInput.fill(email);
    return this;
  }
  async fillChangeProfilePhone(phone: string) {
    await this.changeProfilePhoneInpput.fill(phone);
    return this;
  }
  async fillChangeProfileAge(age: string) {
    await this.changeProfileAgeInput.fill(age);
    return this;
  }
  async clickChangeProfileSubmit() {
    await this.changeProfileSubmitButton.click();
    return this;
  }
  async logout() {
    await this.dashboardLogoutButton.click();
    const loginPage = new LoginPage(this.page);
    return loginPage;
  }
}
