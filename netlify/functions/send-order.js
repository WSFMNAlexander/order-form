// netlify/functions/send-order.js
const { Resend } = require('resend');

// Trim in case the key was pasted with spaces
const resend = new Resend((process.env.RESEND_API_KEY || '').trim());

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { requester, notes, orderLines } = JSON.parse(event.body || '{}');
    if (!requester || !Array.isArray(orderLines) || orderLines.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing requester or items' }) };
    }

    // Helpers
    const money = n => (n && !isNaN(n)) ? `$${Number(n).toFixed(2)}` : '';
    const esc = s => String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

    // CSV
    const header = 'Supplier,Item #,Item,Qty,PPU,Line Total';
    const rows = orderLines.map(l => {
      const qty = Number(l.quantity) || 0;
      const ppu = Number(l.ppu || 0);
      const line = qty * ppu;
      return [l.supplier, l.itemNumber || '', l.name, qty, ppu ? ppu.toFixed(2) : '', line.toFixed(2)].join(',');
    });
    const csv = [header, ...rows].join('\n');

    // Totals for HTML/text
    const summary = orderLines.reduce((acc, l) => {
      const qty = Number(l.quantity) || 0;
      const ppu = Number(l.ppu || 0);
      acc.lines += 1;
      acc.items += qty;
      acc.total += qty * ppu;
      return acc;
    }, { lines: 0, items: 0, total: 0 });

    // Text fallback
    const textLines = [
      `Requester: ${requester}`,
      notes ? `Notes: ${notes}` : '',
      '',
      header.replaceAll(',', ' | '),
      ...rows.map(r => r.replaceAll(',', ' | ')),
      '',
      `Lines: ${summary.lines}  Items: ${summary.items}  Total: ${money(summary.total)}`
    ].filter(Boolean).join('\n');

    // HTML email
    const html = `
<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.4">
  <h2 style="margin:0 0 12px">Housekeeping Order</h2>
  <p style="margin:0 0 6px"><strong>Requester:</strong> ${esc(requester)}</p>
  ${notes ? `<p style="margin:0 0 12px"><strong>Notes:</strong> ${esc(notes)}</p>` : ''}
  <table style="border-collapse:collapse;width:100%;font-size:14px">
    <thead>
      <tr>
        <th style="text-align:left;border-bottom:1px solid #ddd;padding:8px">Supplier</th>
        <th style="text-align:left;border-bottom:1px solid #ddd;padding:8px">Item #</th>
        <th style="text-align:left;border-bottom:1px solid #ddd;padding:8px">Item</th>
        <th style="text-align:right;border-bottom:1px solid #ddd;padding:8px">Qty</th>
        <th style="text-align:right;border-bottom:1px solid #ddd;padding:8px">PPU</th>
        <th style="text-align:right;border-bottom:1px solid #ddd;padding:8px">Line Total</th>
      </tr>
    </thead>
    <tbody>
      ${orderLines.map(l => {
        const qty = Number(l.quantity) || 0;
        const ppu = Number(l.ppu || 0);
        const line = qty * ppu;
        return `<tr>
          <td style="border-bottom:1px solid #f0f0f0;padding:8px">${esc(l.supplier)}</td>
          <td style="border-bottom:1px solid #f0f0f0;padding:8px">${esc(l.itemNumber || '')}</td>
          <td style="border-bottom:1px solid #f0f0f0;padding:8px">${esc(l.name)}</td>
          <td style="border-bottom:1px solid #f0f0f0;padding:8px;text-align:right">${qty}</td>
          <td style="border-bottom:1px solid #f0f0f0;padding:8px;text-align:right">${money(ppu)}</td>
          <td style="border-bottom:1px solid #f0f0f0;padding:8px;text-align:right">${money(line)}</td>
        </tr>`;
      }).join('')}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" style="padding:8px;text-align:right"><strong>Totals</strong></td>
        <td style="padding:8px;text-align:right"><strong>${summary.items}</strong></td>
        <td style="padding:8px"></td>
        <td style="padding:8px;text-align:right"><strong>${money(summary.total)}</strong></td>
      </tr>
    </tfoot>
  </table>
  <p style="color:#666;font-size:12px;margin-top:10px">CSV attached for import.</p>
</div>`;

    const toEmail = process.env.ORDER_TO || 'nalexander@whitesandstreatment.com';
    const fromEmail = process.env.ORDER_FROM || 'onboarding@resend.dev';
    const replyTo = process.env.REPLY_TO || undefined; // optional

    const subject = `Housekeeping Order - ${new Date().toLocaleString()}`;

    const { data, error } = await resend.emails.send({
      from: `Order Bot <${fromEmail}>`,
      to: [toEmail],
      subject,
      text: textLines,
      html,
      reply_to: replyTo,
      attachments: [
        { filename: 'order.csv', content: Buffer.from(csv).toString('base64') }
      ]
    });

    if (error) {
      console.error('RESEND_ERROR', error);
      return { statusCode: 502, body: JSON.stringify({ error: error.message || 'Resend error' }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, id: data?.id || null }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Server error' }) };
  }
};
