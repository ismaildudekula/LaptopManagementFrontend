import { useState, useEffect } from 'react';
import { Button, Container, Grid, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getLaptops, getLaptopRequests, getReportedIssues, updateLaptopRequestStatus, updateIssueStatus } from '../../services/adminService';
import LogoutButton from '../../components/LogoutButton';

function Dashboard() {
  const [laptopRequests, setLaptopRequests] = useState([]);
  const [reportedIssues, setReportedIssues] = useState([]);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [issueStatusDialogOpen, setIssueStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [metrics, setMetrics] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    maintenance: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch laptop requests and reported issues
    getLaptopRequests().then((data) => setLaptopRequests(data));
    getReportedIssues().then((data) => setReportedIssues(data));

    // Fetch laptops and calculate metrics
    getLaptops().then((data) => {
      calculateMetrics(data);
    });
  }, []);

  const calculateMetrics = (laptops) => {
    const total = laptops.length;
    const available = laptops.filter((laptop) => laptop.status === 'AVAILABLE').length;
    const assigned = laptops.filter((laptop) => laptop.status === 'ASSIGNED').length;
    const maintenance = laptops.filter((laptop) => laptop.status === 'MAINTENANCE').length;

    setMetrics({ total, available, assigned, maintenance });
  };

  const handleStatusChange = () => {
    // Update the status of the selected laptop request
    updateLaptopRequestStatus(selectedRequestId, selectedStatus).then(() => {
      alert('Laptop request status updated successfully');
      setStatusDialogOpen(false);
      // Re-fetch laptop requests after status update
      getLaptopRequests().then((data) => setLaptopRequests(data));
    });
  };

  const handleIssueStatusChange = () => {
    // Update the status of the selected reported issue
    updateIssueStatus(selectedIssueId, selectedStatus).then(() => {
      alert('Issue status updated successfully');
      setIssueStatusDialogOpen(false);
      // Re-fetch reported issues after status update
      getReportedIssues().then((data) => setReportedIssues(data));
    });
  };

  const openStatusDialog = (id) => {
    setSelectedRequestId(id);
    setStatusDialogOpen(true);
  };

  const openIssueStatusDialog = (id) => {
    setSelectedIssueId(id);
    setIssueStatusDialogOpen(true);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      <div>
        <LogoutButton />
      </div>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Laptops
              </Typography>
              <Typography variant="h4">{metrics.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Laptops
              </Typography>
              <Typography variant="h4">{metrics.available}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assigned Laptops
              </Typography>
              <Typography variant="h4">{metrics.assigned}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Under Maintenance
              </Typography>
              <Typography variant="h4">{metrics.maintenance}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Navigation Buttons for Managing Laptops and Employees */}
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item>
          <Button variant="contained" onClick={() => navigate('/admin/laptops')}>
            Manage Laptops
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => navigate('/admin/employees')}>
            Manage Employees
          </Button>
        </Grid>
      </Grid>

      {/* Laptop Requests Table */}
      <Typography variant="h5" gutterBottom>
        Laptop Requests
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Requested By</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Requested At</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {laptopRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.requestedBy}</TableCell>
              <TableCell>{request.reason || 'No reason provided'}</TableCell>
              <TableCell>{new Date(request.requestedAt).toLocaleString()}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => openStatusDialog(request.id)}
                >
                  Change Status
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Reported Issues Table */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Reported Issues
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
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportedIssues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>{issue.laptop.brand}</TableCell>
              <TableCell>{issue.laptop.model}</TableCell>
              <TableCell>{issue.description}</TableCell>
              <TableCell>{issue.priority}</TableCell>
              <TableCell>{issue.status}</TableCell>
              <TableCell>{issue.reportedBy || 'N/A'}</TableCell>
              <TableCell>{new Date(issue.reportedAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => openIssueStatusDialog(issue.id)}
                >
                  Change Status
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Laptop Request Status Change Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Change Laptop Request Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="APPROVED">APPROVED</MenuItem>
              <MenuItem value="REJECTED">REJECTED</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusChange}>Change Status</Button>
        </DialogActions>
      </Dialog>

      {/* Reported Issue Status Change Dialog */}
      <Dialog open={issueStatusDialogOpen} onClose={() => setIssueStatusDialogOpen(false)}>
        <DialogTitle>Change Issue Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <MenuItem value="OPEN">OPEN</MenuItem>
              <MenuItem value="RESOLVED">RESOLVED</MenuItem>
              <MenuItem value="CLOSED">CLOSED</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIssueStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleIssueStatusChange}>Change Status</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;
