import { create } from "zustand";

interface ISettingStore {
  fullName: string;
  setFullName: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

const initialStates = {
  fullName: "",
  phoneNumber: "",
};

export const useSettingStore = create<ISettingStore>((set) => ({
  ...initialStates,
  setFullName: (value: string) => set({ fullName: value }),
  setPhoneNumber: (value: string) => set({ phoneNumber: value }),
}));
