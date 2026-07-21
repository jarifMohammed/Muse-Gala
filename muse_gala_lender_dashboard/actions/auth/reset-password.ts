"use server";

export async function resetPasswordAction(email: string, newPassword: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/reset-password`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            }
        );

        const json = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: json?.message || "Failed to reset password. Please try again.",
            };
        }

        return { success: true, message: json?.message || "Password reset successfully." };
    } catch {
        return { success: false, message: "Network error. Please try again." };
    }
}
