import { createFileRoute } from "@tanstack/react-router";
import { SettlementCalculator } from "@/components/SettlementCalculator";

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
  return <SettlementCalculator />;
}
