'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';


export default function OrderTrackingPage() {
  const { user } = useAuth();
  const { orders } = useStore();
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [typedOrderId, setTypedOrderId] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Get orders matching user email
  const userOrders = orders.filter(o => o.customer.email === user?.email);

  useEffect(() => {
    // Select first order by default if available
    if (userOrders.length > 0) {
      setSelectedOrderId(userOrders[0].id);
      setCurrentOrder(userOrders[0]);
    }
  }, [orders, user]);

  const handleDropdownChange = (e) => {
    const id = e.target.value;
    setSelectedOrderId(id);
    setSearchError('');
    if (id) {
      const found = orders.find(o => o.id === id);
      setCurrentOrder(found);
    } else {
      setCurrentOrder(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!typedOrderId.trim()) return;
    
    const formattedId = typedOrderId.trim().toLowerCase();
    const found = orders.find(o => String(o.id).toLowerCase() === formattedId);

    if (found) {
      setCurrentOrder(found);
      setSelectedOrderId('');
      setSearchError('');
    } else {
      setSearchError(`No order found with ID "${formattedId}". Please check your order confirmation email.`);
    }
  };

  // Determine stage active indexes
  const getStageStatus = (status) => {
    switch (status) {
      case 'completed': return 5;
      case 'processing': return 2;
      case 'pending': return 1;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  const currentStage = currentOrder ? getStageStatus(currentOrder.status) : 0;

  const timelineSteps = [
    { title: 'Order Placed', desc: 'We have received your order.', time: 'June 19, 10:30 AM' },
    { title: 'Processing', desc: 'Your frames are being prepared and lens package custom-fit.', time: 'June 19, 1:15 PM' },
    { title: 'Shipped', desc: 'Handed over to carrier (OpticExpress).', time: 'June 20, 9:00 AM' },
    { title: 'Out for Delivery', desc: 'Courier is delivering to your address today.', time: 'June 21, 8:30 AM' },
    { title: 'Delivered', desc: 'Delivered and signed at doorstep.', time: 'June 21, 2:45 PM' }
  ];

  return (
    <div>
      <h2 className="">Track Your Order</h2>

      <div className="searchSection">
        {userOrders.length > 0 && (
          <div className="selectorWrap">
            <label htmlFor="orderSelect">Select one of your orders:</label>
            <select id="orderSelect" value={selectedOrderId} onChange={handleDropdownChange} className="styledInput">
              <option value="">-- Select Order --</option>
              {userOrders.map(o => (
                <option key={o.id} value={o.id}>
                  {o.id} - Placed on {new Date(o.date).toLocaleDateString()} (${o.total.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleSearchSubmit} className="searchForm">
          <label htmlFor="searchId">Or enter any Order ID:</label>
          <div className="inputRow">
            <input
              id="searchId"
              type="text"
              placeholder="e.g. 550e8400-e29b..."
              value={typedOrderId}
              onChange={e => setTypedOrderId(e.target.value)}
              className="styledInput"
            />
            <button type="submit" className="trackBtn">Track</button>
          </div>
        </form>
      </div>

      {searchError && <p className="errorMessage">⚠️ {searchError}</p>}

      {currentOrder ? (
        <div className="trackingDetailsCard">
          <div className="cardHeader">
            <div>
              <h3>Order {currentOrder.id}</h3>
              <p className="subtext">Carrier: <strong>OpticExpress</strong> &middot; Tracking: <strong>OE-{currentOrder.id.replace('ORD-', '')}-US</strong></p>
            </div>
            <div className="headerStatus">
              <span className={`statusBadge ${currentOrder.status}`}>{currentOrder.status}</span>
            </div>
          </div>

          {currentOrder.status === 'cancelled' ? (
            <div className="cancelledBanner">
              <h4>❌ This order has been cancelled</h4>
              <p>Refund has been processed. If you have any questions, please contact our support team.</p>
            </div>
          ) : (
            <div className="timelineContainer">
              <div className="timelineLine">
                <div className="timelineProgress" style={{ height: `${((Math.max(0, currentStage - 1)) / (timelineSteps.length - 1)) * 100}%` }} />
              </div>
              <div className="timelineSteps">
                {timelineSteps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isCompleted = stepNum <= currentStage;
                  const isCurrent = stepNum === currentStage;
                  
                  return (
                    <div key={idx} className={`timelineStep ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                      <div className="stepIndicator">
                        {isCompleted ? '✓' : stepNum}
                      </div>
                      <div className="stepContent">
                        <div className="stepHeader">
                          <h4>{step.title}</h4>
                          {isCompleted && <span className="stepTime">{step.time}</span>}
                        </div>
                        <p>{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="orderSummarySection">
            <h4>Order Summary</h4>
            <div className="summaryItems">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="summaryItem">
                  <span>{item.qty}x {item.name} ({item.brand})</span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summaryTotal">
              <span>Total Paid:</span>
              <strong>${currentOrder.total.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="emptyState">
          <span className="emptyIcon">📦</span>
          <h3>No order selected for tracking</h3>
          <p>Please select an order from the dropdown above or enter your Order ID to see real-time delivery status.</p>
        </div>
      )}

      <style jsx>{`
        .searchSection {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 2rem;
          background: var(--bg-secondary);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        .selectorWrap, .searchForm {
          flex: 1;
          min-width: 250px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .selectorWrap label, .searchForm label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text);
        }
        .inputRow {
          display: flex;
          gap: 0.5rem;
        }
        .styledInput {
          flex: 1;
          padding: 0.6rem 0.8rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.95rem;
          background: var(--surface);
          color: var(--text);
        }
        .styledInput:focus {
          outline: 2px solid var(--primary);
        }
        .trackBtn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
        }
        .trackBtn:hover {
          background: var(--primary-dark);
        }
        .errorMessage {
          color: var(--danger);
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          font-weight: 500;
        }
        .trackingDetailsCard {
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          background: var(--surface);
          box-shadow: var(--shadow-sm);
        }
        .cardHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        .cardHeader h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          margin-bottom: 0.25rem;
          color: var(--text);
        }
        .subtext {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .statusBadge {
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .statusBadge.completed { background: #d1fae5; color: #065f46; }
        .statusBadge.pending { background: #fef3c7; color: #92400e; }
        .statusBadge.processing { background: #dbeafe; color: #1e40af; }
        .statusBadge.cancelled { background: #fee2e2; color: #991b1b; }
        
        .cancelledBanner {
          background: var(--danger-bg);
          border: 1px solid #fee2e2;
          border-radius: 12px;
          padding: 1.5rem;
          color: #991b1b;
          margin-bottom: 2rem;
        }
        .cancelledBanner h4 {
          margin-bottom: 0.5rem;
        }

        .timelineContainer {
          display: flex;
          position: relative;
          margin-bottom: 2.5rem;
          padding-left: 1.5rem;
        }
        .timelineLine {
          position: absolute;
          left: 31px;
          top: 20px;
          bottom: 20px;
          width: 4px;
          background: var(--bg-tertiary);
          border-radius: 2px;
        }
        .timelineProgress {
          width: 100%;
          background: var(--success);
          border-radius: 2px;
          transition: height 0.5s ease-in-out;
        }
        .timelineSteps {
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
          width: 100%;
        }
        .timelineStep {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }
        .stepIndicator {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          color: var(--text-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
          border: 3px solid var(--surface);
          box-shadow: 0 0 0 1px var(--border);
          z-index: 1;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .timelineStep.completed .stepIndicator {
          background: var(--success);
          color: white;
          box-shadow: 0 0 0 1px var(--success);
        }
        .timelineStep.current .stepIndicator {
          background: var(--primary);
          color: white;
          box-shadow: 0 0 0 3px var(--primary-subtle);
          transform: scale(1.1);
        }
        .stepContent {
          flex: 1;
          background: var(--bg-secondary);
          padding: 1rem 1.25rem;
          border-radius: 10px;
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }
        .timelineStep.current .stepContent {
          border-color: var(--primary-light);
          background: var(--surface);
          box-shadow: var(--shadow-sm);
        }
        .stepHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        .stepHeader h4 {
          font-size: 1.05rem;
          color: var(--text);
        }
        .timelineStep.current .stepHeader h4 {
          color: var(--primary-dark);
        }
        .stepTime {
          font-size: 0.8rem;
          color: var(--text-muted);
          background: var(--bg-tertiary);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }
        .stepContent p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .orderSummarySection {
          background: var(--bg-secondary);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid var(--border);
        }
        .orderSummarySection h4 {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.5rem;
          color: var(--text);
        }
        .summaryItems {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1rem;
        }
        .summaryItem {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .summaryTotal {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.1rem;
          padding-top: 0.8rem;
          border-top: 1px dashed var(--border);
        }
        .summaryTotal strong {
          color: var(--primary);
          font-size: 1.25rem;
        }

        .emptyState {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        }
        .emptyIcon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          display: inline-block;
        }
        .emptyState h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: var(--text);
          margin-bottom: 0.5rem;
        }
        .emptyState p {
          max-width: 450px;
          margin: 0 auto;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
}
