import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import WhatsAppBot from './Components/WhatsAppBot';
import styled from 'styled-components';
import Categories from './Components/Categories';
import CategoryDetails from './Components/CategoryDetails';
import SubCategoryProducts from './Components/SubCategoryProducts';
import OrderConfirmation from './Components/OrderConfirmation';
import OrderHistory from './Components/OrderHistory';
import OrderTracking from './Components/OrderTracking';
import EmailVerification from './Components/EmailVerification';

// Import your pages
import HomePage from './View/Home';
import About from './Components/About';
import LoginPage from './Components/Login';
import SignUp from './Components/SignUp';
import ForgotPassword from './Components/ForgotPassword';
import ProductDetails from './Components/ProductDetails';
import Cart from './Components/Cart';
import Checkout from './Components/Checkout';
import Payment from './Components/Payment';
import Profile from './Components/Profile';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Layout = ({ children }) => {
  const location = useLocation();
  const authRoutes = ['/login', '/Singup', '/ForgotPassword', '/email-verification'];
  const hideNavbarAndFooter = authRoutes.includes(location.pathname);

  return (
    <div className={`app ${hideNavbarAndFooter ? '' : 'pt-[]'}`} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideNavbarAndFooter && <Navbar />}
      <div className="flex-1">
        {children}
      </div>
      {!hideNavbarAndFooter && <Footer />}
      <WhatsAppBot />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContainer>
        <Routes>
          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/Singup" element={<SignUp />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/categories" element={
            <Layout>
              <Categories />
            </Layout>
          } />
          <Route path="/categories/:categoryId" element={<Layout> <CategoryDetails /> </Layout>} />
          <Route path="/categories/:categoryId/:subcategoryId" element={<Layout> <SubCategoryProducts /> </Layout>} />
          <Route path="/about" element={<Layout> <About /> </Layout>} />
          <Route path="/order-confirmation" element={<Layout> <OrderConfirmation /> </Layout>} />
          <Route path="/order-history" element={ <Layout> <OrderHistory /> </Layout>} />
          <Route path="/product/:productId" element={ <Layout> <ProductDetails /> </Layout>} />
          <Route path="/cart" element={<Layout> <Cart /> </Layout>} />
          <Route path="/checkout" element={<Layout> <Checkout /> </Layout>} />
          <Route path="/payment" element={<Layout> <Payment /> </Layout>} />
          <Route path="/order-tracking/:OrderID" element={<Layout><OrderTracking /></Layout>} />
          <Route path="/profile" element={<Layout> <Profile /> </Layout>} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;