import React, { useState, useEffect } from 'react';
import { List, Typography, InputNumber, Button, Checkbox, Row, Col, message } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;

const TestCorrectionSingle = () => {
  const { testId, studentId } = useParams();
  const [questionsList, setQuestionsList] = useState([]);
  const [answersList, setAnswersList] = useState([]);
  const [scores, setScores] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3003/viewtest/${testId}/student/${studentId}`)
      .then(response => { 
        setQuestionsList(response.data.test.questions);
        setAnswersList(response.data.answers);
        const initialScores = {};
        response.data.answers.forEach(answer => {
          if (answer.score !== undefined) {
            initialScores[answer.questionId] = answer.score;
          }
        });
        setScores(initialScores);
      })
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleScoreChange = (value, questionId) => {
    if (value > questionsList.find(q => q._id === questionId).grade) {
      message.warning('A pontuação não pode ser superior à cotação máxima da pergunta.');
      return;
    }
    setScores({ ...scores, [questionId]: value });
  };

  const findAnswer = (questionId) => {
    const answer = answersList.find(answer => answer.questionId === questionId);
    return answer ? { ...answer, score: scores[questionId] } : null;
  };

  const handleSubmit = () => {
    const formattedScores = Object.keys(scores).map(questionId => ({
      questionId,
      score: scores[questionId],
    }));

    axios.put(`http://localhost:3003/evaluateTest/${testId}/${studentId}`, {
      scores: formattedScores,
    })
    .then(response => {
      // Handle success (redirect or other action)
    })
    .catch(error => console.error('Error submitting scores:', error));
  };

  const totalScore = Object.values(scores).reduce((total, score) => total + score, 0);
  const maxScore = questionsList.reduce((total, question) => total + question.grade, 0);

  return (
    <>
      <Title style={{ margin: 32 }}>Teste do aluno {studentId}</Title>
      <List
        style={{ margin: 32 }}
        itemLayout="vertical"
        dataSource={questionsList}
        renderItem={(item, index) => {
          const answer = findAnswer(item._id);
          if (item.type === 1) {
            return (
                <List.Item>
                <Row>
                    <Col span={20}>
                    <List.Item.Meta title={`${item._id}. ${item.description}`} />
                    {item.type === 1 && (
                        <Checkbox.Group
                        options={item.options ? item.options.map(option => option.description) : []}
                        value={answer ? answer.options : []}
                        />
                    )}
                    </Col>
                    <Col span={4}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <InputNumber
                        min={0}
                        max={item.grade}
                        onChange={(value) => handleScoreChange(value, item._id)}
                        value={answer ? answer.score : 0}
                        />
                        <span style={{ marginLeft: 8 }}>/{item.grade}</span>
                    </div>
                    </Col>
                </Row>
                </List.Item>
            );
          }
          else if (item.type === 2) {
            return (
                <List.Item>
                <Row>
                    <Col span={20}>
                    <List.Item.Meta
                    title={`${item._id}. ${item.description}`}
                    description={`Resposta do Aluno: ${answer ? answer.text : "No answer"}`}
                  />
                    {item.type === 1 && (
                        <Checkbox.Group
                        options={item.options ? item.options.map(option => option.description) : []}
                        value={answer ? answer.options : []}
                        />
                    )}
                    </Col>
                    <Col span={4}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <InputNumber
                        min={0}
                        max={item.grade}
                        onChange={(value) => handleScoreChange(value, item._id)}
                        value={answer ? answer.score : 0}
                        />
                        <span style={{ marginLeft: 8 }}>/{item.grade}</span>
                    </div>
                    </Col>
                </Row>
                </List.Item>
              );
          }
        }}
      />
      <List
        style={{ margin: 32 }}
        itemLayout="horizontal"
        dataSource={[1]}
        renderItem={(item, index) => 
          <List.Item>
            <List.Item.Meta
              title=""
              description=""
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              Total:  
              <InputNumber
                style={{ marginLeft: 16 }}
                value={totalScore}
              />
              <span style={{ marginLeft: 8 }}>/{maxScore}</span>
            </div>
          </List.Item>
        }
      />
      <Button type="primary" style={{ margin: 32 }} onClick={handleSubmit}>
        Salvar alterações
      </Button>
    </>
  );
};

export default TestCorrectionSingle;


