import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { statisticsApi } from "../api/services";
import { Button, Card, DataTable, Input, PageHeader, Select } from "../components/ui/Ui";
import { formatCurrency, getErrorMessage } from "../utils/helpers";

export default function StatisticsPage() {
  const [limit, setLimit] = useState("10");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [periodType, setPeriodType] = useState("month");
  const [staffId, setStaffId] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const [storeSeries, setStoreSeries] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [highestOrders, setHighestOrders] = useState([]);
  const [staffData, setStaffData] = useState(null);

  const loadRankings = async () => {
    try {
      const [productRes, customerRes, orderRes] = await Promise.all([
        statisticsApi.topProducts(Number(limit)),
        statisticsApi.topBuyers(Number(limit)),
        statisticsApi.highestOrders(Number(limit)),
      ]);
      setTopProducts(productRes.data.products || []);
      setTopCustomers(customerRes.data.customers || []);
      setHighestOrders(orderRes.data.orders || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const loadStoreSeries = async () => {
    try {
      let response;
      if (periodType === "day") {
        if (!dateRange.start || !dateRange.end) {
          toast.error("Chon start/end date cho period day");
          return;
        }
        response = await statisticsApi.storeByDay(dateRange.start, dateRange.end);
      } else if (periodType === "month") {
        response = await statisticsApi.storeByMonth(Number(year));
      } else if (periodType === "quarter") {
        response = await statisticsApi.storeByQuarter(Number(year));
      } else {
        response = await statisticsApi.storeByYear();
      }
      setStoreSeries(response.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const loadStaffData = async () => {
    if (!staffId) {
      setStaffData(null);
      return;
    }
    try {
      const { data } = await statisticsApi.staffSalesById(Number(staffId));
      setStaffData(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    loadRankings();
    loadStoreSeries();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Statistics" subtitle="Bao cao nang cao theo nhan vien va cua hang" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Analytics Hub</p>
          <p className="mt-2 text-sm text-on-surface-variant">Tune period, limit, and dimensions to compare performance in one panel.</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Quick Insight</p>
          <p className="mt-2 text-sm text-on-surface-variant">Revenue trends are strongest when monthly volume is stable.</p>
        </Card>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-6">
          <Select
            label="Period"
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value)}
            options={[
              { value: "day", label: "Day" },
              { value: "month", label: "Month" },
              { value: "quarter", label: "Quarter" },
              { value: "year", label: "Year" },
            ]}
          />
          <Input label="Year" value={year} onChange={(e) => setYear(e.target.value)} />
          <Input label="Start Date" type="date" value={dateRange.start} onChange={(e) => setDateRange((p) => ({ ...p, start: e.target.value }))} />
          <Input label="End Date" type="date" value={dateRange.end} onChange={(e) => setDateRange((p) => ({ ...p, end: e.target.value }))} />
          <Input label="Top Limit" value={limit} onChange={(e) => setLimit(e.target.value)} />
          <div className="flex items-end gap-2">
            <Button onClick={loadStoreSeries}>Load Series</Button>
            <Button variant="secondary" onClick={loadRankings}>Load Top</Button>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-headline text-xl font-black text-primary">Store Series</h3>
        <DataTable
          columns={["Period", "Orders", "Bikes", "Revenue", "Avg"]}
          data={storeSeries}
          renderRow={(item) => (
            <tr key={`${item.period}-${item.period_type}`} className="table-row-hover border-b border-slate-100">
              <td className="px-4 py-3">{item.period}</td>
              <td className="px-4 py-3">{item.total_orders}</td>
              <td className="px-4 py-3">{item.total_bikes_sold}</td>
              <td className="px-4 py-3">{formatCurrency(item.total_revenue)}</td>
              <td className="px-4 py-3">{formatCurrency(item.avg_order_value)}</td>
            </tr>
          )}
        />
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-headline text-xl font-black text-primary">Top Products</h3>
          <DataTable
            columns={["Product", "Qty", "Revenue"]}
            data={topProducts}
            renderRow={(item) => (
                <tr key={item.product_id} className="table-row-hover border-b border-slate-100">
                <td className="px-4 py-3">{item.product_name}</td>
                <td className="px-4 py-3">{item.total_quantity_sold}</td>
                <td className="px-4 py-3">{formatCurrency(item.total_revenue)}</td>
              </tr>
            )}
          />
        </Card>

        <Card>
          <h3 className="mb-4 font-headline text-xl font-black text-primary">Top Customers</h3>
          <DataTable
            columns={["Customer", "Orders", "Spent"]}
            data={topCustomers}
            renderRow={(item) => (
                <tr key={item.customer_id} className="table-row-hover border-b border-slate-100">
                <td className="px-4 py-3">{item.customer_name}</td>
                <td className="px-4 py-3">{item.total_orders}</td>
                <td className="px-4 py-3">{formatCurrency(item.total_spent)}</td>
              </tr>
            )}
          />
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 font-headline text-xl font-black text-primary">Highest Orders</h3>
        <DataTable
          columns={["Order", "Customer", "Date", "Value", "Items"]}
          data={highestOrders}
          renderRow={(item) => (
            <tr key={item.order_id} className="table-row-hover border-b border-slate-100">
              <td className="px-4 py-3 font-mono text-xs">ORD-{String(item.order_id).padStart(4, "0")}</td>
              <td className="px-4 py-3">{item.customer_name}</td>
              <td className="px-4 py-3">{item.order_date}</td>
              <td className="px-4 py-3">{formatCurrency(item.order_value)}</td>
              <td className="px-4 py-3">{item.items_count}</td>
            </tr>
          )}
        />
      </Card>

      <Card>
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <Input label="Staff ID" value={staffId} onChange={(e) => setStaffId(e.target.value)} />
          <div className="flex items-end">
            <Button onClick={loadStaffData}>Load Staff Sales</Button>
          </div>
        </div>
        {staffData ? (
          <div className="grid gap-4 md:grid-cols-4">
            <Card><p className="text-xs uppercase text-on-surface-variant">Staff</p><p className="mt-1 font-semibold">{staffData.staff_name}</p></Card>
            <Card><p className="text-xs uppercase text-on-surface-variant">Orders</p><p className="mt-1 font-semibold">{staffData.total_orders}</p></Card>
            <Card><p className="text-xs uppercase text-on-surface-variant">Bikes</p><p className="mt-1 font-semibold">{staffData.total_bikes_sold}</p></Card>
            <Card><p className="text-xs uppercase text-on-surface-variant">Revenue</p><p className="mt-1 font-semibold">{formatCurrency(staffData.total_revenue)}</p></Card>
          </div>
        ) : <p className="text-sm text-on-surface-variant">Nhap staff id de xem thong ke.</p>}
      </Card>
    </div>
  );
}
