import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getDashboardData = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
};

export const addLaptop = async (laptopData) => {
  const response = await axios.post(`${API_URL}/laptops`, laptopData);
  return response.data;
};


export const getLaptops = async () => {
    const response = await axios.get(`${API_URL}/laptops`);
    return response.data;
  };

// Update an existing laptop
export const updateLaptop = async (laptopId, laptopData) => {
    const response = await axios.put(`${API_URL}/laptops/${laptopId}`, laptopData);
    return response.data;
  };
  
  // Delete an existing laptop
export const deleteLaptop = async (laptopId) => {
    const response = await axios.delete(`${API_URL}/laptops/${laptopId}`);
    return response.data;
};

// Fetch all employees
export const getEmployees = async () => {
    const response = await axios.get(`${API_URL}/employees`);
    return response.data;
  };
  
  // Assign a laptop to an employee
  export const assignLaptop = async (laptopId, employeeId) => {
    const response = await axios.post(`${API_URL}/assignments/assign/${laptopId}/${employeeId}`);
    return response.data;
  };
  

// Fetch assignments for a specific employee
export const getEmployeeAssignments = async (employeeId) => {
  const response = await axios.get(`${API_URL}/assignments/employee/${employeeId}`);
  return response.data;
};

// Unassign a laptop from an employee
export const unassignLaptop = async (assignmentId) => {
  const response = await axios.put(`${API_URL}/assignments/unassign/${assignmentId}`);
  return response.data;
};

// Fetch laptop requests
export const getLaptopRequests = async () => {
  const response = await axios.get(`${API_URL}/laptops/laptop-requests`);
  return response.data;
};

// Fetch reported issues
export const getReportedIssues = async () => {
  const response = await axios.get(`${API_URL}/issues`);
  return response.data;
};

// Update laptop request status
export const updateLaptopRequestStatus = async (id, newStatus) => {
  const response = await axios.put(`${API_URL}/laptops/laptop-requests/change-status/${id}`, { newStatus });
  return response.data;
};


// Update issue status
export const updateIssueStatus = async (id, issueStatus) => {
  const response = await axios.put(
    `${API_URL}/issues/update-status/${id}`,
    { issueStatus }, // Payload
    {
      headers: {
        'Content-Type': 'application/json', // Ensure JSON content type
      },
    }
  );
  return response.data;
};




