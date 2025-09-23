import React, { useMemo, useState, useEffect } from "react";

/* THEME */
// top of file
const HEADER_IMAGE = "/WS%20Logo%20Original%20(2).png";
const COLORS = {
  bg: "#d9f2f4",
  text: "#02273f",
  card: "#ffffff",
  border: "#bfe4ea",
  muted: "#35566a",
  button: "#02273f",
  thead: "#eef8fa",
};

/* SUPPLIER ORDER */
const SUPPLIER_ORDER = ["Sysco", "Office Supply", "HD Supply", "Amazon", "Other"];

/* CATALOG (complete) */
const CATALOG = [
  {"supplier":"Sysco","itemNumber":"7681341","name":"Gallon Dish Soap 4/1G","ppu":43.20,"uom":""},
  {"supplier":"Sysco","itemNumber":"7932785","name":"Foam Bowls","ppu":31.70,"uom":""},
  {"supplier":"Sysco","itemNumber":"7551308","name":"To Go Food Containers (150)","ppu":19.54,"uom":""},
  {"supplier":"Sysco","itemNumber":"4088829","name":"8oz Foam Cups","ppu":22.81,"uom":""},
  {"supplier":"Sysco","itemNumber":"8593602","name":"Foam Plates","ppu":25.71,"uom":""},
  {"supplier":"Sysco","itemNumber":"1933074","name":"Bleach 6/1G","ppu":24.82,"uom":""},
  {"supplier":"Sysco","itemNumber":"4458646","name":"Kitchen Paper Towel Roll 30/85CT","ppu":40.89,"uom":""},
  {"supplier":"Sysco","itemNumber":"4458784","name":"Toilet Paper 80/550CT","ppu":44.15,"uom":""},
  {"supplier":"Sysco","itemNumber":"7094050","name":"Reusable Cotton Kitchen Towel 1/12CT","ppu":23.76,"uom":""},
  {"supplier":"Sysco","itemNumber":"5256670","name":"Sanitizer Tablet Tab 100 Count","ppu":41.77,"uom":""},
  {"supplier":"Sysco","itemNumber":"4458693","name":"Paper Towel Multifold","ppu":26.09,"uom":""},
  {"supplier":"Sysco","itemNumber":"7155180","name":"Facial Tissues","ppu":52.84,"uom":""},
  {"supplier":"Sysco","itemNumber":"5793831","name":"Stainless Steel Scrub Pad","ppu":56.27,"uom":""},
  {"supplier":"Sysco","itemNumber":"8732146","name":"Dishwasher Machine Detergent","ppu":103.73,"uom":""},
  {"supplier":"Sysco","itemNumber":"5115710","name":"Green Scrub Pads","ppu":18.42,"uom":""},
  {"supplier":"Sysco","itemNumber":"1257620","name":"Plastic Wrap 24in","ppu":20.52,"uom":""},
  {"supplier":"Sysco","itemNumber":"4401877","name":"Foil 18in","ppu":49.17,"uom":""},
  {"supplier":"Sysco","itemNumber":"5844165","name":"Clorox Wipes 5/85CT","ppu":83.72,"uom":""},
  {"supplier":"Sysco","itemNumber":"2324915","name":"Laundry Detergent","ppu":68.83,"uom":""},
  {"supplier":"Sysco","itemNumber":"8777301","name":"Fabric Softener","ppu":92.04,"uom":""},
  {"supplier":"HD Supply","itemNumber":"PGC57446","name":"Dawn 1 Gallon","ppu":121.80,"uom":""},
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
  {"supplier":"Sysco","itemNumber":"955226","name":"Brillo Pads","ppu":25.10,"uom":""},
  {"supplier":"Sysco","itemNumber":"3415883","name":"Furniture Polish 6/13oz","ppu":29.91,"uom":""},
  {"supplier":"Sysco","itemNumber":"2650542","name":"Dust Mop Treatment 12/18oz","ppu":55.01,"uom":""},
  {"supplier":"Sysco","itemNumber":"466531","name":"Lysol 68895","ppu":71.31,"uom":""},
  {"supplier":"Sysco","itemNumber":"3864158","name":"Oven/Grill Cleaner 6/19oz","ppu":52.41,"uom":""},
  {"supplier":"Sysco","itemNumber":"3200559","name":"Sani 512Quat","ppu":101.77,"uom":""},
  {"supplier":"Sysco","itemNumber":"1188995","name":"Lysol 1920078629","ppu":80.53,"uom":""},
  {"supplier":"Sysco","itemNumber":"1207539","name":"Mr Clean","ppu":74.93,"uom":""},
  {"supplier":"Sysco","itemNumber":"3455346","name":"Baking Soda 4/16oz","ppu":22.64,"uom":""},
  {"supplier":"Sysco","itemNumber":"1646020","name":"Carpet Deodorizer 6/14oz","ppu":58.93,"uom":""},

  {"supplier":"Sysco","itemNumber":"7114148","name":"Forks Refill","ppu":42.65,"uom":""},
  {"supplier":"Sysco","itemNumber":"7114144","name":"Knives Refill","ppu":42.65,"uom":""},
  {"supplier":"Sysco","itemNumber":"7114141","name":"Spoons Refill","ppu":43.57,"uom":""},
  {"supplier":"Sysco","itemNumber":"8461131","name":"lavendar Floor Cleaner 4/1G","ppu":70.37,"uom":""},
  {"supplier":"Sysco","itemNumber":"7335194","name":"Hand Sanitizer 1/1L","ppu":16.03,"uom":""},
  {"supplier":"Sysco","itemNumber":"4294924","name":"Hand Soap Cartridge 41150ML","ppu":157.86,"uom":""},
  {"supplier":"Sysco","itemNumber":"2125421","name":"Baking Soda 24/16OZ","ppu":27.98,"uom":""},
  {"supplier":"Sysco","itemNumber":"7074078","name":"Liquid Bleach Cleaning Spray 4/32OZ","ppu":31.17,"uom":""},
  {"supplier":"Sysco","itemNumber":"7863540","name":"Reclosable Bag Quart Size 1/500CT","ppu":26.06,"uom":""},
  {"supplier":"Sysco","itemNumber":"7863634","name":"Reclosable Bag Gallon Size 1/250CT","ppu":24.63,"uom":""},
  {"supplier":"Sysco","itemNumber":"8549935","name":"Aerosol Disinfecting Spray 6/14OZ","ppu":46.91,"uom":""},
  {"supplier":"Sysco","itemNumber":"328652127","name":"Laundry Detergent Tablets 1/150CT","ppu":269.35,"uom":""},
  {"supplier":"Sysco","itemNumber":"5889407","name":"Kitchen Napkins Refill 12/500CT","ppu":49.01,"uom":""},
  {"supplier":"Sysco","itemNumber":"7066238","name":"Gym Wipes","ppu":42.63,"uom":""},
  {"supplier":"Sysco","itemNumber":"7153573","name":"Hydrogen Peroxide 4/32OZ","ppu":51.67,"uom":""},
  {"supplier":"Sysco","itemNumber":"7796313","name":"Office Trash Can Liners 200/23G","ppu":50.37,"uom":""},
  {"supplier":"Sysco","itemNumber":"1298821","name":"Black Trash Can Liner 60 Gallon 100/60G","ppu":43.88,"uom":""},
  {"supplier":"Sysco","itemNumber":"2544510","name":"Hand sanitizer Cartridge 4/750ML","ppu":75.24,"uom":""},
  {"supplier":"Sysco","itemNumber":"7066238-2","name":"Hard Surface Wipes 6/200CT","ppu":42.63,"uom":""},
  {"supplier":"Sysco","itemNumber":"7180880","name":"Multi Surface Sanitizer 6/32OZ","ppu":43.46,"uom":""},
  {"supplier":"Sysco","itemNumber":"7682790","name":"Glass Cleaner 4/32OZ","ppu":28.08,"uom":""},
  {"supplier":"Sysco","itemNumber":"6303523","name":"Sponge (Yellow/Green) 1/20CT","ppu":26.18,"uom":""},
  {"supplier":"Sysco","itemNumber":"2306781","name":"Gloves X-Large 10/100CT","ppu":58.05,"uom":""},
  {"supplier":"Sysco","itemNumber":"2306775","name":"Gloves Large 10/100CT","ppu":58.05,"uom":""},
  {"supplier":"Sysco","itemNumber":"2306753","name":"Gloves Medium 10/100CT","ppu":58.05,"uom":""},

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
  {"supplier":"HD Supply","itemNumber":"APP17100-04","name":"Appeal Hand Soap Cartridge 4/1L","ppu":46.68,"uom":""},
];

