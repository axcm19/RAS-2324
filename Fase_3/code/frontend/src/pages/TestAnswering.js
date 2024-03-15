import React, { useState, useEffect } from 'react';
import { Card, Radio, Button, Typography, Pagination, Input } from 'antd';
import '../components/TestAnswering.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const TestAnswering = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [throwback, setThrowback] = useState(true);
  const { testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch questions from your API or source
    axios.get(`http://localhost:3003/startTest/${testId}/student/${localStorage.id}`)
      .then(response => {
        console.log(response.data)
        const questionsData = response.data.questions;
        setQuestions(questionsData);
        setThrowback(response.data.throwback);

        // Initialize answers array with the desired structure for each question
        const initialAnswers = questionsData.map((question, index) => {
          let initialAnswer = {};
          if (question.type === 1) {
            initialAnswer = {
              questionId: (index+1),
              options: []
            };
          } else if (question.type === 2) {
            initialAnswer = {
              questionId: (index+1),
              text: ''
            };
          }
          return initialAnswer;
        });
        setAnswers(initialAnswers);
      })
      .catch(error => console.error('Error fetching tests:', error));
  }, [testId]);

  const handleChoiceSelection = (e) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex].options = [e.target.value];
    setAnswers(updatedAnswers);
  };

  const handleWrittenResponse = (e) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex].text = e.target.value;
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitTest = () => {
    // Perform submission logic with answers
    // For example:
    console.log(answers)
    axios.put(`http://localhost:3003/tests/${testId}/submit/student1`, {
      "answers": answers,
    })
      .then(response => {
        // Handle successful submission, maybe redirect to a result page
        navigate('/student-dashboard');
      })
      .catch(error => console.error('Error submitting test:', error));
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="test-answering-container">
      <Pagination
        simple
        current={currentQuestionIndex + 1}
        total={questions.length}
        pageSize={1}
        disabled={!throwback} // Disable the entire Pagination component when throwback is true
        onChange={(page) => {
          setCurrentQuestionIndex(page - 1);
        }}
      />
      <Card bordered={false}>
        {questions.length > 0 && currentQuestionIndex < questions.length && (
          <Title level={4}>{questions[currentQuestionIndex].description}</Title>
        )}
        {questions[currentQuestionIndex]?.type === 1 && (
          <Radio.Group
            onChange={handleChoiceSelection}
            style={{ display: 'block' }}
            value={answers[currentQuestionIndex]?.options[0]} // Setting value to maintain selected option
          >
            {questions[currentQuestionIndex].options.map((option, index) => (
              <Radio key={index} value={option.description} style={{ display: 'block', margin: '10px 0' }}>
                {option.description}
              </Radio>
            ))}
          </Radio.Group>
        )}
        {questions[currentQuestionIndex]?.type === 2 && (
          <Input.TextArea
            onChange={handleWrittenResponse}
            placeholder="Escreva sua resposta aqui..."
            autoSize={{ minRows: 3, maxRows: 5 }}
            value={answers[currentQuestionIndex]?.text} // Setting value to maintain written response
          />
        )}
      </Card>
      <div className="navigation-container">
        {!isLastQuestion && (
          <Button type="primary" onClick={handleNextQuestion} className="next-button">
            Próxima Questão
          </Button>
        )}
        {isLastQuestion && (
          <Button type="primary" onClick={handleSubmitTest} className="submit-button">
            Terminar Prova
          </Button>
        )}
      </div>
    </div>
  );
};

export default TestAnswering;
