// src/components/InvoicesForm/InvoicesForm.jsx
import React, { useContext, useState } from 'react';
import { UserContext } from '../../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import invoiceServices from '../../services/invoiceServices';
import './InvoicesForm.css';

function InvoicesForm() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    phoneNumber: '',
    address: '',
    lineItems: [{ itemNo: '', description: '', quantity: '', amount: '' }],
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

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      setFormData((prevData) => {
        const newLineItems = [...prevData.lineItems];
        newLineItems[index] = {
          ...newLineItems[index],
          [name]: value,
        };
        return {
          ...prevData,
          lineItems: newLineItems,
        };
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddLine = () => {
    setFormData((prevData) => ({
      ...prevData,
      lineItems: [...prevData.lineItems, { itemNo: '', description: '', quantity: '', amount: '' }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const savedInvoice = await invoiceServices.createInvoice(user.id, formData);
      console.log('Invoice Saved:', savedInvoice);
      
      if (formData.status === 'paid') {
        // Navigate to Paid component with form data
        navigate('/paid', { state: { invoiceData: formData } });
      } else {
        // Navigate to invoices list for other statuses
        navigate('/invoices');
      }
    } catch (error) {
      console.error('Error submitting invoice:', error);
    }
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

        <button type="button" onClick={handleAddLine}>Add Line</button>

        {formData.lineItems.map((item, index) => (
          <div key={index} className="form-section invoice-details-row">
            <label>
              Item No
              <input
                type="number"
                name="itemNo"
                value={item.itemNo}
                onChange={(e) => handleChange(e, index)}
              />
            </label>
            <label>
              Description
              <input
                type="text"
                name="description"
                value={item.description}
                onChange={(e) => handleChange(e, index)}
              />
            </label>
            <label>
              Quantity
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleChange(e, index)}
              />
            </label>
            <label>
              Amount
              <input
                type="number"
                name="amount"
                value={item.amount}
                onChange={(e) => handleChange(e, index)}
              />
            </label>
          </div>
        ))}

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
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>

        <div className="form-buttons">
          <button type="submit">Save Invoice</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default InvoicesForm;