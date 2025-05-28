import React, { useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import IntroView from './pages/IntroView';
import QuizView from './pages/QuizView';
import ResultView from './pages/ResultView';
//

function App() {
  const location = useLocation();
  const nodeRef = useRef(null);
  
  return (
    <div className="quiz-container min-h-screen flex flex-col relative overflow-hidden">
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.key}
          classNames="slide"
          timeout={300}
          nodeRef={nodeRef}
          appear={true}
        >
          <div ref={nodeRef} className="page-transition-container">
            <Routes location={location}>
              <Route path="/" element={<IntroView />} />
              <Route path="/q" element={<QuizView />} />
              <Route path="/result" element={<ResultView />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default App;