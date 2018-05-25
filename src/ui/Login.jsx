import React, {Component} from 'react';
import '../styles/Home.css';
import {Redirect} from 'react-router-dom';
//
import { WebView } from 'react-native';

class Login extends Component {
    constructor(props) {
        super(props);
        console.log(props)
    }

    render() {
/*        return (
            <WebView
                source={{uri: 'https://explore.api.aai.ebi.ac.uk/sso?from=http%3A%2F%2Flocalhost%3A39093'}}
                style={{marginTop: 20}}
            />
        )*/
        return (
            <main>
                <div className="row home-banner">
                    <div className="medium-offset-3 medium-6 text-center">
                        You will be redirected to Elixir for that!
                        https://explore.api.aai.ebi.ac.uk/sso?from=https%3A%2F%2Febi.ac.uk/gifts
                    </div>
                </div>



            </main>
        );
    }
}

export default Login;