import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';
import kakaoLogo from '../../../assets/images/logos/kakao-button.jpg';
import { Button, Container, Row, Col } from 'reactstrap';

import very_safe_img from '../../../assets/images/bald_result_img/very_safe/img.jpg';
import just_safe_img from '../../../assets/images/bald_result_img/just_safe/img.jpg';
import not_safe_img from '../../../assets/images/bald_result_img/not_safe/img.jpg';
import warning_img from '../../../assets/images/bald_result_img/warning/img.jpg';
import bald_img from '../../../assets/images/bald_result_img/bald/img.jpg';

const ResultContainer = styled.div`
  border-left: 2px solid #000;
  border-right: 2px solid #000;
  padding: 20px;
  margin-left: 500px; /* 왼쪽에 100px 여백 추가 */
  margin-right: 500px; /* 오른쪽에 100px 여백 추가 */
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 48px);
  grid-column-gap: 8px;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const URLShareButton = styled.button`
  width: 48px;
  height: 48px;
  color: white;
  border-radius: 24px;
  border: 0px;
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
  background-color: #7362ff;
  &:hover {
    background-color: #a99fee;
  }
`;

const KakaoShareButton = styled.a`
  cursor: pointer;
`;

const KakaoIcon = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 24px;
`;

const Result = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dataParam = searchParams.get('data');

  const [resultPredict, setresultPredict] = useState(null);
  const [resultMessage, setresultMessage] = useState(null);
  let imgPath = useRef('');

  const data = JSON.parse(dataParam);
  data.age = parseInt(data.age);
  data.weight = parseFloat(data.weight);
  data.height = parseFloat(data.height);

  // for (const key in data) {
  //   if (data.hasOwnProperty(key)) {
  //     console.log(`Key: ${key}, Value: ${data[key]}, Type: ${typeof data[key]}`);
  //   }
  // }

  useEffect(() => {
    axios.post('http://localhost:8000/bald_persent_predict', data)
      .then(response => {
        const resultPredict = Math.floor(parseInt(response.data.predict * 100));
        setresultPredict(resultPredict);

        // console.log(response.data)

        if (resultPredict <= 25) {
          imgPath.current = very_safe_img;
          var resultMessage = '지금 탈모갤로 놀러가 비틱질을 해보아요'
          setresultMessage(resultMessage)

        } else if (resultPredict <= 50) {
          imgPath.current = just_safe_img;
          var resultMessage = '아직 사소해 ㄱㅊㄱㅊ'
          setresultMessage(resultMessage)

        } else if (resultPredict <= 75) {
          imgPath.current = not_safe_img;
          var resultMessage = '슬슬... 관리해야겠지?'
          setresultMessage(resultMessage)

        } else if (resultPredict <= 100) {
          imgPath.current = warning_img;
          var resultMessage = '어라 왜 눈물이?..'
          setresultMessage(resultMessage)

        } else {
          imgPath.current = bald_img;
          var resultMessage = '이미 문어대가리아님? 이거 왜 했음'
          setresultMessage(resultMessage)

        }

      })
      .catch(error => {
        console.log('error:', error)
      })
  }, [data])

  const currentUrl = window.location.href;

  useEffect(() => {
    const kakaoScript = document.createElement('script');
    kakaoScript.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    kakaoScript.onload = () => {
      window.Kakao.init('KEY')
    };
    document.head.appendChild(kakaoScript);
  }, []);

  useEffect(() => {
    const { Kakao } = window;
    if (Kakao) {
      Kakao.Link.createDefaultButton({
        container: '#kakao-share-button',
        objectType: 'feed',
        content: {
          title: 'Baldness Result',
          description: `Result: ${resultPredict}% - ${resultMessage}`,
          imageUrl: imgPath.current,
          link: {
            mobileWebUrl: window.location.href,
          },
        },
      });
    }
  }, [resultPredict, resultMessage])

  return (
    <div>
      <ResultContainer>
        <div className="spacer" id="imgs-component">
          <Container>
            <Row className="justify-content-center">
              <Col md="7" className="text-center">
                <h3 className="title font-bold">나의 탈모 위험도는??</h3>
                <h4 className="title font-bold">{resultMessage}</h4>
                <p className="font-bold">현재 탈모 위험도 {resultPredict}%</p>
              </Col>
            </Row>
            <Row>
              <Col lg="12" className="text-center m-b-30">
                <img src={imgPath.current} alt="img" className="img-rounded" width="550" />
                <br />
                <h6 className="card-subtitle"><code>확률 낮은</code> 머신러닝이니까 너무 믿지는 마셈</h6>
                <Button color="link" href="https://www.kaggle.com/datasets/itsnahm/baldness-probability">학습시킨 데이터 세트 링크(Kaggle)</Button>
                <p className="m-t-15 m-b-0"></p>
                <div className="act-buttons">
                  <Link to="/test" className="btn btn-success-gradiant font-14">다시 테스트 하러가기</Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      
      <FlexContainer>
        <h2>친구들과 공유하기</h2>
        <br />
        <GridContainer>
          <FacebookShareButton url={currentUrl}>
            <FacebookIcon size={48} round={true} borderRadius={24}></FacebookIcon>
          </FacebookShareButton>
          <TwitterShareButton url={currentUrl}>
            <TwitterIcon size={48} round={true} borderRadius={24}></TwitterIcon>
          </TwitterShareButton>
          <CopyToClipboard text={currentUrl}>
            <URLShareButton>URL</URLShareButton>
          </CopyToClipboard>
          <KakaoShareButton>
            <KakaoIcon id="kakao-share-button" src={kakaoLogo}></KakaoIcon>
          </KakaoShareButton>
        </GridContainer>
      </FlexContainer>
      </ResultContainer>
    </div>
  );
}

export default Result;
