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
import { residentialRates, commercialRates, calculateFromRates } from "@/data/rates";

type MeterStatus = "" | "working" | "not_working";
type BillingType = "" | "with_sewage" | "without_sewage" | "average";
type MeterType = "" | "residential" | "commercial";

export function SettlementCalculator() {
  const [meterStatus, setMeterStatus] = useState<MeterStatus>("");
  const [months, setMonths] = useState<string>("");
  const [billingType, setBillingType] = useState<BillingType>("");
  const [meterType, setMeterType] = useState<MeterType>("");
  const [avgConsumption, setAvgConsumption] = useState<string>("");
  const [tariff, setTariff] = useState<string>("");

  const result = useMemo(() => {
    const monthCount = parseInt(months);
    if (!monthCount || monthCount <= 0) return null;

    if (meterStatus === "working") {
      if (billingType === "with_sewage" || billingType === "without_sewage") {
        if (!meterType) return null;
        const rates = meterType === "residential" ? residentialRates : commercialRates;
        return calculateFromRates(rates, monthCount, billingType);
      }
      if (billingType === "average") {
        const avg = parseFloat(avgConsumption);
        const tar = parseFloat(tariff);
        if (!avg || !tar) return null;
        const total = monthCount * avg * tar;
        return { entries: [], total };
      }
    }
    return null;
  }, [meterStatus, months, billingType, meterType, avgConsumption, tariff]);

  return (
    <div dir="rtl" className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm1.498 2.25h.008v.008h-.008V18zm3.75-11.25v12.75a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0020.25 4.5H3.75A2.25 2.25 0 001.5 6.75m19.5 0v.75" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">حاسبة التسويات</h1>
          <p className="text-muted-foreground">حساب تسويات المياه والصرف الصحي</p>
        </div>

        {/* Meter Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">حالة العداد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={meterStatus}
              onValueChange={(v) => {
                setMeterStatus(v as MeterStatus);
                setBillingType("");
                setMeterType("");
                setMonths("");
                setAvgConsumption("");
                setTariff("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر حالة العداد" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="working">سائر وسليم</SelectItem>
                <SelectItem value="not_working">غير سائر وتشرك</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Working meter options */}
        {meterStatus === "working" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">بيانات التسوية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Number of months */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">عدد الشهور</label>
                <Input
                  type="number"
                  min={1}
                  placeholder="أدخل عدد الشهور"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                />
              </div>

              {/* Billing type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">نوع الممارسة</label>
                <Select
                  value={billingType}
                  onValueChange={(v) => {
                    setBillingType(v as BillingType);
                    setMeterType("");
                    setAvgConsumption("");
                    setTariff("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الممارسة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="with_sewage">بصرف</SelectItem>
                    <SelectItem value="without_sewage">بدون صرف</SelectItem>
                    <SelectItem value="average">متوسط وفقاً للاستهلاك السابق</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Meter type for ممارسة */}
              {(billingType === "with_sewage" || billingType === "without_sewage") && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">نوع العداد</label>
                  <Select value={meterType} onValueChange={(v) => setMeterType(v as MeterType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع العداد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">منزلي</SelectItem>
                      <SelectItem value="commercial">تجاري</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Average consumption fields */}
              {billingType === "average" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">متوسط الاستهلاك بالمتر المكعب</label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="أدخل متوسط الاستهلاك"
                      value={avgConsumption}
                      onChange={(e) => setAvgConsumption(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">التعريفة (جنيه / م³)</label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="أدخل التعريفة"
                      value={tariff}
                      onChange={(e) => setTariff(e.target.value)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Not working meter */}
        {meterStatus === "not_working" && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="font-semibold">العداد غير سائر - يحتاج إلى تشريك أو استبدال</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardHeader>
              <CardTitle className="text-lg text-primary">نتيجة التسوية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              <div className="rounded-xl bg-primary/10 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">إجمالي المبلغ المستحق</p>
                <p className="text-4xl font-bold text-primary">{result.total.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-1">جنيه</p>
              </div>

              {/* Breakdown table for rate-based */}
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

              {/* Average calculation breakdown */}
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
