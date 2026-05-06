import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateFromRates, getRatesForMonthsForward } from "@/data/rates";

type MeterStatus = "" | "working" | "not_working";
type BillingType = "" | "with_sewage" | "without_sewage" | "average";
type MeterType = "" | "residential" | "commercial";

// ─── Tab 1: Settlement Calculator ───
function SettlementTab() {
  const [meterStatus, setMeterStatus] = useState<MeterStatus>("");
  const [months, setMonths] = useState("");
  const [billingType, setBillingType] = useState<BillingType>("");
  const [meterType, setMeterType] = useState<MeterType>("");
  const [avgConsumption, setAvgConsumption] = useState("");
  const [tariff, setTariff] = useState("");
  const [tamperingFee, setTamperingFee] = useState("500");

  const result = useMemo(() => {
    const monthCount = parseInt(months);
    if (!monthCount || monthCount <= 0) return null;
    const tampering = parseFloat(tamperingFee) || 0;

    if (meterStatus === "working" || meterStatus === "not_working") {
      if (billingType === "with_sewage" || billingType === "without_sewage") {
        if (!meterType) return null;
        const calc = calculateFromRates(meterType as "residential" | "commercial", monthCount, billingType);
        if (meterStatus === "not_working") {
          return { ...calc, tampering, total: calc.total + tampering };
        }
        return calc;
      }
      if (billingType === "average") {
        const avg = parseFloat(avgConsumption);
        const tar = parseFloat(tariff);
        if (!avg || !tar) return null;
        const base = monthCount * avg * tar;
        if (meterStatus === "not_working") {
          return { entries: [], tampering, total: base + tampering };
        }
        return { entries: [], total: base };
      }
    }
    return null;
  }, [meterStatus, months, billingType, meterType, avgConsumption, tariff, tamperingFee]);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader><CardTitle className="text-lg">حالة العداد</CardTitle></CardHeader>
        <CardContent>
          <Select value={meterStatus} onValueChange={(v) => { setMeterStatus(v as MeterStatus); setBillingType(""); setMeterType(""); setMonths(""); setAvgConsumption(""); setTariff(""); setTamperingFee("500"); }}>
            <SelectTrigger><SelectValue placeholder="اختر حالة العداد" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="working">سائر وسليم</SelectItem>
              <SelectItem value="not_working">غير سائر وتشرك</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {meterStatus === "working" && (
        <Card>
          <CardHeader><CardTitle className="text-lg">بيانات التسوية</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">عدد الشهور</label>
              <Input type="number" min={1} placeholder="أدخل عدد الشهور" value={months} onChange={(e) => setMonths(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">نوع الممارسة</label>
              <Select value={billingType} onValueChange={(v) => { setBillingType(v as BillingType); setMeterType(""); setAvgConsumption(""); setTariff(""); }}>
                <SelectTrigger><SelectValue placeholder="اختر نوع الممارسة" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="with_sewage">بصرف</SelectItem>
                  <SelectItem value="without_sewage">بدون صرف</SelectItem>
                  <SelectItem value="average">متوسط وفقاً للاستهلاك السابق</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(billingType === "with_sewage" || billingType === "without_sewage") && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">نوع العداد</label>
                <Select value={meterType} onValueChange={(v) => setMeterType(v as MeterType)}>
                  <SelectTrigger><SelectValue placeholder="اختر نوع العداد" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">منزلي</SelectItem>
                    <SelectItem value="commercial">تجاري</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {billingType === "average" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">متوسط الاستهلاك بالمتر المكعب</label>
                  <Input type="number" min={0} step={0.01} placeholder="أدخل متوسط الاستهلاك" value={avgConsumption} onChange={(e) => setAvgConsumption(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">التعريفة (جنيه / م³)</label>
                  <Input type="number" min={0} step={0.01} placeholder="أدخل التعريفة" value={tariff} onChange={(e) => setTariff(e.target.value)} />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {meterStatus === "not_working" && (
        <Card>
          <CardHeader><CardTitle className="text-lg">بيانات التسوية (غير سائر)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">عدد الشهور</label>
              <Input type="number" min={1} placeholder="أدخل عدد الشهور" value={months} onChange={(e) => setMonths(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">نوع الممارسة</label>
              <Select value={billingType} onValueChange={(v) => { setBillingType(v as BillingType); setMeterType(""); setAvgConsumption(""); setTariff(""); }}>
                <SelectTrigger><SelectValue placeholder="اختر نوع الممارسة" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="with_sewage">بصرف</SelectItem>
                  <SelectItem value="without_sewage">بدون صرف</SelectItem>
                  <SelectItem value="average">متوسط وفقاً للاستهلاك السابق</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(billingType === "with_sewage" || billingType === "without_sewage") && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">نوع العداد</label>
                <Select value={meterType} onValueChange={(v) => setMeterType(v as MeterType)}>
                  <SelectTrigger><SelectValue placeholder="اختر نوع العداد" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">منزلي</SelectItem>
                    <SelectItem value="commercial">تجاري</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {billingType === "average" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">متوسط الاستهلاك بالمتر المكعب</label>
                  <Input type="number" min={0} step={0.01} placeholder="أدخل متوسط الاستهلاك" value={avgConsumption} onChange={(e) => setAvgConsumption(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">التعريفة (جنيه / م³)</label>
                  <Input type="number" min={0} step={0.01} placeholder="أدخل التعريفة" value={tariff} onChange={(e) => setTariff(e.target.value)} />
                </div>
              </>
            )}
            <div className="space-y-2">
              <label className="text-sm font-semibold">قيمة العبث (جنيه)</label>
              <Input type="number" min={0} step={1} placeholder="500" value={tamperingFee} onChange={(e) => setTamperingFee(e.target.value)} />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-primary/20 bg-primary/[0.03]">
          <CardHeader><CardTitle className="text-lg text-primary">نتيجة التسوية</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">إجمالي المبلغ المستحق</p>
              <p className="text-4xl font-bold text-primary">{result.total.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">جنيه</p>
            </div>
            {result.entries.length > 0 && (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-3 text-right font-semibold">الشهر</th>
                      <th className="p-3 text-right font-semibold">مياه</th>
                      <th className="p-3 text-right font-semibold">صرف</th>
                      <th className="p-3 text-right font-semibold">مياه + صرف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.entries.map((entry, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-3">{entry.month}</td>
                        <td className="p-3">{entry.water}</td>
                        <td className="p-3">{entry.sewage}</td>
                        <td className="p-3 font-semibold">{entry.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {billingType === "average" && (
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">عدد الشهور</p>
                  <p className="text-lg font-bold">{months}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">متوسط الاستهلاك</p>
                  <p className="text-lg font-bold">{avgConsumption} م³</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">التعريفة</p>
                  <p className="text-lg font-bold">{tariff} جنيه</p>
                </div>
              </div>
            )}
            {meterStatus === "not_working" && result.tampering !== undefined && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">قيمة العبث</p>
                <p className="text-2xl font-bold text-destructive">{result.tampering.toFixed(2)} جنيه</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Tab 2: Special Cases (غير سائر) ───
interface SpecialRow {
  month: string;
  value: string;
  practice: string;
}

function SpecialCasesTab() {
  const [months, setMonths] = useState("");
  const [activityType, setActivityType] = useState<MeterType>("");
  const [rows, setRows] = useState<SpecialRow[]>([]);

  const monthCount = parseInt(months) || 0;

  const rebuildRows = (count: number, activity: string) => {
    if (count <= 0 || !activity) {
      setRows([]);
      return;
    }
    const rates = getRatesForMonthsForward(count, activity as "residential" | "commercial");
    setRows(
      rates.map((r, i) => ({
        month: r.month,
        value: rows[i]?.month === r.month ? rows[i].value : "",
        practice: rows[i]?.month === r.month ? rows[i].practice : r.total.toString(),
      }))
    );
  };

  const handleMonthsChange = (val: string) => {
    setMonths(val);
    rebuildRows(parseInt(val) || 0, activityType);
  };

  const handleActivityChange = (val: string) => {
    setActivityType(val as MeterType);
    rebuildRows(monthCount, val);
  };

  const updateRow = (index: number, field: "value" | "practice", val: string) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: val } : r)));
  };

  const totalValue = rows.reduce((sum, r) => sum + (parseFloat(r.value) || 0), 0);
  const totalPractice = rows.reduce((sum, r) => sum + (parseFloat(r.practice) || 0), 0);
  const grandTotal = totalValue + totalPractice;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader><CardTitle className="text-lg">حالات خاصة للغير سائر</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">النشاط</label>
            <Select value={activityType} onValueChange={handleActivityChange}>
              <SelectTrigger><SelectValue placeholder="اختر النشاط" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">منزلي</SelectItem>
                <SelectItem value="commercial">تجاري</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">عدد الشهور</label>
            <Input type="number" min={1} placeholder="أدخل عدد الشهور" value={months} onChange={(e) => handleMonthsChange(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {monthCount > 0 && rows.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">بيانات الشهور</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-3 text-right font-semibold">الشهر</th>
                    <th className="p-3 text-right font-semibold">القيمة</th>
                    <th className="p-3 text-right font-semibold">ممارسة</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3 font-medium">{row.month}</td>
                      <td className="p-2">
                        <Input type="number" min={0} step={0.01} placeholder="0" value={row.value} onChange={(e) => updateRow(i, "value", e.target.value)} className="h-8 text-sm" />
                      </td>
                      <td className="p-2">
                        <Input type="number" min={0} step={0.01} placeholder="0" value={row.practice} onChange={(e) => updateRow(i, "practice", e.target.value)} className="h-8 text-sm" />
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary/30 bg-primary/5 font-bold">
                    <td className="p-3">الإجمالي</td>
                    <td className="p-3">{totalValue.toFixed(2)}</td>
                    <td className="p-3">{totalPractice.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 rounded-xl bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">الإجمالي الكلي</p>
              <p className="text-4xl font-bold text-primary">{grandTotal.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">جنيه</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Main Component ───
export function SettlementCalculator() {
  return (
    <div dir="rtl" className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm1.498 2.25h.008v.008h-.008V18zm3.75-11.25v12.75a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0020.25 4.5H3.75A2.25 2.25 0 001.5 6.75m19.5 0v.75" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">حاسبة التسويات</h1>
          <p className="text-muted-foreground">حساب تسويات المياه والصرف الصحي</p>
        </div>

        <Tabs defaultValue="settlement" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="settlement">التسويات</TabsTrigger>
            <TabsTrigger value="special">حالات خاصة للغير سائر</TabsTrigger>
          </TabsList>
          <TabsContent value="settlement">
            <SettlementTab />
          </TabsContent>
          <TabsContent value="special">
            <SpecialCasesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
