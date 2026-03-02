import { APIRequestContext } from "@playwright/test";

export class UserLoginAPI {
  private readonly request: APIRequestContext;
  private readonly loginUrl =
    "https://tegb-backend-877a0b063d29.herokuapp.com/tegb/login";

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async loginUser(username: string, password: string) {
    return await this.request.post(this.loginUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username,
        password,
      },
    });
  }
}
