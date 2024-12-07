import { useState, useEffect } from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { getEmployees, getEmployeeAssignments, unassignLaptop } from '../../services/adminService';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [employeeAssignments, setEmployeeAssignments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [openUnassignDialog, setOpenUnassignDialog] = useState(false);

  useEffect(() => {
    // Fetch all employees
    getEmployees().then((data) => setEmployees(data));
  }, []);

  const openUnassignDialogHandler = (employee) => {
    setSelectedEmployee(employee);
    // Fetch assignments for the selected employee
    getEmployeeAssignments(employee.id).then((assignments) => setEmployeeAssignments(assignments));
    setOpenUnassignDialog(true);
  };

  const handleUnassignLaptop = () => {
    unassignLaptop(selectedAssignment).then(() => {
      alert('Laptop unassigned successfully');
      // Refresh the assignments list after unassigning
      getEmployeeAssignments(selectedEmployee.id).then((assignments) => setEmployeeAssignments(assignments));
      setOpenUnassignDialog(false);
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Employee Management
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>
                <Button onClick={() => openUnassignDialogHandler(employee)}>Unassign Laptop</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Unassign Laptop Dialog */}
      <Dialog open={openUnassignDialog} onClose={() => setOpenUnassignDialog(false)}>
        <DialogTitle>Unassign Laptop</DialogTitle>
        <DialogContent>
          {employeeAssignments.length > 0 ? (
            <FormControl fullWidth>
              <InputLabel>Laptop</InputLabel>
              <Select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
              >
                {employeeAssignments.map((assignment) => (
                  <MenuItem key={assignment.id} value={assignment.id}>
                    {assignment.laptop.brand} {assignment.laptop.model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography>No laptops assigned to this employee.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUnassignDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUnassignLaptop}
            disabled={!selectedAssignment || employeeAssignments.length === 0}
          >
            Unassign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default EmployeeManagement;
