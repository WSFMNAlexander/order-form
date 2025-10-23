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
const SUPPLIER_ORDER = ["HD Supply", "Cheney Bros", "Other"];

/* CATALOG (complete) */
const CATALOG = [
  {"supplier":"Cheney Bros","itemNumber":"10089384","name":"Foam Bowls 20/25ct","ppu":31.70,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"833052","name":"To Go Food Containers (200)","ppu":19.49,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"823040","name":"8oz Foam Cups 40/25ct","ppu":22.81,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10034790","name":"Foam Plates 4/125 ct","ppu":25.71,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"506040","name":"Bleach 6/1G","ppu":24.82,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10086289","name":"Kitchen Paper Towel Roll 30/84CT","ppu":40.89,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10139035","name":"Toilet Paper 96/400CT","ppu":44.15,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"766296","name":"Reusable Cotton Kitchen Towel 60ct","ppu":13.65,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10078206","name":"Sanitizer Tablet Tab 6/100ct","ppu":41.77,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10120893","name":"Paper Towel Multifold 16/135ct","ppu":26.09,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"856165","name":"Kleenex Tissues 36/95ct","ppu":36.04,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10106438","name":"Stainless Steel Scrub Pad 6/12ct","ppu":56.27,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"540011","name":"Dawn 4/1g","ppu":73.88,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10111214","name":"Forks Refill 24/40ct","ppu":40.11,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10111218","name":"Knives Refill 24/40ct","ppu":40.11,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10111215","name":"Spoons Refill 24/40ct","ppu":43.57,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"2514028","name":"Spic and Span Floor Cleaner 3/1g","ppu":142.26,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10140940","name":"Baking Soda 24/16OZ","ppu":27.98,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10117657","name":"Comet Bleach Disinfectant Cleaner with Bleach 8/32oz","ppu":31.17,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"811456","name":"Reclosable Bag Quart Size 1/1000CT","ppu":29.47,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10052301","name":"Reclosable Bag Gallon Size 1/250CT","ppu":19.46,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"8549935","name":"Lysol Disinfectant Spray Crisp Linen 12/19oz","ppu":46.91,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"00841002","name":"Kitchen Napkins Refill 12/500CT","ppu":49.01,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"00852045","name":"Clorox Disinfecting Wipes 06/75ct","ppu":42.63,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10144505","name":"Disinfectant Cleaner Multi Surface (Peroxide Cleaner) 6/32oz","ppu":51.67,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"00805045","name":"Office Trash Can Liners 1/500ct","ppu":50.37,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10016742","name":"Black Trash Can Liner 60 Gallon 100/60G","ppu":43.88,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10119370","name":"Windex Glass Cleaner 8/1ct","ppu":28.08,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"00707901","name":"Sponge (Yellow/Green) 20/1ct","ppu":26.18,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10132395","name":"Gloves X-Large 10/100CT","ppu":58.05,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10109125","name":"Gloves Large 10/100CT","ppu":58.05,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10109123","name":"Gloves Medium 10/100CT","ppu":58.05,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"00851485","name":"Renown Natural White 8 in. Controlled Hardwound Paper Towels","ppu":84.38,"uom":""},
  {"supplier":"Cheney Bros","itemNumber":"10144505","name":"Disinfectant Cleaner 6/32oz (Sub for CDC-10)","ppu":43.46,"uom":""},
 {"supplier":"Cheney Bros","itemNumber":"10108502","name":"CloroxPro Clean-Up 9/32oz","ppu":64.85,"uom":""},
  {"supplier":"Office Supply","itemNumber":"ODFN8738593","name":"Diversey BreakDown XC Odor Eliminator 1/2.5L","ppu":111.31,"uom":""},
  {"supplier":"Office Supply","itemNumber":"RAC74035CT","name":"Old English polish 12/12.5OZ","ppu":81.52,"uom":""},
  {"supplier":"Office Supply","itemNumber":"CLO31036","name":"Clorox Urine Remover 1/128OZ","ppu":67.71,"uom":""},
  {"supplier":"HD Supply","itemNumber":"SPA7116-12","name":"NABC Bathroom Disinfectant Cleaners","ppu":50.52,"uom":""},
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
