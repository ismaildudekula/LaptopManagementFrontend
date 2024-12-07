import { useState, useEffect } from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getLaptops, addLaptop, updateLaptop, deleteLaptop, getEmployees, assignLaptop } from '../../services/adminService';

function LaptopManagement() {
  const [laptops, setLaptops] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [newLaptop, setNewLaptop] = useState({
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    status: 'AVAILABLE',
  });
  const [editLaptop, setEditLaptop] = useState(null);
  const [laptopToDelete, setLaptopToDelete] = useState(null);
  const [laptopToAssign, setLaptopToAssign] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    // Fetch the laptop list
    getLaptops().then((data) => setLaptops(data));
    // Fetch the employee list
    getEmployees().then((data) => setEmployees(data));
  }, []);

  const handleAddLaptop = () => {
    addLaptop(newLaptop).then(() => {
      alert('Laptop added successfully');
      setOpenAddDialog(false);
      setNewLaptop({ brand: '', model: '', serialNumber: '', purchaseDate: '', status: 'AVAILABLE' });
      getLaptops().then((data) => setLaptops(data)); // Refresh the list
    });
  };

  const handleUpdateLaptop = () => {
    if (editLaptop) {
      updateLaptop(editLaptop.id, editLaptop).then(() => {
        alert('Laptop updated successfully');
        setOpenEditDialog(false);
        getLaptops().then((data) => setLaptops(data)); // Refresh the list
      });
    }
  };

  const handleDeleteLaptop = () => {
    deleteLaptop(laptopToDelete).then(() => {
      alert('Laptop deleted successfully');
      setOpenDeleteDialog(false);
      getLaptops().then((data) => setLaptops(data)); // Refresh the list
    });
  };

  const handleAssignLaptop = () => {
    if (laptopToAssign && selectedEmployee) {
      assignLaptop(laptopToAssign, selectedEmployee).then(() => {
        alert('Laptop assigned successfully');
        setOpenAssignDialog(false);
        getLaptops().then((data) => setLaptops(data)); // Refresh the list
      });
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Manage Laptops
      </Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpenAddDialog(true)}>
        + Add Laptop
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Brand</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Serial Number</TableCell>
            <TableCell>Purchase Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {laptops.map((laptop) => (
            <TableRow key={laptop.id}>
              <TableCell>{laptop.brand}</TableCell>
              <TableCell>{laptop.model}</TableCell>
              <TableCell>{laptop.serialNumber}</TableCell>
              <TableCell>{laptop.purchaseDate}</TableCell>
              <TableCell>{laptop.status}</TableCell>
              <TableCell>
                {/* Edit Button */}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    setEditLaptop(laptop);
                    setOpenEditDialog(true);
                  }}
                >
                  Edit
                </Button>
                {/* Delete Button */}
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    setLaptopToDelete(laptop.id);
                    setOpenDeleteDialog(true);
                  }}
                >
                  Delete
                </Button>
                {/* Assign Button (hidden if assigned or under maintenance) */}
                {laptop.status !== 'ASSIGNED' && laptop.status !== 'MAINTENANCE' && (
                  <Button
                    variant="contained"
                    style={{ backgroundColor: 'green', color: 'white' }}
                    onClick={() => {
                      setLaptopToAssign(laptop.id);
                      setOpenAssignDialog(true);
                    }}
                  >
                    Assign
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Laptop Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Laptop</DialogTitle>
        <DialogContent>
          <TextField
            label="Brand"
            fullWidth
            margin="normal"
            value={newLaptop.brand}
            onChange={(e) => setNewLaptop({ ...newLaptop, brand: e.target.value })}
          />
          <TextField
            label="Model"
            fullWidth
            margin="normal"
            value={newLaptop.model}
            onChange={(e) => setNewLaptop({ ...newLaptop, model: e.target.value })}
          />
          <TextField
            label="Serial Number"
            fullWidth
            margin="normal"
            value={newLaptop.serialNumber}
            onChange={(e) => setNewLaptop({ ...newLaptop, serialNumber: e.target.value })}
          />
          <TextField
            label="Purchase Date"
            type="date"
            fullWidth
            margin="normal"
            value={newLaptop.purchaseDate}
            onChange={(e) => setNewLaptop({ ...newLaptop, purchaseDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddLaptop}>Add Laptop</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Laptop Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Laptop</DialogTitle>
        <DialogContent>
          <TextField
            label="Brand"
            fullWidth
            margin="normal"
            value={editLaptop?.brand || ''}
            onChange={(e) => setEditLaptop({ ...editLaptop, brand: e.target.value })}
          />
          <TextField
            label="Model"
            fullWidth
            margin="normal"
            value={editLaptop?.model || ''}
            onChange={(e) => setEditLaptop({ ...editLaptop, model: e.target.value })}
          />
          <TextField
            label="Serial Number"
            fullWidth
            margin="normal"
            value={editLaptop?.serialNumber || ''}
            onChange={(e) => setEditLaptop({ ...editLaptop, serialNumber: e.target.value })}
          />
          <TextField
            label="Purchase Date"
            type="date"
            fullWidth
            margin="normal"
            value={editLaptop?.purchaseDate || ''}
            onChange={(e) => setEditLaptop({ ...editLaptop, purchaseDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateLaptop}>Update Laptop</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Laptop Dialog */}
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)}>
        <DialogTitle>Assign Laptop</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Employee</InputLabel>
            <Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name} ({employee.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
          <Button onClick={handleAssignLaptop}>Assign</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this laptop?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteLaptop}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default LaptopManagement;
