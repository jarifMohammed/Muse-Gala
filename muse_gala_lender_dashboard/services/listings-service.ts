import type {
  Dress,
  ConditionReport,
  AuditLogEntry,
  Booking,
} from "@/types/listings";

// Sample dress data
const dressesData: Dress[] = [
  {
    id: "DRESS001",
    name: "Dress Name 1",
    brand: "Zimmermann",
    price: "$8.99",
    numericPrice: 8.99,
    size: "XL",
    color: "Ivory",
    condition: "Good",
    status: true,
    image: "/elegant-dress.png",
    description:
      "Elegant silk gown with floral embroidery, perfect for formal events.",
    materials: "100% Silk",
    careInstructions: "Dry clean only",
    category: "Formal",
    dateAdded: "2025-04-01",
    lastUpdated: "2025-04-12",
    deliveryMethod: "Both",
    tags: ["Formal", "Summer"],
    pickupAddresses: [
      "123 Fashion Ln, Sydney NSW 2000",
      "456 Style St, Sydney NSW 2000",
    ],
    rentalPeriods: [
      { days: 4, price: 8.99 },
      { days: 8, price: 14.99 },
    ],
  },
  {
    id: "DRESS002",
    name: "Dress Name 2",
    brand: "Valentino",
    price: "$11.70",
    numericPrice: 11.7,
    size: "L",
    color: "Red",
    condition: "New",
    status: true,
    image: "/woman-in-red-dress.png",
    description: "Stunning red gown perfect for special occasions.",
    materials: "95% Polyester, 5% Elastane",
    careInstructions: "Hand wash cold",
    category: "Evening",
    dateAdded: "2025-04-05",
    lastUpdated: "2025-04-10",
    deliveryMethod: "Pickup",
    tags: ["Evening", "Party"],
    pickupAddresses: ["123 Fashion Ln, Sydney NSW 2000"],
    rentalPeriods: [
      { days: 4, price: 11.7 },
      { days: 8, price: 19.99 },
    ],
  },
  {
    id: "DRESS003",
    name: "Dress Name 3",
    brand: "Dior",
    price: "$14.81",
    numericPrice: 14.81,
    size: "S",
    color: "Black",
    condition: "Good",
    status: true,
    image: "/elegant-black-dress.png",
    description: "Classic black cocktail dress for any formal occasion.",
    materials: "70% Cotton, 30% Polyester",
    careInstructions: "Machine wash cold",
    category: "Cocktail",
    dateAdded: "2025-04-10",
    lastUpdated: "2025-04-15",
    deliveryMethod: "Shipping",
    tags: ["Cocktail", "Formal"],
    rentalPeriods: [
      { days: 4, price: 14.81 },
      { days: 8, price: 24.99 },
    ],
  },
  {
    id: "DRESS004",
    name: "Dress Name 4",
    brand: "Chanel",
    price: "$19.99",
    numericPrice: 19.99,
    size: "M",
    color: "Blue",
    condition: "Excellent",
    status: false,
    image: "/placeholder.svg?key=9n3vh",
    description: "Elegant blue evening gown with sequin details.",
    materials: "100% Polyester",
    careInstructions: "Dry clean only",
    category: "Evening",
    dateAdded: "2025-04-15",
    lastUpdated: "2025-04-20",
    deliveryMethod: "Both",
    tags: ["Evening", "Formal"],
    pickupAddresses: ["123 Fashion Ln, Sydney NSW 2000"],
    rentalPeriods: [
      { days: 4, price: 19.99 },
      { days: 8, price: 34.99 },
    ],
  },
  {
    id: "DRESS005",
    name: "Dress Name 5",
    brand: "Gucci",
    price: "$24.50",
    numericPrice: 24.5,
    size: "XS",
    color: "Green",
    condition: "Good",
    status: true,
    image: "/elegant-green-dress.png",
    description: "Stunning green gown with floral patterns.",
    materials: "80% Silk, 20% Cotton",
    careInstructions: "Dry clean only",
    category: "Formal",
    dateAdded: "2025-04-20",
    lastUpdated: "2025-04-25",
    deliveryMethod: "Pickup",
    tags: ["Formal", "Spring"],
    pickupAddresses: ["456 Style St, Sydney NSW 2000"],
    rentalPeriods: [
      { days: 4, price: 24.5 },
      { days: 8, price: 39.99 },
    ],
  },
];

// Sample condition reports
const conditionReportsData: Record<string, ConditionReport[]> = {
  DRESS001: [
    { date: "Apr 10, 2025", report: "Inspected, minor stain on hem." },
    { date: "Mar 15, 2025", report: "Inspected, good condition." },
  ],
  DRESS002: [
    { date: "Apr 12, 2025", report: "Brand new, tags attached." },
    {
      date: "Apr 5, 2025",
      report: "Received from supplier, excellent condition.",
    },
  ],
  DRESS003: [
    { date: "Apr 15, 2025", report: "Small tear repaired on left seam." },
    { date: "Mar 20, 2025", report: "Inspected, good condition." },
  ],
};

// Sample audit logs
const auditLogsData: Record<string, AuditLogEntry[]> = {
  DRESS001: [
    { date: "Apr 12, 2025", action: "Status changed to Active." },
    { date: "Apr 11, 2025", action: "Price updated to $8.99." },
    { date: "Apr 10, 2025", action: "Listing created." },
  ],
  DRESS002: [
    { date: "Apr 10, 2025", action: "Status changed to Active." },
    { date: "Apr 8, 2025", action: "Description updated." },
    { date: "Apr 5, 2025", action: "Listing created." },
  ],
  DRESS003: [
    { date: "Apr 15, 2025", action: "Price updated to $14.81." },
    { date: "Apr 12, 2025", action: "Images updated." },
    { date: "Apr 10, 2025", action: "Listing created." },
  ],
};

