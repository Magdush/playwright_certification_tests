import { Page, Locator } from "@playwright/test";
import { DashboardPage } from "./dashboard_page.ts";

export class LoginPage {
  readonly page: Page;
  readonly url = "https://tegb-frontend-88542200c6db.herokuapp.com";
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("input[data-testid='username-input']");
    this.passwordInput = page.locator("input[data-testid='password-input']");
    this.loginButton = page.locator("button[data-testid='submit-button']");
  }
  async open() {
    await this.page.goto(this.url);
    return this;
  }
  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }
  async clickLogin() {
    await this.loginButton.click();
    return new DashboardPage(this.page);
  }
}
