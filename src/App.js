import {BrowserRouter,Route,Routes} from 'react-router-dom'
import LoginForm from './components/LoginForm';
import PasswordRecovery from './components/PasswordRecovery';
import SignUpForm from './components/SignUpForm';
import VerificationPage from './components/VerificationPage';
import SetNewPassword from './components/SetNewPassword';

import './App.css';

import DashBoard from './components/DashBoard';
import AccountsPage from './components/AccountsPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" Component={LoginForm} />
          <Route exact path="/" Component={DashBoard} />
          <Route exact path="/sign-up" Component={SignUpForm} />
          <Route exact path="/forgot-paswd" Component={PasswordRecovery} />
          <Route exact path='/verification' Component={VerificationPage} />
          <Route exact path='/set-new-paswd' Component={SetNewPassword} />
          <Route exact path='/add-accounts' Component={AccountsPage} />
        </Routes>
      </BrowserRouter>
      {/* <Header/> */}
      {/* <DashBoard/> */}
      {/* <AccountsPage/> */}

    </div>
  );
}

export default App;
