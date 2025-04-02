import React from 'react';
import InvoiceList from '../InoviceList/InvoicesList';

function UnpaidInvoices() {
  return <InvoiceList status="unpaid" title="Unpaid Invoices" />;
}

export default UnpaidInvoices;