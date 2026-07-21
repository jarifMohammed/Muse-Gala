export interface ReturnData {
    _id: string; // token
    bookingId: string;
    customerName: string;
    customerEmail: string;
    dressName: string;
    brand: string;
    dressImage: string;
    returnDueDate: string;
    currentStatus: string;
    returnConfirmedAt: string | null;
    returnMethod: string | null;
    trackingNumber: string | null;
    returnMethods: string[];
}
