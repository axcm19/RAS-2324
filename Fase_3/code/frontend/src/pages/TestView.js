import React, { useState, useEffect } from 'react';
import { List, Typography, InputNumber, Row, Col } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../components/TestView.css';

const { Title } = Typography;

const TestCorrectionSingle = () => {
  const { testId, studentId } = useParams();
  const [questionsList, setQuestionsList] = useState([]);
  const [answersList, setAnswersList] = useState({});
  
  useEffect(() => {
    axios.get(`http://localhost:3003/viewtest/${testId}/student/${studentId}`)
      .then(response => { 
        setQuestionsList(response.data.test.questions);
        setAnswersList(response.data.answers);
      })
      .catch(error => console.error('Error fetching questions:', error));
  }, [testId, studentId]);

  const handleScoreChange = (value, questionId) => {
    // Your score change handling logic here
  };

  const findAnswer = (questionId) => {
    return answersList.find(answer => answer.questionId === questionId);
  };

  const getScoreColor = (scorePercentage) => {
    if (scorePercentage <= 33) {
      return 'red';
    } else if (scorePercentage <= 66) {
      return 'yellow';
    } else {
      return 'green';
    }
  };

  const calculatePercentage = (score, max) => {
    return ((score / max) * 100).toFixed(2);
  };

  return (
    <>
      <Title style={{ margin: 32 }}>Teste do aluno {studentId}</Title>
      <List
        style={{ margin: 32 }}
        itemLayout="vertical"
        dataSource={questionsList}
        renderItem={(item, index) => {
          const answer = findAnswer(item._id);
          const scorePercentage = calculatePercentage(answer ? answer.score : 0, item.grade);
          const color = getScoreColor(scorePercentage);

          return (
            <List.Item key={item._id}>
              <Row>
                <Col span={20}>
                  <List.Item.Meta
                    title={`${item._id}. ${item.description}`}
                    description={item.type === 2 ? `Resposta do Aluno: ${answer ? answer.text : "No answer"}` : null}
                  />
                </Col>
                <Col span={4}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <InputNumber
                      disabled
                      min={0}
                      max={item.grade}
                      onChange={(value) => handleScoreChange(value, item._id)}
                      value={answer ? answer.score : 0}
                      className={color === 'red' ? 'red-score' : color === 'yellow' ? 'yellow-score' : 'green-score'}
                    />
                    <span style={{ marginLeft: 8 }}>/{item.grade}</span>
                  </div>
                </Col>
              </Row>
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default TestCorrectionSingle;
