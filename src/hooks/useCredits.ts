import { useState } from "react";
import { checkCredits, deductCredit } from "@/utils/credits";

export const useCredits = () => {
  const [showCreditAlert, setShowCreditAlert] = useState(false);

  const handleCredits = async () => {
    const hasCredits = await checkCredits();
    if (!hasCredits) {
      setShowCreditAlert(true);
      return false;
    }
    const creditDeducted = await deductCredit();
    return creditDeducted;
  };

  return {
    showCreditAlert,
    setShowCreditAlert,
    handleCredits,
  };
};