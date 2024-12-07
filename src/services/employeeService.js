import axios from 'axios';

const API_URL = 'http://localhost:8080/api/employee'; // Base URL for employee endpoints

// Fetch assigned laptops
export const getAssignedLaptops = async () => {
  const response = await axios.get(`${API_URL}/my-laptops`);
  return response.data;
};

// Request a new laptop
export const requestLaptop = async (request) => {
  const response = await axios.post(`${API_URL}/request-laptop`, request);
  return response.data;
};

// Report an issue
export const reportIssue = async (issue) => {
  const response = await axios.post(`${API_URL}/report-issue`, issue);
  return response.data;
};

// Fetch laptop requests
export const getLaptopRequests = async () => {
  const response = await axios.get(`${API_URL}/my-laptop-requests`);
  return response.data;
};

// Fetch the issues reported by the employee
export const getMyIssues = async () => {
  const response = await axios.get(`${API_URL}/my-issues`);
  return response.data;  // Assuming it returns a list of issues
};
