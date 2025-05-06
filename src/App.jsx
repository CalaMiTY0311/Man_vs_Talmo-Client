import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import IntroView from './pages/IntroView';
import QuizView from './pages/QuizView';
import ResultView from './pages/ResultView';

function App() {
  const location = useLocation();

  return (
    <div className="quiz-container min-h-screen flex flex-col relative overflow-hidden">
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          timeout={500}
          classNames="slide-right"
          unmountOnExit
        >
          <div className="page">
            <Routes location={location}>
              <Route path="/" element={<IntroView />} />
              <Route path="/quiz" element={<QuizView />} />
              <Route path="/result" element={<ResultView />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default App;