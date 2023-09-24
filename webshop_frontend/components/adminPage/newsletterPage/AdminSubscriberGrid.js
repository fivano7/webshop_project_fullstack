function AdminSubscriberGrid({ subscriber, onDelete }) {
  return (
    <div className="admin-subscriber-item">
      <h5>{subscriber.email}</h5>
      <h6>Active: {subscriber.isActive ? "Yes" : "No"}</h6>
      <div className="btn-delete">
        <button className="primary-button" onClick={onDelete}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default AdminSubscriberGrid;
