import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SettlementCalculator } from "@/components/SettlementCalculator";
import { LoginScreen } from "@/components/LoginScreen";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "حاسبة التسويات - المياه والصرف الصحي" },
      { name: "description", content: "حاسبة تسويات المياه والصرف الصحي للعدادات المنزلية والتجارية" },
    ],
  }),
});

function Index() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem("logged_in") === "true");

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return <SettlementCalculator />;
}
