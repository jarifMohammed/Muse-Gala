import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const useGetOverdueSummary = (accessToken: string) => {
    return useQuery({
        queryKey: ['overdue-summary'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/v1/return/admin/overdue-summary`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) throw new Error('Failed to fetch overdue summary');
            const json = await res.json();
            return json.data;
        },
        enabled: !!accessToken,
    });
};

export const useGetReturnsAttention = (accessToken: string, page: number = 1, limit: number = 20) => {
    return useQuery({
        queryKey: ['returns-attention', page, limit],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/v1/return/admin/attention?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) throw new Error('Failed to fetch returns requiring attention');
            const json = await res.json();
            return json.data;
        },
        enabled: !!accessToken,
    });
};

export const resendReturnLink = async (accessToken: string, bookingId: string) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/return/generate-link/${bookingId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!res.ok) throw new Error('Failed to generate return link');
    return res.json();
};

export const approveCharge = async (
    accessToken: string,
    bookingId: string,
    data: { feeType: string; amount: number; adminNotes?: string }
) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/return/admin/approve-charge/${bookingId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to approve charge');
    return res.json();
};
