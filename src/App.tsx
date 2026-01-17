import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Add from './pages/Add';
import Detail from './pages/Detail';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<Add />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>

        {/* ボトムナビゲーション */}
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border">
          <div className="max-w-2xl mx-auto flex justify-around">
            <Link
              to="/"
              className="flex-1 py-4 text-center text-2xl hover:bg-background/50 transition-colors"
            >
              🏠
            </Link>
            <Link
              to="/add"
              className="flex-1 py-4 text-center text-2xl hover:bg-background/50 transition-colors"
            >
              ➕
            </Link>
          </div>
        </nav>

        {/* ボトムナビゲーション用のパディング */}
        <div className="h-20" />
      </div>
    </BrowserRouter>
  );
}
