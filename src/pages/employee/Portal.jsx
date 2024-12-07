import { useState, useEffect } from 'react';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Grid } from '@mui/material';
import { getAssignedLaptops, getLaptopRequests, getMyIssues, requestLaptop, reportIssue } from '../../services/employeeService';
import LogoutButton from '../../components/LogoutButton';

function Portal() {
  const [laptops, setLaptops] = useState([]);
  const [laptopRequests, setLaptopRequests] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [issueDetails, setIssueDetails] = useState({ laptopId: '', description: '', priority: '' });
  const [laptopRequest, setLaptopRequest] = useState({ reason: '' });

  useEffect(() => {
    // Fetch assigned laptops
    getAssignedLaptops().then((data) => setLaptops(data));

    // Fetch laptop requests
    getLaptopRequests().then((data) => setLaptopRequests(data));

    // Fetch issues reported by the employee
    getMyIssues().then((data) => setMyIssues(data));
  }, []);

  const handleRequestLaptop = () => {
    if (laptopRequest.reason.trim()) {
      requestLaptop(laptopRequest).then(() => {
        alert('Laptop request submitted successfully');
        setOpenRequestDialog(false);
        setLaptopRequest({ reason: '' });
        // Optionally re-fetch laptop requests if needed
        getLaptopRequests().then((data) => setLaptopRequests(data)); // Re-fetch requests
      });
    } else {
      alert('Please provide a reason for requesting the laptop.');
    }
  };

  const handleReportIssue = () => {
    reportIssue(issueDetails).then(() => {
      alert('Issue reported successfully');
      setOpenReportDialog(false);
      setIssueDetails({ laptopId: '', description: '', priority: '' });
    });
  };

  const openReportIssueDialog = (laptopId) => {
    setIssueDetails({ laptopId, description: '', priority: '' });
    setOpenReportDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'blue';
      case 'APPROVED':
        return 'green';
      case 'REJECTED':
        return 'red';
      case 'OPEN':
        return 'blue';
      case 'RESOLVED':
        return 'green';
      case 'CLOSED':
        return 'red';
      default:
        return 'black';
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        Employee Portal
      </Typography>
      <div>
        <LogoutButton />
      </div>

      {/* Request New Laptop Button */}
      <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => setOpenRequestDialog(true)}>
            Request a New Laptop
          </Button>
        </Grid>
      </Grid>

      {/* Assigned Laptops */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Assigned Laptops
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Serial Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Purchase Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {laptops.map((laptop) => (
                <TableRow key={laptop.id}>
                  <TableCell>{laptop.brand}</TableCell>
                  <TableCell>{laptop.model}</TableCell>
                  <TableCell>{laptop.serialNumber}</TableCell>
                  <TableCell sx={{ color: getStatusColor(laptop.status) }}>
                    {laptop.status}
                  </TableCell>
                  <TableCell>{laptop.purchaseDate}</TableCell>
                  <TableCell>
                    {laptop.status === 'ASSIGNED' && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => openReportIssueDialog(laptop.id)}
                      >
                        Report Issue
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Laptop Requests */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            My Laptop Requests
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request ID</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Requested At</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {laptopRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.reason || 'No reason provided'}</TableCell>
                  <TableCell>{new Date(request.requestedAt).toLocaleString()}</TableCell>
                  <TableCell sx={{ color: getStatusColor(request.status) }}>
                    {request.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* My Issues Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            My Issues
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Laptop Brand</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reported By</TableCell>
                <TableCell>Reported At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myIssues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>{issue.laptop.brand}</TableCell>
                  <TableCell>{issue.laptop.model}</TableCell>
                  <TableCell>{issue.description}</TableCell>
                  <TableCell>{issue.priority}</TableCell>
                  <TableCell sx={{ color: getStatusColor(issue.status) }}>
                    {issue.status}
                  </TableCell>
                  <TableCell>{issue.reportedBy || 'N/A'}</TableCell>
                  <TableCell>{new Date(issue.reportedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

  

      {/* Request New Laptop Dialog */}
      <Dialog open={openRequestDialog} onClose={() => setOpenRequestDialog(false)}>
        <DialogTitle>Request a New Laptop</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={laptopRequest.reason}
            onChange={(e) => setLaptopRequest({ ...laptopRequest, reason: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDialog(false)}>Cancel</Button>
          <Button onClick={handleRequestLaptop}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Report Issue Dialog */}
      <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)}>
        <DialogTitle>Report an Issue</DialogTitle>
        <DialogContent>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={issueDetails.description}
            onChange={(e) => setIssueDetails({ ...issueDetails, description: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={issueDetails.priority}
              onChange={(e) => setIssueDetails({ ...issueDetails, priority: e.target.value })}
            >
              <MenuItem value="LOW">LOW</MenuItem>
              <MenuItem value="MEDIUM">MEDIUM</MenuItem>
              <MenuItem value="HIGH">HIGH</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReportDialog(false)}>Cancel</Button>
          <Button onClick={handleReportIssue}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Portal;
