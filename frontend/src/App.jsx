import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';


function App() {
  return(
    <Router>
      <Routes>
        <Route path="/signin" element={<SignInPage />}  />
        <Route path="/signup" element={<SignUpPage />}  />
        <Route path="/update-password" element={<UpdatePasswordPage />}  />

      </Routes>
    </Router>
  );
}

export default App;