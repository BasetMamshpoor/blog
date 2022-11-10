import SignIn from './Auth/SignIn/SignIn'
import LogIn from './Auth/LogIn/LogIn'
import Main from './Components/Main'
import NotFound from './Components/NotFound/NotFound';
import { Switch, Route } from 'react-router';
import './App.css';
import UserProfile from './Components/UserProfile'
import AddBlog from './Components/AddBlog';
import Details from './Components/Details';
import Navbar from './Components/Navbar';
import Follow from './Components/Follow';
import UpdateProfile from './Components/UpdateProfile';




function App() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path='/account/edit-profile' component={UpdateProfile} />
        <Route path='/:user/Blog-Option' component={AddBlog} />
        <Route path='/posts/:id/' component={Details} />
        <Route path='/:user/:follow' component={Follow} />
        <Route path='/explore' component={() => <Main type='explore' />} />
        <Route path='/login' component={LogIn} />
        <Route path='/signin' component={SignIn} />
        <Route path='/:user' component={UserProfile} />
        <Route exact path='/' component={() => <Main type='post' />} />
        <Route exact path='*' component={NotFound} />
      </Switch>
    </>
  );
}

export default App;
