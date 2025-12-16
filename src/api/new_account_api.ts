import { APIRequestContext } from "@playwright/test";

export class AccountsAPI {
  private readonly request: APIRequestContext;
  private readonly createAccountUrl =
    "https://tegb-backend-877a0b063d29.herokuapp.com/tegb/accounts/create";

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createAccount(token: string, startBalance: number, type: string) {
    return await this.request.post(this.createAccountUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        startBalance,
        type,
      },
    });
  }
}
