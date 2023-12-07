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
import { useScript } from "../../../hooks.js";

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

  const [imgSize, setImgSize] = useState({ width: '500px', height: '450px' });


  let imgPath = useRef('');

  const data = JSON.parse(dataParam);
  data.age = parseInt(data.age);
  data.weight = parseFloat(data.weight);
  data.height = parseFloat(data.height);

  const handleResize = () => {
    const width = window.innerWidth;
    const height = width <= 768 ? 'auto' : '450px';
    setImgSize({ width: '500px', height });
  };

  useEffect(() => {
    handleResize(); // Initial check

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    axios.post('https://man-vs-talmo-api.fly.dev/bald_persent_predict', data,
    {
      headers: {
        'Content-Type': 'application/json',
    },
    timeout: 4000,
  })
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
        console.log("yes")
        setresultMessage(message);
      })
      .catch(error => {
        console.log('error:', error);
      });
  }, [data]);

  const currentUrl = window.location.href;

  const status = useScript("https://developers.kakao.com/sdk/js/kakao.js");
  useEffect(() => {
		if (status === "ready" && window.Kakao) {
			if (!window.Kakao.isInitialized()) {
				window.Kakao.init(process.env.REACT_APP_KAKAO_API_KEY)
			}
		}
	}, [status]);	

  const handleKakaoButton = () => {
    const currentUrl = window.location.href;

    if (window.Kakao.isInitialized()) {
    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '현재 나의 탈모위험도는?',
        description:`${resultMessage}\n${resultPredict ? `현재 탈모 위험도: ${resultPredict}` : '탈모 위험도를 계산 중입니다.'}`,
        // imageUrl: imgPath.current,
        imageUrl: 'https://www.koreapas.com/bbs/data2/gofun/%C5%BB%B8%F0%B0%B63.jpg',
        link: {
          mobileWebUrl: currentUrl,
          webUrl: currentUrl,
        },
      },
      buttons: [
        {
          title: '링크 열기',
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
        },
      ],
      })
    }
  }


  return (
    <div>
        <Container>
          <Row className="justify-content-center">
            <Col md="7" className="text-center">
              <h4 className="title font-bold">{resultMessage}</h4>
              <h3 className="font-bold">현재 탈모 위험도 {resultPredict}%</h3>
            </Col>
          </Row>
          <Row>
            <Col lg="12" className="text-center m-b-30">
              <Img src={imgPath.current} alt="img" className="img-rounded" style= {imgSize}/>
              <br /><br />
              <Link to="/test">
                <Button type="button" color="primary" style={{ width: '200px', height: '50px' }}>다시 테스트하기</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      <br />
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
            <KakaoIcon id="kakao-share-button" src={kakaoLogo} onClick={handleKakaoButton}></KakaoIcon>
          </KakaoShareButton>
        </GridContainer>
      </FlexContainer>
    </div>
  );
}

export default Result;
