import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

function Baldform() {
  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male', // default value for the select
    isMarried: 'Yes', // default value for the select
    isHereditary: 'Yes', // default value for the select
    weight: '',
    height: '',
    isSmoker: 'Yes', // default value for the select
    stress: '',
  });

  const questions = [
    { label: '나이', key: 'age', type: 'number', options: [] },
    { label: '성별', key: 'gender', type: 'select', options: ['Male', 'Female'] },
    { label: '결혼여부', key: 'isMarried', type: 'select', options: ['Yes', 'No'] },
    { label: '탈모유전유무', key: 'isHereditary', type: 'select', options: ['Yes', 'No'] },
    { label: '몸무게', key: 'weight', type: 'number', options: [] },
    { label: '키', key: 'height', type: 'number', options: [] },
    { label: '흡연여부', key: 'isSmoker', type: 'select', options: ['Yes', 'No'] },
    { label: '자신이 현재 받고있는 스트레스의 수치를 1~10으로 나타내주세요', key: 'stress', type: 'number', options: [] },
  ];

  const [questionIndex, setQuestionIndex] = useState(0);

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const Bald_datapost = () => {
    console.log(formData);
    Navigate(`/result?data=${JSON.stringify(formData)}`);
  };

  const renderQuestion = (question, index) => {
    return (
      <FormGroup key={index}>
        <Label htmlFor={question.key}>{question.label}</Label>
        {question.type === 'select' ? (
          <div>
            <Button
              color="success"
              onClick={() => handleInputChange(question.key, question.options[0])}
              className="btn waves-effect waves-light m-r-10"
            >
              {question.options[0]}
            </Button>
            <Button
              color="warning"
              onClick={() => handleInputChange(question.key, question.options[1])}
              className="btn waves-effect waves-light m-r-10"
            >
              {question.options[1]}
            </Button>
            <Button
              type="button"
              onClick={goToNextQuestion}
              className="btn btn-success waves-effect waves-light m-r-10"
            >
              {questionIndex < questions.length - 1 ? 'Next' : 'Submit'}
            </Button>
          </div>
        ) : (
          <div>
            <Input
              type={question.type}
              className="form-control"
              id={question.key}
              placeholder={`Enter ${question.label}`}
              value={formData[question.key]}
              onChange={(e) => handleInputChange(question.key, e.target.value)}
            />
            {questionIndex > 0 && (
              <Button
                type="button"
                onClick={() => setQuestionIndex(questionIndex - 1)}
                className="btn btn-success waves-effect waves-light m-r-10"
              >
                Previous
              </Button>
            )}
            <Button
              type="button"
              onClick={goToNextQuestion}
              className="btn btn-success waves-effect waves-light m-r-10"
            >
              {questionIndex < questions.length - 1 ? 'Next' : 'Submit'}
            </Button>
            <Button
              type="submit"
              className="btn btn-inverse waves-effect waves-light"
            >
              Cancel
            </Button>
          </div>
        )}
      </FormGroup>
    );
  };

  const goToNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      Bald_datapost();
    }
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <Form className="row">
              {renderQuestion(questions[questionIndex], questionIndex)}
              <Col md="12">
                {/* Additional buttons are now rendered in the renderQuestion function */}
              </Col>
            </Form>
          </Col>
        </Row>
      </Container>
      <br />
      <br />
      <br />
    </div>
  );
}

export default Baldform;
