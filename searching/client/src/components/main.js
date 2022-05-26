import React from 'react';
import MainPage from './mainPage';


export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showhideMainPage: true
        }
    }

    

    render () {
        const {showhideMainPage} = this.state;
        return (
            <div>
                {showhideMainPage && <MainPage />}

            </div>
        )
    }
}