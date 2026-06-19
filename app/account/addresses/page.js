'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';


const DEFAULT_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Home',
    isDefault: true,
    firstName: 'Sarah',
    lastName: 'Mitchell',
    phone: '+1 (555) 234-5678',
    address: '12 Oak Ave',
    city: 'Boston',
    country: 'United States',
    postalCode: '02101'
  },
  {
    id: 'addr-2',
    label: 'Office',
    isDefault: false,
    firstName: 'Sarah',
    lastName: 'Mitchell',
    phone: '+1 (555) 987-6543',
    address: '500 Fifth Ave, Suite 210',
    city: 'New York',
    country: 'United States',
    postalCode: '10110'
  }
];

const LOCAL_STORAGE_KEY = 'opticzone_addresses_v1';

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: 'Home',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: 'United States',
    postalCode: ''
  });

  // Load from local storage or set default on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setAddresses(JSON.parse(stored));
      } else {
        // Initialize with default addresses, matching user name if available
        const initialized = DEFAULT_ADDRESSES.map(addr => {
          if (user) {
            const names = user.name.split(' ');
            return {
              ...addr,
              firstName: names[0] || addr.firstName,
              lastName: names.slice(1).join(' ') || addr.lastName
            };
          }
          return addr;
        });
        setAddresses(initialized);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialized));
      }
    } catch {}
  }, [user]);

  const saveAddresses = (newAddrs) => {
    setAddresses(newAddrs);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newAddrs));
    } catch {}
  };

  const handleOpenAdd = () => {
    const names = user?.name ? user.name.split(' ') : ['', ''];
    setFormData({
      label: 'Home',
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      phone: '',
      address: '',
      city: '',
      country: 'United States',
      postalCode: ''
    });
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleOpenEdit = (addr) => {
    setFormData({ ...addr });
    setEditingAddress(addr);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      const updated = addresses.filter(a => a.id !== id);
      // If we deleted the default, set first remaining as default
      if (updated.length > 0 && !updated.some(a => a.isDefault)) {
        updated[0].isDefault = true;
      }
      saveAddresses(updated);
    }
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    saveAddresses(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAddress) {
      // Edit
      const updated = addresses.map(a => (a.id === editingAddress.id ? { ...formData } : a));
      saveAddresses(updated);
    } else {
      // Add
      const newAddr = {
        ...formData,
        id: `addr-${Date.now()}`,
        isDefault: addresses.length === 0
      };
      saveAddresses([...addresses, newAddr]);
    }
    setShowForm(false);
  };

  return (
    <div>
      <div className="addressPageHeader">
        <h2 className="" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>Saved Addresses</h2>
        <button className="addBtn" onClick={handleOpenAdd}>+ Add Address</button>
      </div>

      <div className="borderLine" />

      {showForm && (
        <div className="formCard">
          <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="formGrid">
              <div className="inputGroup">
                <label>Address Label</label>
                <select value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })}>
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="inputGroup">
                <label>First Name</label>
                <input required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
              </div>
              <div className="inputGroup">
                <label>Last Name</label>
                <input required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
              </div>
              <div className="inputGroup">
                <label>Phone Number</label>
                <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="inputGroup fullWidth">
                <label>Street Address</label>
                <input required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="inputGroup">
                <label>City</label>
                <input required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div className="inputGroup">
                <label>Postal Code</label>
                <input required value={formData.postalCode} onChange={e => setFormData({ ...formData, postalCode: e.target.value })} />
              </div>
              <div className="inputGroup">
                <label>Country</label>
                <input required value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
              </div>
            </div>
            <div className="formActions">
              <button type="button" className="cancelBtn" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="saveSubmitBtn">{editingAddress ? 'Save Changes' : 'Save Address'}</button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="emptyState">
          <p>No saved addresses found. Add one to speed up your checkout process.</p>
        </div>
      ) : (
        <div className="addressGrid">
          {addresses.map(addr => (
            <div key={addr.id} className={`addressCard ${addr.isDefault ? 'defaultCard' : ''}`}>
              <div className="cardHeader">
                <span className="labelBadge">{addr.label}</span>
                {addr.isDefault && <span className="defaultBadge">Default</span>}
              </div>
              <div className="addrDetails">
                <strong>{addr.firstName} {addr.lastName}</strong>
                <p>{addr.address}</p>
                <p>{addr.city}, {addr.postalCode}</p>
                <p>{addr.country}</p>
                <p className="phoneText">📞 {addr.phone}</p>
              </div>
              <div className="cardFooter">
                {!addr.isDefault && (
                  <button className="actionLink" onClick={() => handleSetDefault(addr.id)}>Set as Default</button>
                )}
                <button className="actionLink edit" onClick={() => handleOpenEdit(addr)}>Edit</button>
                <button className="actionLink delete" onClick={() => handleDelete(addr.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .addressPageHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .borderLine {
          height: 1px;
          background: var(--border);
          margin-bottom: 2rem;
        }
        .addBtn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-weight: 600;
          font-family: inherit;
          transition: background 0.2s;
        }
        .addBtn:hover {
          background: var(--primary-dark);
        }
        .addressGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .addressCard {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          background: var(--surface);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .addressCard:hover {
          border-color: var(--border-strong);
          box-shadow: var(--shadow-sm);
        }
        .defaultCard {
          border-color: var(--primary);
          background: var(--primary-subtle);
        }
        .cardHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .labelBadge {
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .defaultBadge {
          background: var(--primary);
          color: white;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .addrDetails {
          flex: 1;
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .addrDetails strong {
          color: var(--text);
          font-size: 1.05rem;
          display: block;
          margin-bottom: 0.4rem;
        }
        .phoneText {
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }
        .cardFooter {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .actionLink {
          border: none;
          background: none;
          padding: 0;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--primary);
          cursor: pointer;
          font-family: inherit;
        }
        .actionLink:hover {
          text-decoration: underline;
        }
        .actionLink.edit {
          color: var(--text-muted);
        }
        .actionLink.delete {
          color: var(--danger);
          margin-left: auto;
        }
        .emptyState {
          text-align: center;
          padding: 3rem;
          color: var(--text-secondary);
        }
        .formCard {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          background: var(--bg-secondary);
        }
        .formCard h3 {
          font-family: 'Playfair Display', serif;
          margin-bottom: 1.5rem;
          font-size: 1.4rem;
          color: var(--text);
        }
        .formGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.2rem;
        }
        .fullWidth {
          grid-column: 1 / -1;
        }
        .inputGroup {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .inputGroup label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text);
        }
        .inputGroup input, .inputGroup select {
          padding: 0.6rem 0.8rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-family: inherit;
          font-size: 0.95rem;
          background: var(--surface);
          color: var(--text);
        }
        .inputGroup input:focus, .inputGroup select:focus {
          outline: 2px solid var(--primary);
        }
        .formActions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .cancelBtn {
          border: 1px solid var(--border);
          background: none;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          font-weight: 600;
          color: var(--text-secondary);
          font-family: inherit;
          cursor: pointer;
        }
        .cancelBtn:hover {
          background: var(--bg-tertiary);
        }
        .saveSubmitBtn {
          background: var(--primary);
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          font-weight: 600;
          color: white;
          font-family: inherit;
          cursor: pointer;
        }
        .saveSubmitBtn:hover {
          background: var(--primary-dark);
        }
      `}</style>
    </div>
  );
}
