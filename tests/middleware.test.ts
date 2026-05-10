import { NextRequest } from "next/server";
import { middleware } from "../middleware";

function makeRequest(pathname: string, cookie?: string) {
  return new NextRequest(new URL(`https://attendx.local${pathname}`), {
    headers: cookie ? new Headers({ cookie }) : undefined,
  });
}

describe("middleware access boundaries", () => {
  it("redirects anonymous user from protected route", () => {
    const response = middleware(makeRequest("/dashboard"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://attendx.local/sign-in");
  });

  it("allows authenticated user route", () => {
    const response = middleware(
      makeRequest("/dashboard", "attendx_user_id=user_1; attendx_role=USER"),
    );
    expect(response.status).toBe(200);
  });

  it("redirects non-admin from admin route", () => {
    const response = middleware(
      makeRequest("/admin/dashboard", "attendx_user_id=user_1; attendx_role=USER"),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://attendx.local/dashboard");
  });
});
