import React from 'react';

const Header_ex = () => {
  return (
    <div style={headerContainerStyle}>
      <header style={headerStyle}>
        <div style={leftSectionStyle}>
          🥚 😢
        </div>
        {/* <h2 style={centerSectionStyle}>
          Man VS 탈모
        </h2> */}
        <h4 style={rightSectionStyle}>
          <a href="/" style={linkStyle}>
            Home
          </a>
        </h4>
      </header>
    </div>
  );
};

// 스타일 객체 정의
const headerContainerStyle = {
  width: '40%',
  margin: '0 auto',
  backgroundColor: '#f0f0f0',
  padding: '20px',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center', // 세로 중앙 정렬 추가
};

const leftSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '24px',
};

// const centerSectionStyle = {
//   color: 'black',
//   // 추가적인 스타일 정의
// };

const rightSectionStyle = {
  color: 'black',
  margin: '0 10px',
};

const linkStyle = {
  color: 'black',
  textDecoration: 'none',
  lineHeight: '0',
};

export default Header_ex;