// Sample bookings
const bookingsData: Record<string, Booking[]> = {
  DRESS001: [
    {
      id: "BK10001",
      dressId: "DRESS001",
      customer: "Emma Thompson",
      customerId: "CUST001",
      date: "May 12-15, 2025",
      deliveryType: "Pickup",
    },
    {
      id: "BK10004",
      dressId: "DRESS001",
      customer: "Sophia Martinez",
      customerId: "CUST003",
      date: "Jun 5-8, 2025",
      deliveryType: "Shipping",
    },
  ],
  DRESS002: [
    {
      id: "BK10002",
      dressId: "DRESS002",
      customer: "Olivia Wilson",
      customerId: "CUST002",
      date: "May 18-21, 2025",
      deliveryType: "Shipping",
    },
  ],
  DRESS003: [
    {
      id: "BK10003",
      dressId: "DRESS003",
      customer: "Isabella Johnson",
      customerId: "CUST004",
      date: "May 25-28, 2025",
      deliveryType: "Pickup",
    },
  ],
};

// Calendar bookings data
export const calendarBookings = [
  {
    id: "BK10001",
    dressId: "DRESS001",
    startDate: new Date(2025, 4, 12), // May 12, 2025
    endDate: new Date(2025, 4, 15), // May 15, 2025
  },
  {
    id: "BK10002",
    dressId: "DRESS002",
    startDate: new Date(2025, 4, 18), // May 18, 2025
    endDate: new Date(2025, 4, 21), // May 21, 2025
  },
  {
    id: "BK10003",
    dressId: "DRESS003",
    startDate: new Date(2025, 4, 25), // May 25, 2025
    endDate: new Date(2025, 4, 28), // May 28, 2025
  },
];

// Get all dresses
export const getAllDresses = async (): Promise<Dress[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...dressesData];
};

// Get dress by ID
export const getDressById = async (id: string): Promise<Dress | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return dressesData.find((dress) => dress.id === id) || null;
};

// Update dress status
export const updateDressStatus = async (
  id: string,
  status: boolean
): Promise<Dress> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const dressIndex = dressesData.findIndex((dress) => dress.id === id);
  if (dressIndex === -1) {
    throw new Error(`Dress with ID ${id} not found`);
  }

  dressesData[dressIndex] = {
    ...dressesData[dressIndex],
    status,
    lastUpdated: new Date().toISOString().split("T")[0],
  };

  // Add to audit log
  if (!auditLogsData[id]) {
    auditLogsData[id] = [];
  }

  auditLogsData[id].unshift({
    date: new Date()
      .toISOString()
      .split("T")[0]
      .replace(/(\d{4})-(\d{2})-(\d{2})/, "Apr $3, $1"),
    action: `Status changed to ${status ? "Active" : "Inactive"}.`,
  });

  return dressesData[dressIndex];
};

// Create new dress
export const createDress = async (
  dressData: Omit<Dress, "id" | "dateAdded" | "lastUpdated">
): Promise<Dress> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newId = `DRESS${String(dressesData.length + 1).padStart(3, "0")}`;
  const today = new Date().toISOString().split("T")[0];

  const newDress: Dress = {
    ...dressData,
    id: newId,
    dateAdded: today,
    lastUpdated: today,
  };

  dressesData.push(newDress);

  // Initialize audit log
  auditLogsData[newId] = [
    {
      date: today.replace(/(\d{4})-(\d{2})-(\d{2})/, "Apr $3, $1"),
      action: "Listing created.",
    },
  ];

  return newDress;
};

// Update dress
export const updateDress = async (
  id: string,
  dressData: Partial<Dress>
): Promise<Dress> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const dressIndex = dressesData.findIndex((dress) => dress.id === id);
  if (dressIndex === -1) {
    throw new Error(`Dress with ID ${id} not found`);
  }

  const today = new Date().toISOString().split("T")[0];

  dressesData[dressIndex] = {
    ...dressesData[dressIndex],
    ...dressData,
    lastUpdated: today,
  };

  // Add to audit log
  if (!auditLogsData[id]) {
    auditLogsData[id] = [];
  }

  auditLogsData[id].unshift({
    date: today.replace(/(\d{4})-(\d{2})-(\d{2})/, "Apr $3, $1"),
    action: "Listing updated.",
  });

  return dressesData[dressIndex];
};

// Get condition reports for a dress
export const getConditionReports = async (
  dressId: string
): Promise<ConditionReport[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return conditionReportsData[dressId] || [];
};

// Get audit log for a dress
export const getAuditLog = async (
  dressId: string
): Promise<AuditLogEntry[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return auditLogsData[dressId] || [];
};

// Get bookings for a dress
export const getBookingsForDress = async (
  dressId: string
): Promise<Booking[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return bookingsData[dressId] || [];
};

// Get most popular dress
export const getMostPopularDress = async (): Promise<Dress | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // For demo purposes, just return the first dress
  return dressesData[0] || null;
};

// Get total and active listings counts
export const getListingsCounts = async (): Promise<{
  total: number;
  active: number;
}> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    total: dressesData.length,
    active: dressesData.filter((dress) => dress.status).length,
  };
};
