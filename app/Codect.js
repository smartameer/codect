import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigatorIOS, Text, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Components based on routes
import Home from './Home/Home';
import Settings from './Settings/Settings';

class Codect  extends Component {

    constructor(props, context) {
        super(props, context);
        this._handleNavigationRequest = this._handleNavigationRequest.bind(this);
        this.state = {
            rightButtonIcon: false,
            leftButtonIcon: false
        };
    }

    componentDidMount() {
        let problems = [
            { id: 1, name: 'Problem 1', author: 'Pradeep Patro', tags: ['Array', 'List'], language: ['JavaScript', 'PHP'] },
            { id: 2, name: 'Problem 2', author: 'Pradeep Patro', tags: ['Array', 'Object'], language: ['JavaScript'] },
            { id: 3, name: 'Problem 3', author: 'Prashant Patro', tags: ['ArrayList', 'List'], language: ['Python', 'PHP'] },
            { id: 4, name: 'Problem 4', author: 'Padmini Patro', tags: ['Array', 'Map'], language: ['PHP'] },
            { id: 5, name: 'Problem 5', author: 'Pradeep Patro', tags: ['Array', 'List'], language: ['JavaScript', 'PHP'] },
            { id: 6, name: 'Problem 6', author: 'Pradeep Patro', tags: ['Array', 'List'], language: ['JavaScript', 'PHP'] },
            { id: 7, name: 'Problem 7', author: 'Pradeep Patro', tags: ['Array', 'List'], language: ['JavaScript', 'PHP'] },
            { id: 8, name: 'Problem 8', author: 'Pradeep Patro', tags: ['Array', 'List'], language: ['JavaScript', 'PHP'] },
            { id: 9, name: 'Problem 9', author: 'Pradeep Patro', tags: ['Array', 'List'], language: ['JavaScript', 'PHP'] },
            { id: 10, name: 'Problem 10', author: 'Pradeep Patro', tags: ['Array', 'List'], language: ['JavaScript', 'PHP'] },
            { id: 11, name: 'Problem 11', author: 'Pradeep Patro', tags: ['Array', 'List'], language: ['JavaScript', 'PHP'] },
            { id: 12, name: 'Problem 12', author: 'Pradeep Patro', tags: ['Array', 'List'], language: ['JavaScript', 'PHP'] },
        ];
        AsyncStorage.setItem('problems', JSON.stringify(problems));
        Icon.getImageSource('ios-cog', 26).then((source) => this.setState({ rightButtonIcon: source }));
        Icon.getImageSource('ios-list', 32).then((source) => this.setState({ leftButtonIcon: source }));
    }

    _handleNavigationRequest() {
        this.refs.nav.push({
            component: Settings,
            title: 'Settings'
        });
    }

    render() {
        if (!this.state.rightButtonIcon || !this.state.leftButtonIcon) {
            return false;
        }
        return (
          <NavigatorIOS
            ref='nav'
            translucent={true}
            interactivePopGestureEnabled={true}
            initialRoute={{
                component: Home,
                title: 'Home',
                leftButtonIcon: this.state.leftButtonIcon,
                rightButtonIcon: this.state.rightButtonIcon,
                onRightButtonPress: () => this._handleNavigationRequest(),
            }}
            style={{flex: 1}}
            />
        );
    }
}

export default Codect;
