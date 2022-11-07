import SignIn from './Auth/SignIn/SignIn'
import LogIn from './Auth/LogIn/LogIn'
import Main from './Components/Main'
import NotFound from './Components/NotFound/NotFound';
import UserNotFound from './Components/NotFound/UserNotFound'
import { Switch, Route } from 'react-router';
import './App.css';
import UserProfile from './Components/UserProfile'
import AddBlog from './Components/AddBlog';
import Details from './Components/Details';
import Navbar from './Components/Navbar';
import Follow from './Components/Follow';




function App() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path='/login' component={LogIn} />
        <Route path='/signin' component={SignIn} />
        <Route path='/posts/:id/:slug' component={Details} />
        <Route path='/users/:user/:follow' component={Follow} />
        <Route path='/:user/addblog' component={AddBlog} />
        <Route exact path='/users/:user' component={UserProfile} />
        <Route path='/usernotfound' component={UserNotFound} />
        <Route path='/explore' component={() => <Main type='explore' />} />
        <Route exact path='/' component={() => <Main type='post' />} />
        <Route exact path='*' component={NotFound} />
      </Switch>
    </>
  );
}

export default App;
