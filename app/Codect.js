import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Navigator, NavigatorIOS, Text, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// disabling warning
console.disableYellowBox = true;

// Components based on routes
import Home from './Home/Home';
import Settings from './Settings/Settings';
import Menu from './Menu/Menu';

class Codect  extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            rightButtonIcon: false,
            leftButtonIcon: false
        };
        this._handleNavigationRequest = this._handleNavigationRequest.bind(this);
        this.configureScene = this.configureScene.bind(this);
    }

    componentDidMount() {
        let tags = {}, languages = {};
        let problems = [
            { "id": 1,  "title": "Id veniam officia", "author": "Ila Craft", "tags": [ "ArrayList", "ListArray", "Object" ], "languages": [ "Java", "C++", "C" ] },
            { "id": 2,  "title": "Deserunt nisi do", "author": "Austin Cherry", "tags": [ "ArrayList", "Object", "ObjectMap" ], "languages": [ "Scala", "Javascript", "C" ] },
            { "id": 3,  "title": "Exercitationstu voluptate reprehenderit jhdsgkfasffhgksfa", "author": "Georgina Cole", "tags": [ "Map", "While-Loop", "Object" ], "languages": [ "Scala", "C", "Scala" ] },
            { "id": 4,  "title": "Esse ad do", "author": "Laura James", "tags": [ "Map", "Object", "Map" ], "languages": [ "Javascript", "Javascript", "Java" ] },
            { "id": 5,  "title": "Ipsum minim cupidatat", "author": "Martina Rutledge", "tags": [ "Map", "Map", "ArrayList" ], "languages": [ "C++", "Scala", "Java" ] },
            { "id": 6,  "title": "Sunt aliquip ea", "author": "Schroeder Bush", "tags": [ "String", "Map", "Object" ], "languages": [ "C", "Java", "C" ] },
            { "id": 7,  "title": "Elit magna in", "author": "Hansen Stokes", "tags": [ "Object", "Map", "ArrayList" ], "languages": [ "Java", "Python", "Javascript" ] },
            { "id": 8,  "title": "Aute quis ut", "author": "Campbell Bullock", "tags": [ "Operation", "ArrayList", "Array" ], "languages": [ "Scala", "Scala", "C++" ] },
            { "id": 9,  "title": "Aliqua elit qui", "author": "Carlson Ramsey", "tags": [ "Object", "ArrayList", "Map" ], "languages": [ "Java", "Javascript", "Python" ] },
            { "id": 10, "title": "Do velit consectetur", "author": "Mayo Howard", "tags": [ "List", "ArrayList", "Map" ], "languages": [ "Python", "Python", "Scala" ] },
            { "id": 11, "title": "Fugiat deserunt veniam", "author": "Anastasia Faulkner", "tags": [ "Object", "ArrayList", "Map" ], "languages": [ "C", "Java", "Python" ] },
            { "id": 12, "title": "Et incididunt excepteur", "author": "Adele Doyle", "tags": [ "HashMap", "Object", "Map" ], "languages": [ "Scala", "Javascript", "Java" ] },
            { "id": 13, "title": "Deserunt voluptate aute", "author": "Marian Atkins", "tags": [ "ArrayList", "Map", "Object" ], "languages": [ "Javascript", "Python", "Javascript" ] },
            { "id": 14, "title": "Nostrud dolore incididunt", "author": "Houston Hatfield", "tags": [ "Object", "ArrayList", "Object" ], "languages": [ "C", "Python", "C++" ] },
            { "id": 15, "title": "Sit cillum et", "author": "Jacqueline English", "tags": [ "Object", "ArrayList", "Boolean" ], "languages": [ "Python", "Java", "Python" ] },
            { "id": 16, "title": "Cupidatat labore in", "author": "Salas Mendoza", "tags": [ "NULL", "ArrayList", "Integer" ], "languages": [ "C", "Scala", "Scala" ] },
            { "id": 17, "title": "Sit cupidatat fugiat", "author": "Medina Butler", "tags": [ "UIKit", "Map", "Object" ], "languages": [ "Java", "Scala", "C++" ] },
            { "id": 18, "title": "Pariatur voluptate ea", "author": "Levine Russo", "tags": [ "Loop", "ArrayList", "Filter" ], "languages": [ "Java", "C", "Scala" ] },
            { "id": 19, "title": "Ad incididunt tempor", "author": "Blevins Shepard", "tags": [ "Source", "Object", "ArrayList" ], "languages": [ "C", "Javascript", "Python" ] },
            { "id": 20, "title": "Ex amet cillum", "author": "Short Cruz", "tags": [ "Object", "Attribute", "Variable" ], "languages": [ "C++", "Javascript", "Javascript" ] }
        ];
        problems.forEach(p => {
            p.tags.forEach(t => {
                tags[t] = true;
            });
            p.languages.forEach(l => {
                languages[l] = true;
            });
        });

        AsyncStorage.setItem('problems', JSON.stringify(problems));
        AsyncStorage.setItem('tags', JSON.stringify(Object.keys(tags)));
        AsyncStorage.setItem('languages', JSON.stringify(Object.keys(languages)));

        Icon.getImageSource('ios-cog', 26).then((source) => this.setState({ rightButtonIcon: source }));
        Icon.getImageSource('ios-list', 32).then((source) => this.setState({ leftButtonIcon: source }));
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
        if (!this.state.rightButtonIcon || !this.state.leftButtonIcon) {
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
