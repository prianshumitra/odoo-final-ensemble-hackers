import PDFDocument from 'pdfkit';

export const generateInvoicePDFBuffer = (invoice: any, order?: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header
      doc.fillColor('#7E3AF2').fontSize(22).text('EZRent — Invoice', { align: 'left' });
      doc.fillColor('#4B5563').fontSize(10).text('Rental Management & Asset Operations System', { align: 'left' });
      doc.moveDown();

      // Invoice & Order Meta Box
      doc.fillColor('#1F2937').fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
      doc.text(`Order Reference: ${invoice.orderRef || order?.orderRef || 'N/A'}`);
      doc.text(`Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`);
      doc.text(`Status: ${invoice.status.toUpperCase()}`);
      doc.text(`Customer Name: ${invoice.customerName}`);
      doc.text(`Customer Email: ${invoice.customerEmail}`);
      doc.moveDown();

      doc.strokeColor('#D4C4ED').lineWidth(1).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Table Header
      const tableTop = doc.y;
      doc.fontSize(10).fillColor('#6B7280');
      doc.text('Item Description', 40, tableTop);
      doc.text('Qty', 300, tableTop);
      doc.text('Unit Price', 370, tableTop);
      doc.text('Total', 480, tableTop);
      doc.moveDown();

      doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Line Items
      doc.fillColor('#111827');
      if (invoice.lines && invoice.lines.length > 0) {
        invoice.lines.forEach((line: any) => {
          const y = doc.y;
          doc.text(line.productName || 'Rental Item', 40, y, { width: 240 });
          doc.text(String(line.quantity || 1), 300, y);
          doc.text(`Rs. ${Number(line.unitPrice || 0).toLocaleString()}`, 370, y);
          doc.text(`Rs. ${Number(line.amount || 0).toLocaleString()}`, 480, y);
          doc.moveDown(1.5);
        });
      }

      doc.strokeColor('#D4C4ED').lineWidth(1).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Totals Summary
      const summaryY = doc.y;
      doc.fontSize(11).fillColor('#374151');
      doc.text(`Untaxed Amount: Rs. ${Number(invoice.untaxedAmount || 0).toLocaleString()}`, 350, summaryY);
      doc.text(`Tax Amount: Rs. ${Number(invoice.taxAmount || 0).toLocaleString()}`, 350, summaryY + 18);
      doc.fontSize(13).fillColor('#7E3AF2').text(`Total Amount: Rs. ${Number(invoice.total || 0).toLocaleString()}`, 350, summaryY + 38);

      doc.moveDown(4);
      doc.fontSize(9).fillColor('#9CA3AF').text('Thank you for choosing EZRent! For queries, contact support@ezrent.com.', 40, doc.y, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

export const generateQuotationPDFBuffer = (order: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header
      doc.fillColor('#7E3AF2').fontSize(22).text('EZRent — Quotation', { align: 'left' });
      doc.fillColor('#4B5563').fontSize(10).text('Official Rental Quotation & Estimate', { align: 'left' });
      doc.moveDown();

      doc.fillColor('#1F2937').fontSize(12).text(`Quotation Reference: ${order.orderRef}`);
      doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`);
      doc.text(`Customer Name: ${order.customerName}`);
      doc.text(`Customer Email: ${order.customerEmail}`);
      if (order.rentalPeriod) {
        doc.text(`Rental Start: ${new Date(order.rentalPeriod.start).toLocaleString()}`);
        doc.text(`Rental End: ${new Date(order.rentalPeriod.end).toLocaleString()}`);
      }
      doc.moveDown();

      doc.strokeColor('#D4C4ED').lineWidth(1).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      const tableTop = doc.y;
      doc.fontSize(10).fillColor('#6B7280');
      doc.text('Product / Service', 40, tableTop);
      doc.text('Qty', 300, tableTop);
      doc.text('Unit Rate', 370, tableTop);
      doc.text('Amount', 480, tableTop);
      doc.moveDown();

      doc.fillColor('#111827');
      if (order.lines && order.lines.length > 0) {
        order.lines.forEach((line: any) => {
          const y = doc.y;
          doc.text(line.productName || 'Rental Item', 40, y, { width: 240 });
          doc.text(String(line.quantity || 1), 300, y);
          doc.text(`Rs. ${Number(line.unitPrice || 0).toLocaleString()}`, 370, y);
          doc.text(`Rs. ${Number(line.amount || 0).toLocaleString()}`, 480, y);
          doc.moveDown(1.5);
        });
      }

      doc.strokeColor('#D4C4ED').lineWidth(1).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      const summaryY = doc.y;
      doc.fontSize(11).fillColor('#374151');
      doc.text(`Subtotal: Rs. ${Number(order.untaxedAmount || 0).toLocaleString()}`, 350, summaryY);
      doc.text(`Tax (${order.taxRate || 10}%): Rs. ${Number(order.taxAmount || 0).toLocaleString()}`, 350, summaryY + 18);
      if (order.securityDeposit?.amount) {
        doc.text(`Security Deposit: Rs. ${Number(order.securityDeposit.amount).toLocaleString()}`, 350, summaryY + 36);
      }
      doc.fontSize(13).fillColor('#7E3AF2').text(`Grand Total: Rs. ${Number(order.total || 0).toLocaleString()}`, 350, summaryY + 56);

      doc.moveDown(4);
      doc.fontSize(9).fillColor('#9CA3AF').text('This quotation is valid for 30 days. To accept, click Confirm Order in your portal.', 40, doc.y, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
