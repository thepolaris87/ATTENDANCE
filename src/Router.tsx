import { Navigate, Route, Routes } from 'react-router-dom';

import SignInPage from './pages/SiginInPage';
import MainPage from './pages/MainPage';
import ManagerPage from './pages/ManagerPage';

export default function Router() {
    return (
        <Routes>
            <Route path='/sign-in' element={<SignInPage />}></Route>
            <Route path='/main' element={<MainPage />}></Route>
            <Route path='/manager' element={<ManagerPage />}></Route>
            <Route path='*' element={<Navigate replace to='/sign-in'></Navigate>}></Route>
        </Routes>
    );
}
