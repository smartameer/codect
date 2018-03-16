import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Navigator, NavigatorIOS, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// disabling warning
console.disableYellowBox = true;

// Components based on routes
import Home from './Home/Home';
import Menu from './Menu/Menu';
import API from './API/API';
import EM from './API/Event';

class Codect  extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: true,
            rightButtonIcon: false,
        };
        this.apiService = new API();
        this._handleNavigationRequest = this._handleNavigationRequest.bind(this);
        this.configureScene = this.configureScene.bind(this);
    }

    componentDidMount() {
        Icon.getImageSource('ios-more-outline', 32).then((source) => this.setState({ rightButtonIcon: source }));
        this.apiService.fetchQuestionsList().then(() => {
            this.setState({ isLoading: false});
            this.apiService.fetchQuestionContent();
            EM.publish('codect:refresh:home');
        }).catch(() => {
            this.setState({ isLoading: false});
            EM.publish('codect:refresh:home');
        });
    }

    _handleNavigationRequest() {
        let obj = { component: Menu, title: 'Menu' };
        this.refs.nav.push(obj);
    }

    configureScene(route, routeStack){
        if(route.type === 'Modal') {
            return Navigator.SceneConfigs.FloatFromBottom
        }
        return Navigator.SceneConfigs.PushFromLeft
    }

    render() {
        if (this.state.isLoading || !this.state.rightButtonIcon) {
            return false;
        }
        return (
          <NavigatorIOS
            ref='nav'
            translucent={true}
            interactivePopGestureEnabled={true}
            configureScene={ this.configureScene }
            initialRoute={{
                component: Home,
                title: 'Codect',
                backButtonTitle: 'Home',
                rightButtonIcon: this.state.rightButtonIcon,
                onRightButtonPress: () => this._handleNavigationRequest(),
            }}
            style={{flex: 1}}
            />
        );
    }
}

export default Codect;
