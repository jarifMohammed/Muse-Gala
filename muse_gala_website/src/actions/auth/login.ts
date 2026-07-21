"use server";

import { signIn } from "@/auth";
import { loginformSchema, LoginFormValues } from "@/schemas/auth";
import { cookies } from "next/headers";

export async function loginAction(data: LoginFormValues) {
  const { success, data: parsedData, error } = loginformSchema.safeParse(data);

  if (!success) {
    return {
      success: false,
      message: error.message,
    };
  }

  try {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/auth/login";

    const res = await fetch(`${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: parsedData.email,
        password: parsedData.password,
      }),
    });

    const response = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: response.message || "Login failed",
      };
    }

    await signIn("credentials", {
      email: parsedData.email,
      password: parsedData.password,
      redirect: false,
    });

    return {
      success: true,
      message: "Login successful",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message ?? "Something went wrong!",
    };
  }
}

/**
 * A reusable server action to manage "Remember Me" cookies.
 *
 * @param {boolean} rememberMe - Whether the user wants to be remembered.
 * @param {string | undefined} email - The email to store in the cookie (optional if deleting).
 * @param {string | undefined} password - The password to store in the cookie (optional if deleting).
 */
export async function manageRememberMeCookies(
  rememberMe: boolean,
  email?: string,
  password?: string
) {
  const cookieOptions = {
    sameSite: "strict" as const, // Prevents the cookie from being sent with cross-site requests
    maxAge: 2592000, // Expires after 30 days (in seconds)
  };

  if (rememberMe && email && password) {
    // Set the "rememberMeEmail" and "rememberMePassword" cookies
    (await cookies()).set({
      name: "rememberMeEmail",
      value: email,
      ...cookieOptions,
    });
    (await cookies()).set({
      name: "rememberMePassword",
      value: password,
      ...cookieOptions,
    });
  } else {
    // Delete the "rememberMeEmail" and "rememberMePassword" cookies
    (await cookies()).delete("rememberMeEmail");
    (await cookies()).delete("rememberMePassword");
  }
}
