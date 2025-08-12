const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { requester, notes, orderLines } = JSON.parse(event.body || '{}');
    if (!requester || !Array.isArray(orderLines) || orderLines.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing requester or items' }) };
    }

    const header = 'Supplier,Item #,Item,Qty,PPU,Line Total';
    const rows = orderLines.map(l => {
      const qty = Number(l.quantity) || 0;
      const ppu = Number(l.ppu || 0);
      const line = (qty * ppu).toFixed(2);
      return [l.supplier, l.itemNumber || '', l.name, qty, ppu ? ppu.toFixed(2) : '', line].join(',');
    });
    const csv = [header, ...rows].join('\n');

    const textLines = [
      `Requester: ${requester}`,
      notes ? `Notes: ${notes}` : '',
      '',
      header.replaceAll(',', ' | '),
      ...rows.map(r => r.replaceAll(',', ' | '))
    ].filter(Boolean).join('\n');

    const toEmail = process.env.ORDER_TO || 'nalexander@whitesandstreatment.com';
    const fromEmail = process.env.ORDER_FROM || 'onboarding@resend.dev';

    const { data, error } = await resend.emails.send({
      from: `Order Bot <${fromEmail}>`,
      to: [toEmail],
      subject: `Housekeeping Order — ${new Date().toLocaleString()}`,
      text: textLines,
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

