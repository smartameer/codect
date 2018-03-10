import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigatorIOS, Text, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// disabling warning
console.disableYellowBox = true;

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
            { "id": 1,  "title": "Id veniam officia", "author": "Ila Craft", "tags": [ "ArrayList", "ArrayList", "Object" ], "language": [ "Java", "C++", "C" ] },
            { "id": 2,  "title": "Deserunt nisi do", "author": "Austin Cherry", "tags": [ "ArrayList", "Object", "Object" ], "language": [ "Scala", "Javascript", "C" ] },
            { "id": 3,  "title": "Exercitationstu voluptate reprehenderit jhdsgkfasffhgksfa", "author": "Georgina Cole", "tags": [ "Map", "Map", "Object" ], "language": [ "Scala", "C", "Scala" ] },
            { "id": 4,  "title": "Esse ad do", "author": "Laura James", "tags": [ "Map", "Object", "Map" ], "language": [ "Javascript", "Javascript", "Java" ] },
            { "id": 5,  "title": "Ipsum minim cupidatat", "author": "Martina Rutledge", "tags": [ "Map", "Map", "ArrayList" ], "language": [ "C++", "Scala", "Java" ] },
            { "id": 6,  "title": "Sunt aliquip ea", "author": "Schroeder Bush", "tags": [ "Map", "Map", "Object" ], "language": [ "C", "Java", "C" ] },
            { "id": 7,  "title": "Elit magna in", "author": "Hansen Stokes", "tags": [ "Object", "Map", "ArrayList" ], "language": [ "Java", "Python", "Javascript" ] },
            { "id": 8,  "title": "Aute quis ut", "author": "Campbell Bullock", "tags": [ "ArrayList", "ArrayList", "ArrayList" ], "language": [ "Scala", "Scala", "C++" ] },
            { "id": 9,  "title": "Aliqua elit qui", "author": "Carlson Ramsey", "tags": [ "Map", "ArrayList", "Map" ], "language": [ "Java", "Javascript", "Python" ] },
            { "id": 10, "title": "Do velit consectetur", "author": "Mayo Howard", "tags": [ "Map", "ArrayList", "Map" ], "language": [ "Python", "Python", "Scala" ] },
            { "id": 11, "title": "Fugiat deserunt veniam", "author": "Anastasia Faulkner", "tags": [ "Object", "ArrayList", "Map" ], "language": [ "C", "Java", "Python" ] },
            { "id": 12, "title": "Et incididunt excepteur", "author": "Adele Doyle", "tags": [ "Map", "Object", "Map" ], "language": [ "Scala", "Javascript", "Java" ] },
            { "id": 13, "title": "Deserunt voluptate aute", "author": "Marian Atkins", "tags": [ "ArrayList", "Map", "Object" ], "language": [ "Javascript", "Python", "Javascript" ] },
            { "id": 14, "title": "Nostrud dolore incididunt", "author": "Houston Hatfield", "tags": [ "Object", "ArrayList", "Object" ], "language": [ "C", "Python", "C++" ] },
            { "id": 15, "title": "Sit cillum et", "author": "Jacqueline English", "tags": [ "Object", "ArrayList", "Object" ], "language": [ "Python", "Java", "Python" ] },
            { "id": 16, "title": "Cupidatat labore in", "author": "Salas Mendoza", "tags": [ "ArrayList", "ArrayList", "Object" ], "language": [ "C", "Scala", "Scala" ] },
            { "id": 17, "title": "Sit cupidatat fugiat", "author": "Medina Butler", "tags": [ "Map", "Map", "Object" ], "language": [ "Java", "Scala", "C++" ] },
            { "id": 18, "title": "Pariatur voluptate ea", "author": "Levine Russo", "tags": [ "ArrayList", "ArrayList", "Map" ], "language": [ "Java", "C", "Scala" ] },
            { "id": 19, "title": "Ad incididunt tempor", "author": "Blevins Shepard", "tags": [ "Map", "Object", "ArrayList" ], "language": [ "C", "Javascript", "Python" ] },
            { "id": 20, "title": "Ex amet cillum", "author": "Short Cruz", "tags": [ "Object", "Object", "Map" ], "language": [ "C++", "Javascript", "Javascript" ] }
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
