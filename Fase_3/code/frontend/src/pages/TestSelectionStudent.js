import React, { useState, useEffect } from 'react';
import { List, Button, Typography, Card } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const TestSelectionStudent = () => {
  const [availableTests, setAvailableTests] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token;
  const userrole = location.state?.userrole;
  const email = location.state?.email;

  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await axios.get(`http://localhost:3003/tests/${localStorage.id}?secret_token=${localStorage.token}`);
        // Assuming that the data you want is in the `data` property of the response
        setAvailableTests(response.data); // Use `response.data`, not `response`
        console.log(response)
      } catch (error) {
        console.error('Error fetching tests:', error);
        // Handle error appropriately
      }
    }

    fetchData()
  }, []);

  const handleTestSelection = (testId) => {
    console.log('Selected test ID:', testId);
    // Implement your test selection logic here
    navigate('/test-answering/'+testId);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Provas</Title>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={availableTests}
        renderItem={test => (
          <List.Item key={test._id}>
            <Card title={test.name} style={{ textAlign: 'center' }}>
              <p>Hora de Inicio: {test.startTime}</p>
              <p>Hora Final: {test.endTime}</p>
              <Button type="primary" onClick={() => handleTestSelection(test._id)}>
                Iniciar Prova
              </Button>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TestSelectionStudent;
