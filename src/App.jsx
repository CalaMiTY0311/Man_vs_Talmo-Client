import React, { useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import IntroView from './pages/IntroView';
import QuizView from './pages/QuizView';
import ResultView from './pages/ResultView';

function App() {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <div className="quiz-container min-h-screen flex flex-col relative overflow-visible">
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          timeout={500}
          classNames="slide-right"
          unmountOnExit
          nodeRef={nodeRef}
        >
          <div ref={nodeRef} className="page">
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