const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/invoices`;

const invoiceServices = {
  createInvoice: async (userId, invoiceData) => {
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
  }
};

export default invoiceServices;