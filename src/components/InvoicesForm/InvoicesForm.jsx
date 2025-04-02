import React, { useContext, useState, useEffect } from 'react';
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

  useEffect(() => {
    const updatedLineItems = formData.lineItems.map(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const amount = parseFloat(item.amount) || 0;
      return {
        ...item,
        subtotal: (quantity * amount).toFixed(2)
      };
    });

    const itemsSubtotal = updatedLineItems.reduce((sum, item) => 
      sum + (parseFloat(item.subtotal) || 0), 0);
    
    const discount = parseFloat(formData.discount) || 0;
    const subtotalAfterDiscount = itemsSubtotal - discount;
    const gstPercentage = parseFloat(formData.gst) || 0;
    const gstAmount = (subtotalAfterDiscount * gstPercentage) / 100;
    const total = subtotalAfterDiscount + gstAmount;

    setFormData(prev => ({
      ...prev,
      lineItems: updatedLineItems,
      subtotal: itemsSubtotal.toFixed(2),
      total: total.toFixed(2)
    }));
  }, [formData.lineItems, formData.discount, formData.gst]);

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

  const handleRemoveLine = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      lineItems: prevData.lineItems.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const savedInvoice = await invoiceServices.createInvoice(user.id, formData);
      console.log('Invoice Saved:', savedInvoice);
      
      if (formData.status === 'paid') {
        navigate('/paid', { state: { invoiceData: formData } });
      } else {
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
            <input 
              type="text" 
              name="companyName" 
              value={formData.companyName} 
              onChange={handleChange} 
            />
          </label>
          <label>
            Phone Number
            <input 
              type="text" 
              name="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={handleChange}
              pattern="[0-9]*"
            />
          </label>
          <label>
            Address
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
            />
          </label>
        </div>

        <button type="button" onClick={handleAddLine}>Add Line</button>

        {formData.lineItems.map((item, index) => (
          <div key={index} className="form-section invoice-details-row">
            <label>
              Item No
              <input
                type="text"
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
                min="1"
              />
            </label>
            <label className="amount-label">
              Amount
              <div className="amount-container">
                <input
                  type="number"
                  name="amount"
                  value={item.amount}
                  onChange={(e) => handleChange(e, index)}
                  step="0.01"
                  min="0"
                />
                {formData.lineItems.length > 1 && (
                  <button
                    type="button"
                    className="remove-line-btn"
                    onClick={() => handleRemoveLine(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            </label>
          </div>
        ))}

        <div className="form-section">
          <h3>Totals</h3>
          <label>
            Subtotal
            <input type="number" name="subtotal" value={formData.subtotal} readOnly />
          </label>
          <label>
            Discount
            <input 
              type="number" 
              name="discount" 
              value={formData.discount} 
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="Enter amount"
            />
          </label>
          <label>
            GST (%)
            <input 
              type="number" 
              name="gst" 
              value={formData.gst} 
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="Enter percentage"
            />
          </label>
          <label>
            Total
            <input type="number" name="total" value={formData.total} readOnly />
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