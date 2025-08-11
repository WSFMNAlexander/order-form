import React, { useMemo, useState } from "react";

// ----- CONFIG -----
// 1) Your email will be set on the server (see netlify function below)
// 2) If you want to hard-limit which suppliers show first, adjust order here
const SUPPLIER_ORDER = ["Sysco", "Office Supply", "HD Supply", "Amazon", "Other"];

// 3) Item catalog — generated from your Excel. You can also fetch this from /items.json
const CATALOG = [
  {"supplier":"Sysco","itemNumber":"8461087","name":"Gallon Dish Soap 4/1G","ppu":37.53,"uom":""},
  {"supplier":"Sysco","itemNumber":"7932785","name":"Foam Bowls","ppu":31.7,"uom":""},
  {"supplier":"Sysco","itemNumber":"7551308","name":"To Go Food Containers (150)","ppu":19.54,"uom":""},
  {"supplier":"Sysco","itemNumber":"4088829","name":"8oz Foam Cups","ppu":22.81,"uom":""},
  {"supplier":"Sysco","itemNumber":"5274832","name":"Foam Plates","ppu":25.71,"uom":""},
  {"supplier":"Sysco","itemNumber":"1933074","name":"Bleach 6/1G","ppu":24.82,"uom":""},
  {"supplier":"Sysco","itemNumber":"4458646","name":"Kitchen Paper Towel Roll 30/85CT","ppu":40.89,"uom":""},
  {"supplier":"Sysco","itemNumber":"4458784","name":"Toilet Paper 80/550CT","ppu":44.15,"uom":""},
  {"supplier":"Sysco","itemNumber":"900721","name":"Reusable Cotton Kitchen Towel 1/12CT","ppu":13.65,"uom":""},
  {"supplier":"Sysco","itemNumber":"5256670","name":"Sanitizer Tablet Tab 100 Count","ppu":41.77,"uom":""},
  {"supplier":"Sysco","itemNumber":"9868688","name":"Paper Towel Multifold","ppu":26.09,"uom":""},
  {"supplier":"Sysco","itemNumber":"155184","name":"Facial Tissues","ppu":36.04,"uom":""},
  {"supplier":"Sysco","itemNumber":"5793831","name":"Stainless Steel Scrub Pad","ppu":56.27,"uom":""},
  {"supplier":"Sysco","itemNumber":"7670118","name":"Dish Detergent","ppu":73.88,"uom":""},
  {"supplier":"Sysco","itemNumber":"8732146","name":"Dishwasher Machine Detergent","ppu":103.73,"uom":""},
  {"supplier":"Sysco","itemNumber":"5115710","name":"Green Scrub Pads","ppu":18.42,"uom":""},
 {"supplier":"Sysco","itemNumber":"1257620","name":"Plastic Wrap 24in","ppu":20.52,"uom":""},
{"supplier":"Sysco","itemNumber":"4401877","name":"Foil 18in","ppu":49.17,"uom":""},
  {"supplier":"Sysco","itemNumber":"5844165","name":"Clorox Wipes 5/85CT","ppu":83.72,"uom":""},
  {"supplier":"Sysco","itemNumber":"2324915","name":"Laundry Detergent","ppu":68.83,"uom":""},
  {"supplier":"Sysco","itemNumber":"8777301","name":"Fabric Softener","ppu":92.04,"uom":""},
  {"supplier":"Sysco","itemNumber":"6463020","name":"Dawn 7/38oz","ppu":109.96,"uom":""},
  {"supplier":"Sysco","itemNumber":"5417672","name":"409 Degreaser 6/32oz","ppu":62.16,"uom":""},
  {"supplier":"Sysco","itemNumber":"1917246","name":"Disinfectant 6/32oz","ppu":52.73,"uom":""},
  {"supplier":"Sysco","itemNumber":"3121075","name":"Windex 32oz 8/case","ppu":61.19,"uom":""},
  {"supplier":"Sysco","itemNumber":"7352523","name":"Windex 5L","ppu":50.56,"uom":""},
  {"supplier":"Sysco","itemNumber":"6518445","name":"Swiffer Duster Starter Kit","ppu":20.09,"uom":""},
  {"supplier":"Sysco","itemNumber":"6016094","name":"Swiffer Duster Refills","ppu":25.31,"uom":""},
  {"supplier":"Sysco","itemNumber":"7522131","name":"Swiffer Wet Sweeper Pads","ppu":26.26,"uom":""},
  {"supplier":"Sysco","itemNumber":"7230373","name":"Spray Bottles 12/32oz","ppu":36.19,"uom":""},
  {"supplier":"Sysco","itemNumber":"7467095","name":"Ziploc 1 Gallon","ppu":20.99,"uom":""},
  {"supplier":"Sysco","itemNumber":"7041740","name":"Ziploc Sandwich","ppu":18.98,"uom":""},
  {"supplier":"Sysco","itemNumber":"955226","name":"Brillo Pads","ppu":25.1,"uom":""},
  {"supplier":"Sysco","itemNumber":"3415883","name":"Furniture Polish 6/13oz","ppu":29.91,"uom":""},
  {"supplier":"Sysco","itemNumber":"2650542","name":"Dust Mop Treatment 12/18oz","ppu":55.01,"uom":""},
  {"supplier":"Sysco","itemNumber":"466531","name":"Lysol 68895","ppu":71.31,"uom":""},
  {"supplier":"Sysco","itemNumber":"3864158","name":"Oven/Grill Cleaner 6/19oz","ppu":52.41,"uom":""},
  {"supplier":"Sysco","itemNumber":"3200559","name":"Sani 512Quat","ppu":101.77,"uom":""},
  {"supplier":"Sysco","itemNumber":"1188995","name":"Lysol 1920078629","ppu":80.53,"uom":""},
  {"supplier":"Sysco","itemNumber":"1207539","name":"Mr Clean","ppu":74.93,"uom":""},
  {"supplier":"Sysco","itemNumber":"3455346","name":"Baking Soda 4/16oz","ppu":22.64,"uom":""},
  {"supplier":"Sysco","itemNumber":"1646020","name":"Carpet Deodorizer 6/14oz","ppu":58.93,"uom":""},
  {"supplier":"Office Supply","itemNumber":"ODFN8738593","name":"Paper","ppu":null,"uom":""},
  {"supplier":"Office Supply","itemNumber":"","name":"Pens","ppu":null,"uom":""},
  {"supplier":"Office Supply","itemNumber":"","name":"Sharpies","ppu":null,"uom":""},
  {"supplier":"Office Supply","itemNumber":"","name":"Dry Erase Markers","ppu":null,"uom":""},
  {"supplier":"Office Supply","itemNumber":"","name":"Sticky Notes","ppu":null,"uom":""},
  {"supplier":"HD Supply","itemNumber":"","name":"Toilet Plunger","ppu":null,"uom":""},
  {"supplier":"HD Supply","itemNumber":"","name":"Small Dust Pan","ppu":null,"uom":""},
  {"supplier":"HD Supply","itemNumber":"","name":"Stuff on other sheet?","ppu":null,"uom":""}
];

