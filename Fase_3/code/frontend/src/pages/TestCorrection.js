import React, { useState, useEffect } from 'react';
import { List, Card, Button, Typography } from 'antd';
import '../components/TestSelector.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const { Text } = Typography;

const TestSelector = () => {
  const [testList, setTestList] = useState([]);
  const { testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ola")
    axios.get(`http://localhost:3003/tests/${testId}/students`)
      .then(response => setTestList(response.data))
      .catch(error => console.error('Error fetching tests:', error));
  }, []);

  const handleCorrection = (testId, studentId) => {
    navigate(`/test-correction/${testId}/${studentId}`);
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={testList}
      renderItem={(item, index) => (
        <List.Item>
          <Card title={item} style={{ width: '100%' }}>
            <Button type="primary" onClick={() => handleCorrection(testId, item)}>
              Corrigir
            </Button>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default TestSelector;
