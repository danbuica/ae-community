"use client";

import { createContext, useContext } from "react";

interface WizardContextValue {
  errors: Record<string, string>;
  clearErrors: () => void;
}

const WizardContext = createContext<WizardContextValue>({
  errors: {},
  clearErrors: () => {},
});

export const WizardContextProvider = WizardContext.Provider;

export function useWizardErrors() {
  return useContext(WizardContext);
}
