import SignIn from './Auth/SignIn/SignIn'
import LogIn from './Auth/LogIn/LogIn'
import Main from './Components/Main'
import NotFound from './Components/NotFound/NotFound';
import UserNotFound from './Components/NotFound/UserNotFound'
import Home from './Components/Home';
import { Switch, Route } from 'react-router';
import './App.css';
import UserProfile from './Components/UserProfile'
import AddBlog from './Components/AddBlog';
import Details from './Components/Details';




function App() {
  return (
    <>
      <Switch>
        <Route path='/posts/:id' component={Details} />
        <Route path='/users/:user/:follow' component={UserProfile} />
        <Route path='/:user/addblog' component={AddBlog} />
        <Route exact path='/users/:user' component={UserProfile} />
        <Route path='/usernotfound' component={UserNotFound} />
        <Route path='/blog' component={Home} />
        <Route path='/login' component={LogIn} />
        <Route path='/signin' component={SignIn} />
        <Route exact path='/' component={Main} />
        <Route exact path='*' component={NotFound} />
      </Switch>
    </>
  );
}

export default App;
