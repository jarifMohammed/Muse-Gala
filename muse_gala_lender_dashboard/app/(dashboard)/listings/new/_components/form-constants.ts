export const SIZE_OPTIONS = [
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
] as const;

export const CONDITION_OPTIONS = [
  { value: "Brand New", label: "Brand New" },
  { value: "Like New", label: "Like New" },
  { value: "Gently Used", label: "Gently Used" },
  { value: "Used", label: "Used" },
  { value: "Worn", label: "Worn" },
  { value: "Damaged", label: "Damaged" },
  { value: "Altered", label: "Altered" },
  { value: "Vintage", label: "Vintage" },
] as const;

export const CATEGORY_OPTIONS = [
  { value: "Formal", label: "Formal" },
  { value: "Casual", label: "Casual" },
  { value: "Cocktail", label: "Cocktail" },
  { value: "Bridal", label: "Bridal" },
  { value: "Party", label: "Party" },
  { value: "Evening Gown", label: "Evening Gown" },
  { value: "Ball Gown", label: "Ball Gown" },
  { value: "Red Carpet", label: "Red Carpet" },
  { value: "Designer", label: "Designer" },
  { value: "Haute Couture", label: "Haute Couture" },
  { value: "Luxury", label: "Luxury" },
  { value: "Other", label: "Other" },
] as const;
