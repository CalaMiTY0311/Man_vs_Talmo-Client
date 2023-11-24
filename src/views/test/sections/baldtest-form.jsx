import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BaldForm = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [age, setAge] = useState('');
  const [gender, setGender] = useState(null);
  const [is_married, setIs_married] = useState(null);
  const [is_hereditary, setIs_hereditary] = useState(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [is_smoker, setIs_smoker] = useState(null);
  const [stress, setStress] = useState('');

  const formData = {
    age,
    gender,
    is_married,
    is_hereditary,   
    weight,
    height,
    is_smoker,
    stress,
  };
  
  const nextStep = () => {
    if (step === 1 && (age === '' || isNaN(age) || age < 0 || age >= 100)) {
      alert('0~99까지의 숫자 또는 공백이 아니어야합니다.');
      return;
    } 
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSelection = (field, value) => {
    switch (field) {
      case 'gender':
        setGender(value);
        break;
      case 'maritalStatus':
        setIs_married(value);
        break;
      case 'hairLossGenetics':
        setIs_hereditary(value);
        break;
      case 'smoking':
        setIs_smoker(value);
        break;
      default:
        break;
    }
    nextStep();
  };

  const submitForm = () => {
    if (step === 8 && (stress === '' || isNaN(stress) || stress < 1 || stress > 10)) {
      alert('스트레스는 1부터 10까지의 숫자 또는 공백이 아니어야합니다.');
      return;
    }
    // console.log(formData);
    navigate(`/result?data=${JSON.stringify(formData)}`);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md="7" className="text-center" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          {step === 1 && (
            <>
              <h1 className="title font-bold">본인의 나이를 입력해주세요</h1>
              <h6 className="subtitle">부정확한 값을 입력하면 이상한 값이 나오니 조심해주세요.</h6>
              <br/>
              <input type="number" style={{ width: '400px', height: '50px' }} placeholder="나이" value={age} onChange={(e) => setAge(e.target.value)} />
              <br/>
              <Button variant="outline-primary" className="btn btn-block" onClick={nextStep}>
                다음
              </Button>
            </>
          )}

{step === 2 && (
  <>
    <h1 className="title font-bold">성별이 무엇인가요?</h1>
    <h6 className="subtitle">남성과 여성외의 성별을 선택 할 수 없습니다.</h6>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <Button variant="outline-primary" className="btn btn-block" onClick={() => handleSelection('gender', 1)} style={{ width: '200px' }}>
        남성
      </Button>
      <Button variant="outline-primary" className="btn btn-block" onClick={() => handleSelection('gender', 0)} style={{ width: '200px' }}>
        여성
      </Button>
    </div>
    <Button variant="outline-secondary" className="btn btn-block" onClick={prevStep}>
      이전
    </Button>
  </>
)}

{step === 3 && (
  <>
    <h1 className="title font-bold">결혼 유무</h1>
    <h6 className="subtitle">현재를 기준으로 골라주세요.</h6>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <Button variant="outline-primary" className="btn btn-block" onClick={() => handleSelection('maritalStatus', 1)} style={{ width: '200px' }}>
        결혼
      </Button>
      <Button variant="outline-primary" className="btn btn-block" onClick={() => handleSelection('maritalStatus', 0)} style={{ width: '200px' }}>
        미혼
      </Button>
    </div>
    <Button variant="outline-secondary" className="btn btn-block" onClick={prevStep}>
      이전
    </Button>
  </>
)}

{step === 4 && (
  <>
    <h1 className="title font-bold">탈모 유전</h1>
    <h6 className="subtitle" style={{ marginBottom: '15px' }}>탈모가 유전인지 아닌지에 따라 현재 탈모 위험도 수치에 영향을 많이 끼쳐요</h6>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <Button variant="outline-primary" className="btn btn-block" onClick={() => handleSelection('hairLossGenetics', 1)} style={{ width: '200px' }}>
        유전 있음
      </Button>
      <Button variant="outline-primary" className="btn btn-block" onClick={() => handleSelection('hairLossGenetics', 0)} style={{ width: '200px' }}>
        유전 없음
      </Button>
    </div>
    <Button variant="outline-secondary" className="btn btn-block" onClick={prevStep}>
      이전
    </Button>
  </>
)}

{step === 5 && (
  <>
    <h1 className="title font-bold">몸무게</h1>
    <h6 className="subtitle" style={{ marginBottom: '15px' }}>몸무게</h6>
    <br/>
    <input type="number" style={{ width: '400px', height: '50px' }} placeholder="몸무게" value={weight} onChange={(e) => setWeight(e.target.value)} />
    <br/>
    <Button variant="outline-secondary" className="btn btn-block" onClick={prevStep}>
      이전
    </Button>
    <Button variant="outline-primary" className="btn btn-block" onClick={nextStep}>
      다음
    </Button>
  </>
)}

{step === 6 && (
  <>
    <h1 className="title font-bold">키</h1>
    <h6 className="subtitle" style={{ marginBottom: '15px' }}>키</h6>
    <br/>
    <input type="number" style={{ width: '400px', height: '50px' }} placeholder="키" value={height} onChange={(e) => setHeight(e.target.value)} />
    <br/>
    <Button variant="outline-secondary" className="btn btn-block" onClick={prevStep}>
      이전
    </Button>
    <Button variant="outline-primary" className="btn btn-block" onClick={nextStep}>
      다음
    </Button>
  </>
)}

{step === 7 && (
  <>
    <h1 className="title font-bold">흡연 여부</h1>
    <h6 className="subtitle" style={{ marginBottom: '15px' }}>현재 기준으로 흡연 여부를 알려주세요</h6>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <Button variant="outline-primary" className="btn btn-block" onClick={() => handleSelection('smoking', 1)} style={{ width: '200px' }}>
        흡연
      </Button>
      <Button variant="outline-primary" className="btn btn-block" onClick={() => handleSelection('smoking', 0)} style={{ width: '200px' }}>
        비흡연
      </Button>
    </div>
    <Button variant="outline-secondary" className="btn btn-block" onClick={prevStep}>
      이전
    </Button>
  </>
)}

{step === 8 && (
  <>
    <h1 className="title font-bold">스트레스</h1>
    <h6 className="subtitle" style={{ marginBottom: '15px' }}>현재 자신이 받고있는 스트레스를 1~10으로 표현해주세요. 값이 높을수록 스트레스가 크다는 의미입니다.</h6>
    <br/>
    <input
      type="number"
      style={{ width: '400px', height: '50px' }}
      placeholder="스트레스 수치"
      value={stress}
      onChange={(e) => setStress(e.target.value)}
    />
    <br/>
    <Button variant="outline-secondary" className="btn btn-block" onClick={prevStep}>
      이전
    </Button>
    <Button variant="outline-primary" className="btn btn-block" onClick={submitForm}>
      제출
    </Button>
  </>
)}
        </Col>
      </Row>
    </Container>
  );
};

// 스타일 직접 작성
const styles = `
  .survey-form {
    background-color: #f8f9fa;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .subtitle {
    font-size: 14px;
    margin-bottom: 30px;
  }

  .btn-block {
    margin-top: 20px; /* 버튼 간격 조절 */
  }

  /* 버튼 크기 조절 */
  .btn {
    padding: 10px 20px; /* 상하 10px, 좌우 20px의 패딩을 가진 버튼 */
    font-size: 16px; /* 버튼 텍스트 크기 */
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default BaldForm;
