import React, { useState, useEffect } from 'react';
import { 
    Button,
    Container, Row, Col 
} from 'reactstrap';
import { Link } from 'react-router-dom';

import img1 from '../../../assets/images/main-page-img/img1.gif';
import img2 from '../../../assets/images/main-page-img/img2.gif';
import img3 from '../../../assets/images/main-page-img/img3.gif';

const Home = (props) => {
    const [modal, setModal] = useState(false);
    const images = [img1, img2, img3];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imgSize, setImgSize] = useState({ width: '100%', height: 'auto' });

    const toggle = () => {
        setModal(!modal);
    }

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

    // Check screen width and set image size accordingly
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = width <= 768 ? 300 : 'auto';
            setImgSize({ width: width <= 768 ? 300 : '100%', height });
        };

        // Initial check
        handleResize();

        // Event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <Container>
                <Row className="justify-content-center">
                    <Col md="7" className="text-center m-b-30">
                        <img
                            src={images[currentImageIndex]}
                            alt={`Image ${currentImageIndex + 1}`}
                            style={imgSize}
                        />
                    </Col>
                    <Col lg="12" className="text-center m-b-30">
                        <br /><br />
                        <div className="d-flex flex-column justify-content-center align-items-center h-100">
                            <h1 className="title font-14" style={{ fontSize: '2rem', textAlign: 'center' }}>🥚 Man vs 탈모😢</h1>
                            <h4 className="subtitle font-light" style={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}>
                                8개의 질문을 가지고         <br />
                                자신의 탈모력을 테스트 해보고<br /> 지인들에게 기만을해보아요
                            </h4>
                            <Link to="/test">
                                <Button type="button" color="primary" onClick={toggle.bind(null)} style={{ width: '200px', height: '50px' }}>테스트 해볼까?</Button>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Home;