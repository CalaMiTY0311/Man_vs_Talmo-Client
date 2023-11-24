import React from 'react';

const Header = () => {
  return (
    <div style={headerContainerStyle}>
      <header style={headerStyle}>
        {/* 왼쪽에 달걀과 우는 사람 이모지, 가운데에 공간, 오른쪽에 홈으로 돌아가는 링크 */}
        <div style={leftSectionStyle}>
          🥚 😢
        </div>
        <div style={centerSectionStyle}>Center</div>
        <div style={rightSectionStyle}>
          <a href="/" style={linkStyle}>
            Home
          </a>
        </div>
      </header>
    </div>
  );
};

// 스타일 객체 정의
const headerContainerStyle = {
  width: '40%',
  margin: '0 auto',
  backgroundColor: 'grey',
  padding: '10px',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const leftSectionStyle = {
  display: 'flex',
  alignItems: 'center', // 세로 중앙 정렬
  fontSize: '24px', // 이모지 크기 조절
};

const centerSectionStyle = {
  color: 'white',
  // 추가적인 스타일 정의
};

const rightSectionStyle = {
  color: 'white',
  margin: '0 10px',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none', // 링크에 밑줄 제거
};

export default Header;