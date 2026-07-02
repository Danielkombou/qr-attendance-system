import { create } from "zustand";
import { persist } from "zustand/middleware";

type CheckInStore = {
  plannedTasksDraft: string;
  setPlannedTasksDraft: (value: string) => void;
  clearPlannedTasksDraft: () => void;
};

export const useCheckInStore = create<CheckInStore>()(
  persist(
    (set) => ({
      plannedTasksDraft: "",
      setPlannedTasksDraft: (value) => set({ plannedTasksDraft: value }),
      clearPlannedTasksDraft: () => set({ plannedTasksDraft: "" }),
    }),
    { name: "attendx-check-in-draft" },
  ),
);
