import React from 'react';
import InvoiceList from '../InoviceList/InvoicesList';

function PaidInvoices() {
  return <InvoiceList status="paid" title="Paid Invoices" />;
}

export default PaidInvoices;