/* HOOK: mobile detection (no CSS dependence) */
function useIsMobile(bp = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= bp : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= bp);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bp]);
  return isMobile;
}

/* APP */
export default function App() {
  const [query, setQuery] = useState("");
  const [requester, setRequester] = useState("");
  const [notes, setNotes] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [qty, setQty] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(null);
  const isMobile = useIsMobile(700); // treat <=700px as mobile

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const data = q
      ? CATALOG.filter(i =>
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
    const orderLines = CATALOG
      .filter(i => Number(qty[i.itemNumber + i.name]) > 0)
      .map(i => ({
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
    <div style={{ minHeight: "100vh", width: "100%", background: COLORS.bg, color: COLORS.text }}>
      <div className="wrap">
        <img
          src={HEADER_IMAGE}
          alt="WhiteSands"
          style={{ display: "block", margin: "0 auto 16px", maxWidth: 260, width: "100%", height: "auto" }}
        />
        <h1 style={{ textAlign: "center", margin: "0 0 6px", fontSize: 32, fontWeight: 700 }}>
          Housekeeping Order Form
        </h1>
        <p style={{ textAlign: "center", margin: "0 0 16px", color: COLORS.muted }}>
          Type to search. Enter quantities. Submit to email the order.
        </p>

        {/* Top inputs */}
        <div className="top-grid">
          <input
            placeholder="Search item, number, or supplier"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ padding: 12, borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.text }}
          />
          <input
            placeholder="Please enter your name"
            value={requester}
            onChange={e => setRequester(e.target.value)}
            style={{ padding: 12, borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.text }}
          />
          <input
            placeholder="Notes (optional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ padding: 12, borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.text }}
          />
        </div>

        {/* Desktop: table | Mobile: stacked cards */}
        {!isMobile ? (
          <div className="table-wrap">
            <div style={{ background: COLORS.card, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <table>
                <thead style={{ background: COLORS.thead, fontSize: 14, textAlign: "left", color: COLORS.text }}>
                  <tr>
                    <th>Supplier</th>
                    <th>Item</th>
                    <th>Item #</th>
                    <th style={{ textAlign: "right" }}>PPU</th>
                    <th style={{ width: 120 }}>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((i, idx) => (
                    <tr key={`${i.itemNumber}-${i.name}-${idx}`} style={{ background: idx % 2 ? "#f7fbfd" : "#ffffff" }}>
                      <td style={{ whiteSpace: "nowrap" }}>{i.supplier}</td>
                      <td style={{ wordBreak: "break-word" }}>{i.name}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{i.itemNumber}</td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>{i.ppu ? `$${i.ppu.toFixed(2)}` : ""}</td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={qty[i.itemNumber + i.name] || ""}
                          onChange={e => setQty(q => ({ ...q, [i.itemNumber + i.name]: e.target.value }))}
                          style={{ padding: 8, width: 100, borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.text }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            {filtered.map((i, idx) => (
              <div
                key={`${i.itemNumber}-${i.name}-m-${idx}`}
                style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, marginBottom: 10 }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{i.name}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>
                  {i.supplier} • {i.itemNumber || "No item #"}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div style={{ fontWeight: 600 }}>{i.ppu ? `$${i.ppu.toFixed(2)}` : ""}</div>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Qty"
                    value={qty[i.itemNumber + i.name] || ""}
                    onChange={e => setQty(q => ({ ...q, [i.itemNumber + i.name]: e.target.value }))}
                    style={{ padding: 10, width: 120, borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.text }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Special request */}
        <div style={{ marginTop: 16 }}>
          <label style={{ display: "block", fontSize: 14, color: COLORS.text, marginBottom: 6 }}>
            Special request (optional)
          </label>
          <input
            placeholder="Type any special request here"
            value={specialRequest}
            onChange={e => setSpecialRequest(e.target.value)}
            style={{ padding: 12, borderRadius: 10, border: `1px solid ${COLORS.border}`, width: "100%", background: COLORS.card, color: COLORS.text }}
          />
        </div>

        {/* Footer / Submit */}
        <div className="submit-bar" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
          gap: 12,
          flexDirection: isMobile ? "column" : "row"
        }}>
          <div style={{ fontSize: 14, color: COLORS.text }}>
            Selected: <strong>{selectedItems.length}</strong> | Est. total: <strong>${estTotal.toFixed(2)}</strong>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              background: COLORS.button,
              color: "#fff",
              border: "none",
              opacity: submitting ? 0.65 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
              width: isMobile ? "100%" : undefined
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
