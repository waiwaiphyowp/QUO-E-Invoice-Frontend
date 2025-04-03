// const BASE_URL = "http://localhost:3000/invoices";
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/invoices`;

const invoiceServices = {
  createInvoice: async (invoiceData) => {
    try {
      const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(invoiceData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Invoice creation failed:', error);
      throw new Error(error.message || 'Failed to create invoice');
    }
  },

  getUserInvoices: async () => {
    try {
      const res = await fetch(`${BASE_URL}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch invoices: ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  getInvoicesByStatus: async (status) => {
    try {
      const res = await fetch(`${BASE_URL}/${status}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch ${status} invoices: ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error(`Error fetching ${status} invoices:`, error);
      throw error;
    }
  },

  // Delete invoice
  deleteInvoice: async (invoiceId) => {
    try {
      const res = await fetch(`${BASE_URL}/${invoiceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to delete invoice: ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw new Error(error.message || 'Failed to delete invoice');
    }
  },

  // Add update
  updateInvoice: async (invoiceId, invoiceData) => {
    try {
      const res = await fetch(`${BASE_URL}/${invoiceId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(invoiceData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Invoice update failed:', error);
      throw new Error(error.message || 'Failed to update invoice');
    }
  }
};

export default invoiceServices;