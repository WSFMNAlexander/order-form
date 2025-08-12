import React, { useMemo, useState } from "react";

/* ---------- CONFIG ---------- */

const SUPPLIER_ORDER = ["Sysco", "Office Supply", "HD Supply", "Amazon", "Other"];
const HEADER_IMAGE = "/order-header.jpg";

// Catalog with the last entries replaced by what you sent.
// Note: inch marks in two earlier items use "in" to avoid string issues.
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

  // New Office Supply and HD Supply items
  {"supplier":"Office Supply","itemNumber":"ODFN8738593","name":"Diversey BreakDown XC Odor Eliminator 1/2.5L","ppu":111.31,"uom":""},
  {"supplier":"Office Supply","itemNumber":"RAC74035CT","name":"Old English polish 12/12.5OZ","ppu":81.52,"uom":""},
  {"supplier":"Office Supply","itemNumber":"PGC96257","name":"Febreze Air Clean Linen 6/8.8OZ","ppu":21.56,"uom":""},
  {"supplier":"Office Supply","itemNumber":"CLO31036","name":"Clorox Urine Remover 1/128OZ","ppu":67.71,"uom":""},
  {"supplier":"Office Supply","itemNumber":"CLO35417CT","name":"CloroxPro Clean-Up","ppu":64.85,"uom":""},
  {"supplier":"HD Supply","itemNumber":"SPA6343","name":"Bath Disinfectant Cleaner-TNT","ppu":63.48,"uom":""},
  {"supplier":"HD Supply","itemNumber":"SPA7116-12","name":"NABC Bathroom Disinfectant Cleaner","ppu":50.52,"uom":""},
  {"supplier":"HD Supply","itemNumber":"REN06131-WB","name":"Renown Natural White 8 in. Controlled Hardwound Paper Towels","ppu":84.38,"uom":""},
  {"supplier":"HD Supply","itemNumber":"SPA3210-12","name":"CDC-10 4/1G","ppu":64.56,"uom":""},
  {"supplier":"HD Supply","itemNumber":"SPA6410","name":"Contempo Carpet Spray 12/17OZ","ppu":102.00,"uom":""}
];

/* ---------- APP ---------- */

export default function App() {
  const [query, setQuery] = useState("");
  const [requester, setRequester] = useState("");         // optional now
  const [notes, setNotes] = useState("");
  const [specialRequest, setSpecialRequest] = useState(""); // new bottom field
  const [qty, setQty] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const data = q
      ? CATALOG.filter(
          i =>
            i.name.toLowerCase().includes(q) ||
            (i.itemNumber || "").toLowerCase().includes(q) ||
            (i.supplier || "").toLowerCase().includes(q)
        )
      : CATALOG.slice();

    const orderMap = new Map(SUPPLIER_ORDER.map((s, idx) => [s, idx]));
    data.sort((a, b) => {
      const ao = orderMap.has(a.supplier) ? orderMap.get(a.supplier) : 999;
      const bo = orderMap.has(b.supplier) ? orderMap.get(b.supplier) : 999;
      if (ao !== bo) return ao - bo;
      return a.name.localeCompare(b.name);
    });

    return data;
  }, [query]);

  const selectedItems = CATALOG.filter(i => Number(qty[i.itemNumber + i.name]) > 0);
  const estTotal = selectedItems.reduce((sum, i) => {
    const qn = Number(qty[i.itemNumber + i.name]) || 0;
    return sum + (i.ppu ? i.ppu * qn : 0);
  }, 0);

  async function handleSubmit(e) {
    e.preventDefault();
    // Name is optional now, so no requester check.
    const orderLines = CATALOG.filter(i => Number(qty[i.itemNumber + i.name]) > 0).map(i => ({
      supplier: i.supplier,
      itemNumber: i.itemNumber,
      name: i.name,
      ppu: i.ppu,
      quantity: Number(qty[i.itemNumber + i.name])
    }));
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
        body: JSON.stringify({ requester, notes, specialRequest, orderLines })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setSent("ok");
      setQty({});
      setNotes("");
      setSpecialRequest("");
      setRequester("");
    } catch (err) {
      console.error(err);
      setSent(err.message || "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#f7f7f7" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
        <img
          src={HEADER_IMAGE}
          alt="Housekeeping"
          style={{ display: "block", margin: "0 auto 16px", maxWidth: 240, width: "100%", height: "auto", borderRadius: 12 }}
        />
        <h1 style={{ textAlign: "center", margin: "0 0 6px", fontSize: 32, fontWeight: 700 }}>
          Housekeeping Order Form
        </h1>
        <p style={{ textAlign: "center", margin: "0 0 16px", color: "#666" }}>
          Type to search. Enter quantities. Submit to email the order.
        </p>

        {/* Top inputs */}
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr 1fr", marginBottom: 16 }}>
          <input
            placeholder="Search item, number, or supplier"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
          />
          <input
            placeholder="Your name (optional)"
            value={requester}
            onChange={e => setRequester(e.target.value)}
            style={{ padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
          />
          <input
            placeholder="Notes (optional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
          />
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f2f2f2", fontSize: 14, textAlign: "left" }}>
              <tr>
                <th style={{ padding: 12 }}>Supplier</th>
                <th style={{ padding: 12 }}>Item</th>
                <th style={{ padding: 12 }}>Item #</th>
                <th style={{ padding: 12, textAlign: "right" }}>PPU</th>
                <th style={{ padding: 12, width: 120 }}>Qty</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i, idx) => (
                <tr key={idx} style={{ background: idx % 2 ? "#fafafa" : "#fff" }}>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>{i.supplier}</td>
                  <td style={{ padding: 12 }}>{i.name}</td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>{i.itemNumber}</td>
                  <td style={{ padding: 12, textAlign: "right", whiteSpace: "nowrap" }}>{i.ppu ? `$${i.ppu.toFixed(2)}` : ""}</td>
                  <td style={{ padding: 12 }}>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={qty[i.itemNumber + i.name] || ""}
                      onChange={e => setQty(q => ({ ...q, [i.itemNumber + i.name]: e.target.value }))}
                      style={{ padding: 8, width: 100, borderRadius: 8, border: "1px solid #ddd" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom special request + submit */}
        <div style={{ marginTop: 16 }}>
          <label style={{ display: "block", fontSize: 14, color: "#333", marginBottom: 6 }}>
            Special request (optional)
          </label>
          <input
            placeholder="Type any special request here"
            value={specialRequest}
            onChange={e => setSpecialRequest(e.target.value)}
            style={{ padding: 12, borderRadius: 10, border: "1px solid #ddd", width: "100%" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
          <div style={{ fontSize: 14, color: "#333" }}>
            Selected items: <strong>{selectedItems.length}</strong> | Est. total: <strong>${estTotal.toFixed(2)}</strong>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              background: "#111",
              color: "#fff",
              border: "none",
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? "not-allowed" : "pointer"
            }}
          >
            {submitting ? "Submitting..." : "Submit Order"}
          </button>
        </div>

        {sent && (
          <div style={{ marginTop: 10, fontSize: 14, color: sent === "ok" ? "#137333" : "#b00020" }}>
            {sent === "ok" ? "Order sent. Check your email." : `Error: ${sent}`}
          </div>
        )}
      </div>
    </div>
  );
}
