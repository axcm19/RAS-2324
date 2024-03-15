import React from 'react';
import { Table, Typography } from 'antd';
import '../components/GradeReport.css'; // Ensure this file includes styling for the GradeReport component

const { Title } = Typography;

const GradeReport = ({ studentTests }) => {
  // Assuming studentTests is an array of objects with test details and grades
  // Example: [{ testName: 'Math Test', grade: 'A' }, { testName: 'Science Test', grade: 'B+' }]

  const columns = [
    {
      title: 'Test Name',
      dataIndex: 'testName',
      key: 'testName',
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
    }
  ];

  return (
    <div className="grade-report-container">
      <Title level={2}>Avaliações</Title>
      <Table dataSource={studentTests} columns={columns} pagination={false} />
    </div>
  );
};

export default GradeReport;
