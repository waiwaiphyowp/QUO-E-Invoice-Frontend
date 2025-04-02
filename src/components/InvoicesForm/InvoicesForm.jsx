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
    discount: '',
    gst: '',
    status: 'select',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const itemsSubtotal = formData.lineItems.reduce((sum, item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const amount = parseFloat(item.amount) || 0;
    return sum + quantity * amount;
  }, 0);

  const discount = parseFloat(formData.discount) || 0;
  const subtotalAfterDiscount = itemsSubtotal - discount;
  const gstPercentage = parseFloat(formData.gst) || 0;
  const gstAmount = (subtotalAfterDiscount * gstPercentage) / 100;
  const total = subtotalAfterDiscount + gstAmount;

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
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.companyName || !formData.phoneNumber || !formData.address) {
        throw new Error('Please fill in all company details');
      }

      // Validate line items
      const hasEmptyLineItems = formData.lineItems.some(item => 
        !item.itemNo || !item.description || !item.quantity || !item.amount
      );
      
      if (hasEmptyLineItems) {
        throw new Error('Please fill in all line item fields');
      }

      // Validate status
      if (formData.status === 'select') {
        throw new Error('Please select an invoice status');
      }

      // Prepare invoice data
      const invoiceData = { 
        companyName: formData.companyName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        lineItems: formData.lineItems.map(item => ({
          itemNo: item.itemNo,
          description: item.description,
          quantity: parseFloat(item.quantity),
          amount: parseFloat(item.amount)
        })),
        discount: parseFloat(formData.discount) || 0,
        gst: parseFloat(formData.gst) || 0,
        subtotal: itemsSubtotal,
        total: total,
        status: formData.status,
        userId: user._id  // Ensure user ID is included
      };

      // Submit to backend
      const savedInvoice = await invoiceServices.createInvoice(invoiceData);
      
      // Redirect based on status
      if (formData.status === 'paid') {
        navigate('/paid', { state: { invoice: savedInvoice } });
      } else {
        navigate('/invoices', { state: { newInvoice: savedInvoice } });
      }

    } catch (error) {
      console.error('Error submitting invoice:', error);
      setError(error.message || 'Failed to save invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="invoices-form-wrapper">
      <Navbar username={user.username} onLogout={handleLogout} />
      <h2>Create New Invoice</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Company Details Section */}
        <div className="form-section">
          <h3>Company Details</h3>
          <label>
            Company Name
            <input 
              type="text" 
              name="companyName" 
              value={formData.companyName} 
              onChange={handleChange} 
              required
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
              required
            />
          </label>
          <label>
            Address
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              required
            />
          </label>
        </div>

        <button type="button" onClick={handleAddLine}>Add Line</button>

        {/* Line Items Section */}
        {formData.lineItems.map((item, index) => (
          <div key={index} className="form-section invoice-details-row">
            <label>
              Item No
              <input
                type="text"
                name="itemNo"
                value={item.itemNo}
                onChange={(e) => handleChange(e, index)}
                required
              />
            </label>
            <label>
              Description
              <input
                type="text"
                name="description"
                value={item.description}
                onChange={(e) => handleChange(e, index)}
                required
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
                required
                onWheel={(e) => e.target.blur()}
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
                  required
                  onWheel={(e) => e.target.blur()}
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

        {/* Totals Section */}
        <div className="form-section">
          <h3>Totals</h3>
          <label>
            Subtotal
            <input type="number" value={itemsSubtotal.toFixed(2)} readOnly />
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
              onWheel={(e) => e.target.blur()}
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
              onWheel={(e) => e.target.blur()}
              placeholder="Enter percentage"
            />
          </label>
          <label>
            Total
            <input type="number" value={total.toFixed(2)} readOnly />
          </label>
          <label>
            Status
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange}
              required
            >
              <option value="select">Select</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>

        <div className="form-buttons">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Invoice'}
          </button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default InvoicesForm;