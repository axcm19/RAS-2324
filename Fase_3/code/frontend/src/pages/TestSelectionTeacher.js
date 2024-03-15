import React, { useState, useEffect } from 'react';
import { List, Button, Card, Typography, Space, Divider } from 'antd';
import '../components/TestSelector.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const TestSelectionTeacher = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [testList, setTestList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Replace with your actual data fetching logic
    axios.get(`http://localhost:3003/tests/${localStorage.id}`)
      .then(response => setTestList(response.data))
      .catch(error => console.error('Error fetching tests:', error));
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const visualizeTest = () => {
    alert(`Visualizing: ${selectedTest}`);
    // Visualization logic here
  };

  const editTest = () => {
    alert(`Editing: ${selectedTest}`);
    // Edit logic here
  };

  const shareTest = () => {
    alert(`Sharing: ${selectedTest}`);
    // Share logic here
    handleNavigation('/test-selector')
  };

  const correctTest = () => {
    alert(`Correcting: ${selectedTest}`);
    console.log(selectedTest)
    // Share logic here
    handleNavigation('/test-correction/'+selectedTest._id)
  };

  return (
      <>
      <Title level={2}>Selecionar Prova</Title>
      <List
        size="big"
        dataSource={testList}
        renderItem={item => (
          <List.Item>
            <Card
              title={item.name}
              bordered={false}
              className={selectedTest === item ? 'selected-test-card' : 'test-card'}
              onClick={() => setSelectedTest(item)}
            >
              <Text>{`Details about ${item.teachers}`}</Text> {/* Replace with actual details */}
            </Card>
          </List.Item>
        )}
      />
      <Space>
        <Button 
          onClick={visualizeTest} 
          disabled={!selectedTest} 
          type="primary"
        >
          Visualizar Prova
        </Button>
        <Button 
          onClick={editTest} 
          disabled={!selectedTest}
          type="default"
        >
          Editar Prova
        </Button>
        <Button 
          onClick={shareTest} 
          disabled={!selectedTest} 
          type="dashed"
        >
          Partilhar Prova
        </Button>
        <Button 
          onClick={correctTest} 
          disabled={!selectedTest} 
          type="dashed"
        >
          Corrigir Prova
        </Button>
      </Space>
    </>
  );
};

export default TestSelectionTeacher;
