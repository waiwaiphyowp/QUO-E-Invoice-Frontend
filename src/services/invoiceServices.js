const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/invoices`;

const invoiceServices = {
  createInvoice: async (invoiceData) => {
    try {
      const res = await fetch(`${BASE_URL}/${invoiceData.userId}`, {
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

  createInvoiceLegacy: async (userId, invoiceData) => {
    try {
      const res = await fetch(`${BASE_URL}/${userId}/invoices`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(invoiceData),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.log('Error in createInvoice function:', error);
      throw error;
    }
  },

  getUserInvoices: async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch invoices: ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error fetching user invoices:', error);
      throw error;
    }
  },

  updateInvoice: async (invoiceId, updatedData) => {
    try {
      const res = await fetch(`${BASE_URL}/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!res.ok) {
        throw new Error(`Failed to update invoice: ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  deleteInvoice: async (invoiceId) => {
    try {
      const res = await fetch(`${BASE_URL}/${invoiceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to delete invoice: ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
};

export default invoiceServices;