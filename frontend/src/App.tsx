import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './Pages/Home.tsx';
import About from './Pages/About.tsx';
import AdminPanel from './Pages/AdminPanel.tsx';
import GameScreen from './Pages/GameScreen.tsx';
import Leaderboard from './Pages/Leaderboard.tsx';
import QuizBrowser from './Pages/QuizBrowser.tsx';
import Results from './Pages/Results.tsx';
import NotFound from './Pages/NotFound.tsx';
import MyNavbar from './Components/MyNavbar.tsx';

function App() {
    return (
        <BrowserRouter>
            <MyNavbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/play/:quizId" element={<GameScreen />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/quizzes" element={<QuizBrowser />} />
                <Route path="/results/:quizId" element={<Results />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
