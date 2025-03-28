import React, { useContext, useState } from 'react';
import { UserContext } from '../../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './InvoicesForm.css';

function InvoicesForm() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    phoneNumber: '',
    address: '',
    invoiceNo: '',
    description: '',
    quantity: '',
    amount: '',
    subtotal: '',
    discount: '',
    gst: '',
    total: '',
    status: 'select',
  });

  const handleLogout = () => {
    setUser(null);
    navigate('/signin');
  };

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const savedInvoice = await response.json();
        console.log('Invoice Saved:', savedInvoice);
        navigate('/invoices');
      } else {
        console.error('Failed to save invoice:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting invoice:', error);
    }
  };

  const handleDraft = (e) => {
    e.preventDefault();
    console.log('Draft Saved:', formData);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/invoices');
  };

  return (
    <div className="invoices-form-wrapper">
      <Navbar username={user.username} onLogout={handleLogout} />
      <h2>Create New Invoice</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Company Details</h3>
          <label>
            Company Name
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
          </label>
          <label>
            Phone Number
            <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </label>
          <label>
            Address
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </label>
        </div>

        <div className="form-section invoice-details-row">
          <h3>Invoice Details</h3>
          <label>
            Invoice No
            <input type="number" name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} />
          </label>
          <label>
            Description
            <input type="text" name="description" value={formData.description} onChange={handleChange} />
          </label>
          <label>
            Quantity
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
          </label>
          <label>
            Amount
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
          </label>
        </div>

        <div className="form-section">
          <h3>Totals</h3>
          <label>
            Subtotal
            <input type="number" name="subtotal" value={formData.subtotal} onChange={handleChange} />
          </label>
          <label>
            Discount
            <input type="text" name="discount" value={formData.discount} onChange={handleChange} />
          </label>
          <label>
            GST
            <input type="number" name="gst" value={formData.gst} onChange={handleChange} />
          </label>
          <label>
            Total
            <input type="number" name="total" value={formData.total} onChange={handleChange} />
          </label>
          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="select">Select</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </label>
        </div>

        <div className="form-buttons">
          <button type="button" onClick={handleDraft}>Draft</button>
          <button type="submit">Save Invoice</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default InvoicesForm;