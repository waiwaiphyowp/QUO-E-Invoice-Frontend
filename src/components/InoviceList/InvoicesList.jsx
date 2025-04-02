import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import invoiceServices from '../../services/invoiceServices';
import './InvoicesList.css';

function InvoiceList({ status, title }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingInvoice, setEditingInvoice] = useState(null);

  const calculateTotals = (invoice) => {
    const itemsSubtotal = invoice.lineItems.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const amount = parseFloat(item.amount) || 0;
      return sum + quantity * amount;
    }, 0);

    const discount = parseFloat(invoice.discount) || 0;
    const subtotalAfterDiscount = itemsSubtotal - discount;
    const gstPercentage = parseFloat(invoice.gst) || 0;
    const gstAmount = (subtotalAfterDiscount * gstPercentage) / 100;
    const total = subtotalAfterDiscount + gstAmount;

    return { subtotal: itemsSubtotal, gstAmount, total };
  };

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchInvoices();
  }, [status, user, navigate]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const allInvoices = await invoiceServices.getUserInvoices();
      const filteredInvoices = allInvoices.filter(invoice => invoice.status === status);
      setInvoices(filteredInvoices);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (invoice) => {
    setEditingInvoice({ 
      ...invoice,
      ...calculateTotals(invoice)
    });
  };

  const handleCancelEdit = () => {
    setEditingInvoice(null);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    let updatedInvoice;
    
    if (index !== undefined) {
      updatedInvoice = {
        ...editingInvoice,
        lineItems: editingInvoice.lineItems.map((item, i) => 
          i === index ? { ...item, [name]: value } : item
        )
      };
    } else {
      updatedInvoice = { ...editingInvoice, [name]: value };
    }

    const totals = calculateTotals(updatedInvoice);
    setEditingInvoice({ ...updatedInvoice, ...totals });
  };

  const handleAddLineItem = () => {
    setEditingInvoice(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { 
        itemNo: '', 
        description: '', 
        quantity: '', 
        amount: '' 
      }]
    }));
  };

  const handleRemoveLineItem = (index) => {
    if (editingInvoice.lineItems.length <= 1) return;
    setEditingInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  };

  const handleSaveInvoice = async () => {
    try {
      const updatedInvoice = await invoiceServices.updateInvoice(
        editingInvoice._id, 
        editingInvoice
      );
      setInvoices(invoices.map(inv => 
        inv._id === updatedInvoice._id ? updatedInvoice : inv
      ));
      setEditingInvoice(null);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update invoice');
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      if (window.confirm('Are you sure you want to delete this invoice?')) {
        await invoiceServices.deleteInvoice(invoiceId);
        setInvoices(invoices.filter(invoice => invoice._id !== invoiceId));
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete invoice');
    }
  };

  const renderFormSection = () => (
    <form className="invoice-form">
      <div className="form-section">
        <h3>Company Details</h3>
        <label>
          Company Name
          <input
            type="text"
            name="companyName"
            value={editingInvoice.companyName}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Phone Number
          <input
            type="text"
            name="phoneNumber"
            value={editingInvoice.phoneNumber}
            onChange={handleInputChange}
            pattern="[0-9]*"
            required
          />
        </label>
        <label>
          Address
          <input
            type="text"
            name="address"
            value={editingInvoice.address}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      <div className="form-section">
        <h3>Line Items</h3>
        <button 
          type="button" 
          className="add-line-btn" 
          onClick={handleAddLineItem}
        >
          Add Line Item
        </button>
        {editingInvoice.lineItems.map((item, index) => (
          <div key={index} className="form-section invoice-details-row">
            <label>
              Item No
              <input
                type="text"
                name="itemNo"
                value={item.itemNo}
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            </label>
            <label>
              Description
              <input
                type="text"
                name="description"
                value={item.description}
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            </label>
            <label>
              Quantity
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleInputChange(e, index)}
                min="1"
                required
              />
            </label>
            <label className="amount-label">
              Amount
              <div className="amount-container">
                <input
                  type="number"
                  name="amount"
                  value={item.amount}
                  onChange={(e) => handleInputChange(e, index)}
                  step="0.01"
                  min="0"
                  required
                />
                {editingInvoice.lineItems.length > 1 && (
                  <button
                    type="button"
                    className="remove-line-btn"
                    onClick={() => handleRemoveLineItem(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="form-section">
        <h3>Totals</h3>
        <label>
          Subtotal
          <input 
            type="number" 
            value={editingInvoice.subtotal.toFixed(2)} 
            readOnly 
          />
        </label>
        <label>
          Discount
          <input 
            type="number" 
            name="discount" 
            value={editingInvoice.discount} 
            onChange={handleInputChange}
            step="0.01"
            min="0"
          />
        </label>
        <label>
          GST (%)
          <input 
            type="number" 
            name="gst" 
            value={editingInvoice.gst} 
            onChange={handleInputChange}
            step="0.01"
            min="0"
          />
        </label>
        <label>
          Total
          <input 
            type="number" 
            value={editingInvoice.total.toFixed(2)} 
            readOnly 
          />
        </label>
        <label>
          Status
          <select 
            name="status" 
            value={editingInvoice.status} 
            onChange={handleInputChange}
            required
          >
            <option value="draft">Draft</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </label>
      </div>

      <div className="form-buttons">
        <button 
          type="button" 
          className="save-btn"
          onClick={handleSaveInvoice}
        >
          Save Invoice
        </button>
        <button 
          type="button" 
          className="cancel-btn"
          onClick={handleCancelEdit}
        >
          Cancel
        </button>
      </div>
    </form>
  );

  const renderInvoiceCard = (invoice) => (
    <div key={invoice._id} className="invoice-card">
      <div className="invoice-header">
        <h3>{invoice.companyName}</h3>
        <span className={`status-badge ${invoice.status}`}>
          {invoice.status}
        </span>
      </div>
      <p><strong>Phone:</strong> {invoice.phoneNumber}</p>
      <p><strong>Address:</strong> {invoice.address}</p>
      
      <div className="invoice-line-items">
        {invoice.lineItems.map((item, index) => (
          <div key={index} className="line-item">
            <p>{item.description} (Qty: {item.quantity})</p>
            <p>${item.amount.toFixed(2)} each</p>
          </div>
        ))}
      </div>
      
      <div className="invoice-totals">
        <p><strong>Subtotal:</strong> ${invoice.subtotal.toFixed(2)}</p>
        {invoice.discount > 0 && (
          <p><strong>Discount:</strong> ${invoice.discount.toFixed(2)}</p>
        )}
        {invoice.gst > 0 && (
          <p><strong>GST:</strong> ${((invoice.subtotal - invoice.discount) * invoice.gst / 100).toFixed(2)}</p>
        )}
        <p className="total"><strong>Total:</strong> ${invoice.total.toFixed(2)}</p>
      </div>
      
      <div className="invoice-actions">
        <button 
          className="edit-btn"
          onClick={() => handleEditClick(invoice)}
        >
          Edit
        </button>
        <button 
          className="delete-btn"
          onClick={() => handleDeleteInvoice(invoice._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="invoices-wrapper">
      <Navbar username={user?.username} />
      <div className="invoices-content">
        <h2>{title}</h2>
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : editingInvoice ? (
          renderFormSection()
        ) : (
          <div className="invoices-list">
            {invoices.length > 0 ? (
              invoices.map(renderInvoiceCard)
            ) : (
              <p className="no-invoices">No {status} invoices found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoiceList;