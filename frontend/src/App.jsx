import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductFormPage from './pages/ProductFormPage';
import CartPage from './pages/CartPage';
import Layout from './components/Layout';
import OrderListPage from './pages/OrderListPage';


function App() {
  return(
    <Router>
      <Routes>
        {/* 不需要navbar */}
        <Route path="/signin" element={<SignInPage />}  />
        <Route path="/signup" element={<SignUpPage />}  />
        <Route path="/update-password" element={<UpdatePasswordPage />}  />

        {/* 需要navbar */}
        <Route element={<Layout />}>
        <Route path="/" element={<ProductListPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/product/new" element={<ProductFormPage />} />
          <Route path="/product/edit/:id" element={<ProductFormPage />} />
          <Route path="/cart" element={<CartPage />}/>
          <Route path="/orders" element={<OrderListPage />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;