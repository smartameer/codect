import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    TouchableHighlight,
    AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { List, ListItem } from 'react-native-elements';

import Categories from './Categories';
import Bookmarks from './Bookmarks';
import EM from '../API/Event';

class Menu extends Component {
    static propTypes = {
        title: PropTypes.string,
        navigator: PropTypes.object.isRequired,
    };

    constructor(props, context) {
        super(props);
        this.state = {
            sort: false,
            filter: false,
            sortBy: 'latest',
            filterBy: null,
        };
        this._handleNavigation = this._handleNavigation.bind(this);
        this._expandList = this._expandList.bind(this);
        this._selectOption = this._selectOption.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem('sortBy').then((resp) => {
            let sortBy = resp || 'latest';
            this.setState({ sortBy: sortBy });
        });
        AsyncStorage.getItem('filterBy').then((resp) => {
            let filterBy = resp;
            this.setState({ filterBy: filterBy });
        });
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

    _expandList () {
        this.setState({ sort : !this.state.sort });
    }

    _selectOption (val) {
        let self = this;
        this.setState({ 'sortBy': val }, () => {
            AsyncStorage.setItem( 'sortBy', val ).then(() => {
                self.props.navigator.popToTop();
                EM.publish('codect:refresh:home');
            });
        });
    }

    render() {
        let plus = (<Icon name="ios-add-outline" size={26} />);
        let minus = (<Icon name="ios-remove-outline" size={26} />);
        let arrow = (<Icon name="ios-arrow-forward-outline" size={20} />);
        let radioOn = (<Icon name="ios-radio-button-on-outline" size={16} style={{color: '#007aff'}} />);
        let radioOff = (<Icon name="ios-radio-button-off-outline" size={16} />);

        let sort = (<Icon style={styles.leftIcon} name="ios-swap-outline" size={28} />);
        let category = (<Icon style={styles.leftIcon} name="ios-list-box-outline" size={28} />);
        let bookmarks = (<Icon style={styles.leftIcon} name="ios-bookmarks-outline" size={28} />);
        return (
            <List containerStyle={styles.container}>
                <ListItem component={TouchableHighlight} titleStyle={styles.titleStyle} containerStyle={styles.itemContainer} title="Sort by" leftIcon={sort} rightIcon={this.state.sort ? minus: plus} onPress={() => { this.setState({ sort : !this.state.sort }); }}/>
                {
                    this.state.sort && <ListItem component={TouchableHighlight} titleStyle={styles.subTitleStyle} containerStyle={styles.subItemContainer} title='Latest' rightIcon={this.state.sortBy === 'latest' ? radioOn : radioOff} onPress={() => { this._selectOption('latest') }} />
                }
                {
                    this.state.sort && <ListItem component={TouchableHighlight} titleStyle={styles.subTitleStyle} containerStyle={styles.subItemContainer} title='Oldest' rightIcon={this.state.sortBy === 'oldest' ? radioOn : radioOff} onPress={() => { this._selectOption('oldest') }} />
                }
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
    subItemContainer: {
        paddingRight: 8,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 22,
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    subTitleStyle: {
        fontSize: 14,
    },
    leftIcon: {
        marginTop: 6,
        marginRight: 10,
        color: '#007aff'
    }
});

export default Menu;