// ----- UI COMPONENT -----
export default function App() {
  const [query, setQuery] = useState("");
  const [requester, setRequester] = useState("");
  const [notes, setNotes] = useState("");
  const [qty, setQty] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const data = q
      ? CATALOG.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            (i.itemNumber || "").toLowerCase().includes(q) ||
            (i.supplier || "").toLowerCase().includes(q)
        )
      : CATALOG.slice();

    // group by supplier with a stable order
    const orderMap = new Map(SUPPLIER_ORDER.map((s, idx) => [s, idx]));
    data.sort((a, b) => {
      const ao = orderMap.has(a.supplier) ? orderMap.get(a.supplier) : 999;
      const bo = orderMap.has(b.supplier) ? orderMap.get(b.supplier) : 999;
      if (ao !== bo) return ao - bo;
      return a.name.localeCompare(b.name);
    });

    return data;
  }, [query]);

  const selectedItems = filtered.filter((i) => Number(qty[i.itemNumber + i.name]) > 0);
  const estTotal = selectedItems.reduce((sum, i) => {
    const q = Number(qty[i.itemNumber + i.name]) || 0;
    return sum + (i.ppu ? i.ppu * q : 0);
  }, 0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!requester) {
      alert("Enter your name");
      return;
    }
    const orderLines = CATALOG.filter((i) => Number(qty[i.itemNumber + i.name]) > 0).map(
      (i) => ({
        supplier: i.supplier,
        itemNumber: i.itemNumber,
        name: i.name,
        ppu: i.ppu,
        quantity: Number(qty[i.itemNumber + i.name])
      })
    );
    if (orderLines.length === 0) {
      alert("Add at least one quantity");
      return;
    }

    setSubmitting(true);
    setSent(null);
    try {
      const res = await fetch("/.netlify/functions/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requester, notes, orderLines })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setSent("ok");
      setQty({});
      setNotes("");
    } catch (err) {
      console.error(err);
      setSent(err.message || "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Housekeeping Order Form</h1>
        <p className="text-sm text-gray-600 mb-4">Type to search. Enter quantities. Submit to email the order.</p>

        <div className="grid gap-3 md:grid-cols-3 mb-4">
          <input
            className="border rounded-xl p-3 w-full"
            placeholder="Search item, number, or supplier"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input
            className="border rounded-xl p-3 w-full"
            placeholder="Your name"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
          />
          <input
            className="border rounded-xl p-3 w-full"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="bg-white shadow rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="p-3">Supplier</th>
                <th className="p-3">Item</th>
                <th className="p-3">Item #</th>
                <th className="p-3">PPU</th>
                <th className="p-3 w-28">Qty</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i, idx) => (
                <tr key={idx} className={idx % 2 ? "bg-gray-50" : undefined}>
                  <td className="p-3 whitespace-nowrap">{i.supplier}</td>
                  <td className="p-3">{i.name}</td>
                  <td className="p-3 whitespace-nowrap">{i.itemNumber}</td>
                  <td className="p-3 whitespace-nowrap">{i.ppu ? `$${i.ppu.toFixed(2)}` : "—"}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      className="border rounded-lg p-2 w-24"
                      value={qty[i.itemNumber + i.name] || ""}
                      onChange={(e) =>
                        setQty((q) => ({ ...q, [i.itemNumber + i.name]: e.target.value }))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Selected items: <strong>{selectedItems.length}</strong>{" "}
            | Est. total: <strong>${estTotal.toFixed(2)}</strong>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-3 rounded-xl bg-black text-white shadow disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Order"}
          </button>
        </div>

        {sent && (
          <div className={`mt-3 text-sm ${sent === "ok" ? "text-green-700" : "text-red-700"}`}>
            {sent === "ok" ? "Order sent. Check your email." : `Error: ${sent}`}
          </div>
        )}

        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-gray-600">What gets emailed?</summary>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm">
{`Requester: <your name>\nNotes: <optional>\n\nSupplier | Item # | Item | Qty | PPU | Line Total\n...\n\nCSV attachment included.`}
          </pre>
        </details>
      </div>
    </div>
  );
}


