"use server";

export async function forgotPasswordAction(email: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/forget-password`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            }
        );

        const json = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: json?.message || "Failed to send OTP. Please try again.",
            };
        }

        return { success: true, message: json?.message || "OTP sent to your email." };
    } catch {
        return { success: false, message: "Network error. Please try again." };
    }
}
