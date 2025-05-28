import React, { useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

/**
 * 페이지 전환 애니메이션 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 자식 컴포넌트
 */
const PageTransition = ({ children }) => {
  const nodeRef = useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 후 바로 애니메이션 시작
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <CSSTransition
      in={isVisible}
      timeout={300}
      classNames="slide"
      nodeRef={nodeRef}
      appear={true}
      unmountOnExit
    >
      <div ref={nodeRef} className="page-transition-container">
        {children}
      </div>
    </CSSTransition>
  );
};

export default PageTransition;