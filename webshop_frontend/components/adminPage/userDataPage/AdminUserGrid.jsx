const AdminUserGrid = ({
  user,
  onDelete,
  onResetPassword,
  onActivateProfile,
}) => {
  return (
    <div className="admin-user-item">
      <h5>{`${user.firstName} ${user.lastName}`}</h5>
      <h6>{user.email}</h6>

      <h6>
        {user.confirmEmailToken && !user.isDeleted && (
          <div className="btn-delete">
            <button
              className="primary-button"
              onClick={() => onActivateProfile(user._id)}
            >
              Activate
            </button>
          </div>
        )}
      </h6>

      {!user.isDeleted ? (
        <div className="btn-delete">
          <button
            className="primary-button"
            onClick={() => onResetPassword(user.email)}
          >
            Reset
          </button>
        </div>
      ) : (
        <h6></h6>
      )}

      {!user.isDeleted ? (
        <div className="btn-delete">
          <button className="primary-button" onClick={onDelete}>
            Delete
          </button>
        </div>
      ) : (
        <h6>Deleted</h6>
      )}
    </div>
  );
};

export default AdminUserGrid;
