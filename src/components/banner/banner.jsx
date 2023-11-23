import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

const HeaderBanner = () => {
    return (
        <div className="static-slider-head">
            <Container>
                <Row className="justify-content-center">
                    <Col lg="8" md="6" className="align-self-center text-center">
                        <h1 className="title">Man vs 탈모</h1>
                        <h4 className="subtitle font-light">자신의 탈모력을 테스트 해보고<br /> 지인들에게 기만을해보아요</h4>
                        <Link smooth to="/test" className="btn btn-md m-t-30 btn-info-gradiant font-14">테스트 시작하기</Link>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default HeaderBanner;