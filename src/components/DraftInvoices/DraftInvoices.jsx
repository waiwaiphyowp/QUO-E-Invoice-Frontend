import React from 'react';
import InvoiceList from '../InoviceList/InvoicesList';

function DraftInvoices() {
  return <InvoiceList status="draft" title="Draft Invoices" />;
}

export default DraftInvoices;