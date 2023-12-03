import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FetchUserList, Removeuser } from "../Redux/Action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Userlisting = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    props.loaduser();
  }, []);

  

  const handledelete = () => {
    if (window.confirm("Do you want to remove selected users?")) {
      selectedUsers.forEach((id) => {
        props.removeuser(id);
      });
      props.loaduser();
      toast.success("Selected users removed successfully.");
      setSelectedUsers([]);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const filteredUsers = props.user.userlist.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
        props.user.loading ? (
            <div>
              <h2>Loading...</h2>
            </div>
          ) : props.user.errmessage ? (
            <div>
              <h2>{props.user.errmessage}</h2>
            </div>
          ) : (
            <div>
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div className="mr-auto">
                    <input
                      type="text"
                      placeholder="Enter Value..."
                      onChange={handleSearch}
                      className="form-control"
                    />
                  </div>
                  <div>
                    {selectedUsers.length > 0 ? (
                      <button
                      onClick={() => {
                        handledelete(); // Remove the argument here
                      }}
                      className="btn btn-danger"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    ) : (
                      <Link to={"/user/add"} className="btn btn-success">
                        Add User [+]
                      </Link>
                    )}
                  </div>
                </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <thead className="bg-dark text-white">
                    <tr>
                      <td>Select</td>
                      <td>Name</td>
                      <td>Email</td>
                      <td>Role</td>
                      <td>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.role}</td>
    
                        <td>
                          <Link
                            to={"/user/edit/" + item.id}
                            className="btn btn-primary"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>{" "}
                          &nbsp;
                          <button
                            onClick={() => {
                              handledelete(item.id);
                            }}
                            className="btn btn-danger"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center">
                <div>
                  <span>{` ${selectedUsers.length} of ${filteredUsers.length} row(s) selected. `}</span>
                </div>
                <ul className="pagination">
                <li className="page-item">
                <span className="page-link">{`Page ${currentPage} of ${Math.ceil(filteredUsers.length / usersPerPage)}`}</span>
                </li> &nbsp;&nbsp;&nbsp;
                  <li className="page-item">
                    <button
                      onClick={() => paginate(1)}
                      className="page-link"
                      disabled={currentPage === 1}
                    >
                      {"<<"}
                    </button>
                  </li>
                  <li className="page-item">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      className="page-link"
                      disabled={currentPage === 1}
                    >
                      {"<"}
                    </button>
                  </li>
                  {[...Array(Math.ceil(filteredUsers.length / usersPerPage))].map(
                    (page, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button
                          onClick={() => paginate(index + 1)}
                          className="page-link"
                        >
                          {index + 1}
                        </button>
                      </li>
                    )
                  )}
                  <li className="page-item">
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      className="page-link"
                      disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                    >
                      {">"}
                    </button>
                  </li>
                  <li className="page-item">
                    <button
                      onClick={() => paginate(Math.ceil(filteredUsers.length / usersPerPage))}
                      className="page-link"
                      disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                    >
                      {">>"}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )
      );
    };
    

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loaduser: () => dispatch(FetchUserList()),
    removeuser: (id) => dispatch(Removeuser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Userlisting);
