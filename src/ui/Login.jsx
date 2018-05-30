import React, { Component } from 'react';
import decode from 'jwt-decode';
import '../styles/Home.css';
import { GIFTS_DOMAIN, GIFTS_AUTHORISATION_STAGES } from './AppDomain';

class Login extends Component {
  // will need to move that into settings file

  constructor(props) {
    super(props);
    console.log(props);
    this.myWindow = null;
    this.state = { logged: 0, autorisationStage: GIFTS_AUTHORISATION_STAGES.NOT_AUTHORISED };
  }
  componentDidMount() {
    window.addEventListener('message', this.handleFrameTasks);
  }

    handleFrameTasks = (e) => {
      console.log(e);
      if (e.origin === 'https://explore.api.aai.ebi.ac.uk') {
        // we have token and now need to update user with it
        const decoded = decode(e.data);
        console.log(decoded);
        if (this.myWindow !== undefined) {
          this.myWindow.close();
          this.myWindow = null;
        }
        console.log('close elixir');
        this.setState({
          logged: 1,
          userDetails: decoded,
        });
        console.log(`logged${this.state.logged}`);

        if (this.state.userDetails.domains.find(str => str === GIFTS_DOMAIN)) {
          // user already has been added to domain, thus must be in our database
          // get user from our database via GIFTS API (we need to know permissions)

          // if user is approved then set state as
          /* this.setState({
                     authorisationStage: GIFTS_AUTHORISATION_STAGES.AUTHORISED
                 }); */
          // otherswise set state
          /* this.setState({
                     authorisationStage: GIFTS_AUTHORISATION_STAGES.NOT_AUTHORISED
                 }); */
        } else {
          // add user to our database via GIFTS API

          // send email to admin to review
          this.setState({
            authorisationStage: GIFTS_AUTHORISATION_STAGES.WAITING_ADMIN_VALIDATION,
          });
        }
      }
    }

    render() {
      console.log(`logged${this.state.logged}`);
      if (!this.state.logged) {
        console.log('open elixir');
        this.myWindow = window.open('https://explore.api.aai.ebi.ac.uk/sso?from=http%3A%2F%2Flocalhost%3A39093%2Flogin', 'elixir').focus();
      }
      /*        return (
            <WebView
                source={{uri: 'https://explore.api.aai.ebi.ac.uk/sso?from=http%3A%2F%2Flocalhost%3A39093'}}
                style={{marginTop: 20}}
            />
        ) */
      let userMessage;
      let authorisationMessage;
      if (!this.state.logged) {
        userMessage = (
          <div className="medium-offset-3 medium-6 text-center">
            {!this.state.logged }
                    You will be redirected to Elixir for that!
                    https://explore.api.aai.ebi.ac.uk/sso?from=https%3A%2F%2Febi.ac.uk/gifts
          </div>
        );
      } else {
        userMessage = this.state.userDetails;
        switch (this.state.authorisationStage) {
          case GIFTS_AUTHORISATION_STAGES.NOT_AUTHORISED:
            authorisationMessage = (<div className="medium-offset-3 medium-6 text-center">
                                            You are not authorised to use GIFTs tool. Please contact GIFTs admins if you think you should be.
                                    </div>);
            break;
          case GIFTS_AUTHORISATION_STAGES.WAITING_ADMIN_VALIDATION:
            authorisationMessage = (<div className="medium-offset-3 medium-6 text-center">
                        You haven't been yet approved by GIFTs admin. We will send you email, when it is done.
                                    </div>);
            break;
          case GIFTS_AUTHORISATION_STAGES.AUTHORISED:
            authorisationMessage = (<div className="medium-offset-3 medium-6 text-center">
                        Congratulations! You made it through. Now sit back, relax and curate away.
                                    </div>);
            break;
        }
      }


      return (
        <main>
          <div className="row home-banner">
            {authorisationMessage} <br />
                    Email: { userMessage.email } <br />
                    User: { userMessage.name } <br />
                    User Id: { userMessage.sub } <br />
          </div>


        </main>
      );
    }
}

export default Login;
