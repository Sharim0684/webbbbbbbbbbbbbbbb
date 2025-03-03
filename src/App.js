import {BrowserRouter,Route,Routes} from 'react-router-dom'
import LoginForm from './components/LoginForm';
import PasswordRecovery from './components/PasswordRecovery';
import SignUpForm from './components/SignUpForm';
import VerificationPage from './components/VerificationPage';
import SetNewPassword from './components/SetNewPassword';

import './App.css';

import DashBoard from './components/DashBoard';
import AccountsPage from './components/AccountsPage/accounts-page';
import AutoPostSettings from './components/AutoPost/aotoPost';
import SharePostPage from './components/SharePost/sharePost';
import ThankYouPage from './components/ThankyouPage/thankyouPage';
import SetupSchedulePage from './components/Post- Schedules/schedules';
import ProfilePage from './components/profile/profile';
import HistoryPage from './components/History/history';

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
          <Route exact path='/autoPost' Component={AutoPostSettings} />
          <Route exact path='/sharePost' Component={SharePostPage} />
          <Route exact path='/thankYouPage' Component={ThankYouPage} />
          <Route exact path='/profile' Component={ProfilePage} />
          <Route exact path='/history' Component={HistoryPage} />
          <Route exact path='/schedulePage' Component={SetupSchedulePage} />
        </Routes>
      </BrowserRouter>
     
      {/* <DashBoard/> */}
      {/* <AccountsPage/> */}
      {/* <Templates/> */}
      {/* <Test/> */}
    </div>
  );
}

export default App;
