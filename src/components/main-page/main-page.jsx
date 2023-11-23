import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import img1 from '../../assets/images/main-page-img/img1.gif';
import img2 from '../../assets/images/main-page-img/img2.gif';
import img3 from '../../assets/images/main-page-img/img3.gif';

const MainPage = () => {
    const images = [img1, img2, img3];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const imageChangeIntervals = [
            3000, // 첫 번째 이미지: 3초마다 변경
            1650, // 두 번째 이미지: 0.5초마다 변경
            4200, // 세 번째 이미지: 1.5초마다 변경
        ];

        // 이미지를 순서대로 반복해서 보여주기
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, imageChangeIntervals[currentImageIndex]);

        // 컴포넌트가 언마운트될 때 interval 해제
        return () => clearInterval(intervalId);
    }, [currentImageIndex, images.length]);

    return (
        <Container fluid>
            <Row>
                {/* 왼쪽 영역 (4분의 3) */}
                <Col lg="9" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
                    {/* 이미지 및 가운데 정렬 */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <img
                            src={images[currentImageIndex]}
                            alt={`Image ${currentImageIndex + 1}`}
                            className="img-fluid"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                        />
                    </div>
                </Col>

                {/* 오른쪽 영역 (4분의 1) */}
                <Col lg="3" style={{ minHeight: '100vh' }}>
                    <div className="d-flex flex-column justify-content-center align-items-center h-100">
                        <h1 className="title font-50">Man vs 탈모</h1>
                        <h4 className="subtitle font-light center">
                            8개의 질문을 가지고         <br />
                            자신의 탈모력을 테스트 해보고<br /> 지인들에게 기만을해보아요
                        </h4>
                        <Link smooth to="/test" className="btn btn-md m-t-30 btn-info-gradiant font-14">
                            테스트 시작하기
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default MainPage;
