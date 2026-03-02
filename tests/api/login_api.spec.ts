import { test, expect } from "@playwright/test";
import { UserLoginAPI } from "../../src/api/user_login.api.ts";

test("API Login ", async ({ request }) => {
  const loginApi = new UserLoginAPI(request);

  const response = await loginApi.loginUser("test_user", "tester1");

  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty("access_token");
  expect(responseBody.access_token).toBeTruthy();
});
