import { create } from "zustand";

interface ISettingStore {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

const initialStates = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
};

export const useSettingStore = create<ISettingStore>((set) => ({
  ...initialStates,
  setFirstName: (value: string) => set({ firstName: value }),
  setLastName: (value: string) => set({ lastName: value }),
  setPhoneNumber: (value: string) => set({ phoneNumber: value }),
}));
