import React, { Component } from 'react';
import {Route, withRouter} from 'react-router-dom';
import './App.css';
import NavBar from './NavBar';
import Question from './Question';
import Questions from './Questions';
import Callback from './Callback';
import NewQuestion from './NewQuestion';
import SecuredRoute from './SecuredRoute';
import auth0Client from './Auth';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkingSession: true,
    }
  }
  async componentDidMount() {
    if (this.props.location.pathname === '/callback') return;
    try {
      await auth0Client.silentAuth();
      this.forceUpdate(); // update current user
    } catch (err) {
      if (err.error === 'login_required') return;
      console.log(err.error);
    }
    this.setState({checkingSession:false});
  }

  render() {
    return (
      <div>
        <NavBar/>
        <Route exact path='/' component={Questions}/>
        <Route exact path='/question/:questionId' component={Question}/>
        <Route exact path='/callback' component={Callback}/>
        <SecuredRoute path='/new-question'
                  component={NewQuestion}
                  checkingSession={this.state.checkingSession} />
      </div>
    );
  }
}

export default withRouter(App);
