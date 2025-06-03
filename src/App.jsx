
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import LoaderGif from './assets/loader.gif';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import AdminHomePage from './pages/Admin/Dashboard/AdminHomePage';
import AdminTransactionage from './pages/Admin/Dashboard/AdminTransactionage';
import AdminUserPage from './pages/Admin/Dashboard/AdminUserPage';
import Gift from './pages/Admin/Dashboard/Gift';
import Products from './pages/Admin/Dashboard/Products';
import Gifting from './pages/Admin/Dashboard/Gifting';

const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const AdminLayout = lazy(() => import('./components/admin/Layout'));


function SuspenseWithDelay({ children, fallback, delay = 0, minDisplayTime = 2000 }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), minDisplayTime);
    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  return isLoading ? (
    <div className="flex justify-center items-center w-screen h-screen">
      <img src={LoaderGif} alt="Loading..." className="h-[6rem]" />
    </div>
  ) : (
    <Suspense fallback={fallback}>{children}</Suspense>
  );
}

function App() {

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <SuspenseWithDelay fallback={<div className="flex justify-center items-center w-screen h-screen"><img src={LoaderGif} alt="HopOn Dashboard- Loader" className="h-[6rem]" /></div>} minDisplayTime={2000}>

          <Routes>

            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />

            <Route path="/admin/dashboard/" element={<AdminLayout />}>
              <Route path="home" element={<AdminHomePage />} />
              <Route path="user" element={<AdminUserPage />} />
              <Route path="gifts" element={<Gift />} />
              <Route path="gifting" element={<Gifting />} />
              <Route path="product" element={<Products />} />
              <Route path="transaction" element={<AdminTransactionage />} />
            </Route>





          </Routes>
        </SuspenseWithDelay>
      </BrowserRouter>
    </>
  );
}

export default App;
