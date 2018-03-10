import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { List, ListItem } from 'react-native-elements';

import Categories from './Categories';
import Bookmarks from './Bookmarks';

class Menu extends Component {
    static propTypes = {
        title: PropTypes.string,
        navigator: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props);
        this.state = {
            settings: {}
        };
        this._handleNavigation = this._handleNavigation.bind(this);
    }

    componentDidMount() {
    }

    _handleNavigation(type) {
        let obj = {};
        if (type === 'category') {
            obj = {
                title: 'Categories',
                component: Categories
            };
        }
        if (type === 'bookmarks') {
            obj = {
                title: 'Bookmarks',
                component: Bookmarks
            };
        }

        this.props.navigator.push(obj);
    }

    render() {
        let arrow = (<Icon name="ios-arrow-forward" size={20} />);
        let category = (<Icon style={styles.leftIcon} name="ios-list-box-outline" size={28} />);
        let bookmarks = (<Icon style={styles.leftIcon} name="ios-bookmarks-outline" size={28} />);
        return (
            <List containerStyle={styles.container}>
                <ListItem component={TouchableHighlight} titleStyle={styles.titleStyle} containerStyle={styles.itemContainer} title="Categories" leftIcon={category} rightIcon={arrow} onPress={() => {this._handleNavigation('category')}}/>
                <ListItem component={TouchableHighlight} titleStyle={styles.titleStyle} containerStyle={styles.itemContainer} title="Bookmarks" leftIcon={bookmarks} rightIcon={arrow} onPress={() => {this._handleNavigation('bookmarks')}}/>
            </List>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 63,
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    itemContainer: {
        paddingRight: 8,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    titleStyle: {
        fontSize: 16,
    },
    leftIcon: {
        marginTop: 6,
        marginRight: 10,
        color: '#007aff'
    }
});

export default Menu;

