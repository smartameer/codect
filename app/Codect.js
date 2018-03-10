import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Navigator, NavigatorIOS, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// disabling warning
console.disableYellowBox = true;

// Components based on routes
import Home from './Home/Home';
import Settings from './Settings/Settings';
import Menu from './Menu/Menu';
import API from './API/API';

class Codect  extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: true,
            rightButtonIcon: false,
            leftButtonIcon: false
        };
        this.apiService = new API();
        this._handleNavigationRequest = this._handleNavigationRequest.bind(this);
        this.configureScene = this.configureScene.bind(this);
    }

    componentDidMount() {
        Icon.getImageSource('ios-cog', 26).then((source) => this.setState({ rightButtonIcon: source }));
        Icon.getImageSource('ios-list', 32).then((source) => this.setState({ leftButtonIcon: source }));
        this.apiService.fetchQuestionsList().then(() => {
            this.setState({ isLoading: false});
            this.apiService.fetchQuestionContent();
        }).catch(() => {
            this.setState({ isLoading: false});
        });
    }

    _handleNavigationRequest(left) {
        let obj = {
            component: Settings,
            title: 'Settings'
        };
        if (left === true) {
            obj = { component: Menu, title: 'Menu' }
        }

        this.refs.nav.push(obj);
    }

    configureScene(route, routeStack){
        if(route.type === 'Modal') {
            return Navigator.SceneConfigs.FloatFromBottom
        }
        return Navigator.SceneConfigs.PushFromLeft
    }

    render() {
        if (this.state.isLoading || !this.state.rightButtonIcon || !this.state.leftButtonIcon) {
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
                title: 'Home',
                leftButtonIcon: this.state.leftButtonIcon,
                onLeftButtonPress: () => this._handleNavigationRequest(true),
                rightButtonIcon: this.state.rightButtonIcon,
                onRightButtonPress: () => this._handleNavigationRequest(false),
            }}
            style={{flex: 1}}
            />
        );
    }
}

export default Codect;
