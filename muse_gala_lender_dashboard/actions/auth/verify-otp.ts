"use server";

export async function verifyOtpAction(email: string, code: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify-code`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: code }),
            }
        );

        const json = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: json?.message || "Invalid OTP. Please try again.",
            };
        }

        return { success: true, message: json?.message || "OTP verified successfully." };
    } catch {
        return { success: false, message: "Network error. Please try again." };
    }
}
