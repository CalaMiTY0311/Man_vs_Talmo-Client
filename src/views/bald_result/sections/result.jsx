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

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    // 작은 화면에 대한 스타일 추가
  }
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
  width: 100%;
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
  width: 100%;
  height: 48px;
  border-radius: 24px;
`;

const Img = styled.img`
  max-width: 100%;
  height: auto;
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

  useEffect(() => {
    axios.post('http://localhost:8000/bald_persent_predict', data)
      .then(response => {
        const resultPredict = Math.floor(parseInt(response.data.predict * 100));
        setresultPredict(resultPredict);

        let message = '';

        if (resultPredict <= 25) {
          imgPath.current = very_safe_img;
          message = '놀리러 가야겠지?ㅋㅋㅋ';
        } else if (resultPredict <= 50) {
          imgPath.current = just_safe_img;
          message = '아직 사소해';
        } else if (resultPredict <= 75) {
          imgPath.current = not_safe_img;
          message = '관리해야겠지?ㅋㅋ';
        } else if (resultPredict <= 100) {
          imgPath.current = warning_img;
          message = '어?? 이미?..';
        } else {
          imgPath.current = bald_img;
          message = '문어님 왜 오신거에요';
        }

        setresultMessage(message);
      })
      .catch(error => {
        console.log('error:', error);
      });
  }, [data]);

  const currentUrl = window.location.href;

  useEffect(() => {
    const kakaoScript = document.createElement('script');
    kakaoScript.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    kakaoScript.onload = () => {
      window.Kakao.init('KEY');
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
          title: '탈모 결과',
          description: `결과: ${resultPredict}% - ${resultMessage}`,
          imageUrl: imgPath.current,
          link: {
            mobileWebUrl: window.location.href,
          },
        },
      });
    }
  }, [resultPredict, resultMessage]);

  return (
    <div>
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
              <Img src={imgPath.current} alt="img" className="img-rounded" />
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
    </div>
  );
}

export default Result;
