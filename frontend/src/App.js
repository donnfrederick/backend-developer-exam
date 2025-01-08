import { useState, useEffect } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [items, setItems] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [showToastErr, setShowToastErr] = useState(false);
  const [toastErrMessage, setToastErrMessage] = useState("");

  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");

  const [editItemID, setEditItemID] = useState("");
  const [editItemName, setEditItemName] = useState("");
  const [editItemDescription, setEditItemDescription] = useState("");
  
  const [deleteItemID, setDeleteItemID] = useState("");
  const [deleteItemName, setDeleteItemName] = useState("");
  const [deleteItemDescription, setDeleteItemDescription] = useState("");
  
  const toggleToast = () => {
    setShowToast(prevState => !prevState);
  }

  const toggleToastErr = () => {
    setShowToastErr(prevState => !prevState);
  }

  const toggleAddModal = () => {
    setShowAddModal(prevState => !prevState);
  };
  const toggleEditModal = () => {
    setShowEditModal(prevState => !prevState);
  };

  const toggleDeleteModal = () => {
    setShowDeleteModal(prevState => !prevState);
  }

  const submitItem = async () => {
    if (itemName === '' && itemDescription === '') {
      toggleAddModal();
      toggleToastErr();
      setToastErrMessage("All fields are required");

      setTimeout(() => {
        toggleToastErr();
      }, 5000);
    } else {
      try {
        await axios.post('http://localhost:3001/api/items', {
          name: itemName,
          description: itemDescription,
          created_at: new Date()
        });
  
        getItems();
  
        toggleAddModal();
        toggleToast();
        setToastMessage("Item has been created successfully");
  
        setItemName("");
        setItemDescription("");
  
        setTimeout(() => {
          toggleToast();
        }, 5000);
      } catch (error) {
        toggleAddModal();
        toggleToastErr();
        setToastErrMessage("An error occured");

        setTimeout(() => {
          toggleToastErr();
        }, 5000);
        
        console.log(error);
      }
    }
  }

  const getItems = async () => {
    try {
      const { data } = await axios.get('http://localhost:3001/api/items');

      setItems(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  }

  useEffect(() => {
    const fetchItems = async () => {
      await getItems();
    }

    fetchItems();
  }, []);

  const putOnEdit = (item) => {
    toggleEditModal();

    setEditItemID(item._id);
    setEditItemName(item.name);
    setEditItemDescription(item.description);
  }

  const submitUpdate = async () => {
    if (editItemName === '' && editItemDescription === '') {
      toggleEditModal();
      toggleToastErr();
      setToastErrMessage("All fields are required");

      setTimeout(() => {
        toggleToastErr();
      }, 5000);
    } else {
      try {
        await axios.put(`http://localhost:3001/api/items/${editItemID}`, {
          name: editItemName,
          description: editItemDescription
        });

        getItems();

        toggleEditModal();
        toggleToast();
        setToastMessage("Item has been updated successfully");

        setItemName("");
        setItemDescription("");

        setTimeout(() => {
          toggleToast();
        }, 5000);
      } catch (error) {
        toggleEditModal();
        toggleToastErr();
        setToastErrMessage("An error occured");

        setTimeout(() => {
          toggleToastErr();
        }, 5000);
        
        console.log(error);
      }
    }
  }

  const putOnDelete = (item) => {
    toggleDeleteModal();

    setDeleteItemID(item._id);
    setDeleteItemName(item.name);
    setDeleteItemDescription(item.description);
  }

  const submitDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/items/${deleteItemID}`);

      getItems();

      toggleDeleteModal();
      toggleToast();
      setToastMessage("Item has been deleted successfully");

      setTimeout(() => {
        toggleToast();
      }, 5000);
    } catch (error) {
      toggleDeleteModal();
      toggleToastErr();
      setToastErrMessage("An error occured");

      setTimeout(() => {
        toggleToastErr();
      }, 5000);
      
      console.log(error);
    }
  }

  return (
    <div>
      {showToast && <div className="toast-message">
        { toastMessage }
      </div>}

      {showToastErr && <div className="toast-error-message">
        { toastErrMessage }
      </div>}
      <div className='item-container'>
        <h1>Items
          <button
            className="btn btn-success"
            style={
              { float: 'right' }
            }
            onClick={toggleAddModal}
          >
            <FontAwesomeIcon icon={ faPlus } /> Add Item
          </button>
        </h1>
        <div className="row">
          <div className="col-lg-12 grid-margin">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>
                      #
                    </th>
                    <th>
                      Item Name
                    </th>
                    <th>
                      Item Description
                    </th>
                    <th>
                      Create Date
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="font-weight-medium">
                          {index + 1}
                        </td>
                        <td>
                          {item.name}
                        </td>
                        <td>
                          {item.description}
                        </td>
                        <td>
                          {item.created_at}
                        </td>
                        <td>
                        <button className='btn btn-primary btn-icons mx-1' onClick={() => { putOnEdit(item) }}><FontAwesomeIcon icon={ faEdit } /></button>
                        <button className='btn btn-danger btn-icons mx-1' onClick={() => { putOnDelete(item) }}><FontAwesomeIcon icon={ faTrashCan } /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modals">
            <div className="modal-header">
              <h2>Add Item</h2>
              <button onClick={toggleAddModal} className="close-btn">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form className="form">
                <div className="form-group mb-3">
                  <input className="form-control" placeholder="Item Name" onInput={ (e) => setItemName(e.target.value) } value={itemName} />
                </div>
                <div className="form-group mb-3">
                  <textarea className="form-control" placeholder="Item Description" onInput={ (e) => setItemDescription(e.target.value) } value={itemDescription}></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-success mx-3" onClick={submitItem}>Submit</button>
              <button onClick={toggleAddModal} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modals">
            <div className="modal-header">
              <h2>Edit Item</h2>
              <button onClick={toggleEditModal} className="close-btn">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form className="form">
                <div className="form-group mb-3">
                  <input className="form-control" placeholder="Item Name" onInput={ (e) => setEditItemName(e.target.value) } value={editItemName} />
                </div>
                <div className="form-group mb-3">
                  <textarea className="form-control" placeholder="Item Description" onInput={ (e) => setEditItemDescription(e.target.value) } value={editItemDescription}></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-success mx-3" onClick={submitUpdate}>Submit</button>
              <button onClick={toggleEditModal} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modals">
            <div className="modal-header">
              <h2>Delete Item</h2>
              <button onClick={toggleDeleteModal} className="close-btn">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this item?</p>
              <p>Item Name: <span className="text-primary">{deleteItemName}</span></p>
              <p>Item Description: <span className="text-primary">{deleteItemDescription}</span></p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger mx-3" onClick={submitDelete}>Delete</button>
              <button onClick={toggleDeleteModal} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;