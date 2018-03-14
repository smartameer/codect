import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    TouchableHighlight,
    AsyncStorage,
    View,
    Linking,
    AlertIOS,
    TabBarIOS,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { List, ListItem } from 'react-native-elements';

import Help from '../Help/Help';
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
            aboutIcon: null,
            helpIcon: null,
            helpSelectedIcon: null,
            feedbackIcon: null,
            selectedTab: null,
        };
        this._handleNavigation = this._handleNavigation.bind(this);
        this._expandList = this._expandList.bind(this);
        this._selectOption = this._selectOption.bind(this);
        this._showAbout = this._showAbout.bind(this);
        this._showFeedback = this._showFeedback.bind(this);
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
        Icon.getImageSource('ios-information-circle-outline', 24).then((source) => this.setState({ aboutIcon: source }));
        Icon.getImageSource('ios-help-circle-outline', 24).then((source) => this.setState({ helpIcon: source }));
        Icon.getImageSource('ios-help-circle', 24).then((source) => this.setState({ helpSelectedIcon: source }));
        Icon.getImageSource('ios-happy-outline', 24).then((source) => this.setState({ feedbackIcon: source }));
    }

    _handleNavigation(type) {
        let obj = {};
        if (type === 'category') {
            obj = { title: 'Categories', component: Categories };
        } else if (type === 'bookmarks') {
            obj = { title: 'Bookmarks', component: Bookmarks };
        } else if (type === 'help') {
            obj = { title: 'Help', component: Help };
        }

        this.props.navigator.push(obj);
    }

    _expandList () {
        this.setState({ sort : !this.state.sort });
    }

    _selectOption (val) {
        this.setState({ 'sortBy': val }, () => {
            AsyncStorage.setItem( 'sortBy', val ).then(() => {
                this.props.navigator.popToTop();
                EM.publish('codect:refresh:home');
            });
        });
    }

    _showAbout() {
        AlertIOS.alert(
            'About',
            'Hello there. Hope this app is helping. This is written in react native. The questions & answers are in sync with github. List of questions and their aanswers are mantained by me and contributors. You can always ask for some algorithms in feedback by droping us an email, which inturn will be helpful for others. We will be adding more features & question-answers based on your feedback. You might want to visit out github repo. Its open and you can also contribute.',
            [
                {text: 'Close', style: 'cancel'},
                {text: 'Github Source',  onPress: () => {
                    Linking.openURL('https://www.github.com/smartameer/codect');
                }},
                {text: 'Question & Answers',  onPress: () => {
                    Linking.openURL('https://www.github.com/smartameer/codect-code');
                }},
            ]
        );
    }

    _showFeedback() {
        AlertIOS.alert(
            'Feedback',
            'Help us to make it better',
            [
                {text: 'Close', style: 'cancel'},
                {text: 'Email your feedback', onPress: () => {
                    Linking.openURL('mailto:smartameer@icloud.com?subject=Feedback on Codect');
                }},
                {text: 'Rate Codect', onPress: () => {
                    let link = 'itms-apps://itunes.apple.com/us/app/id333903271?mt=8';
                    Linking.canOpenURL(link).then(supported => {
                        supported && Linking.openURL(link);
                    }, (err) => console.log(err));
                }},
            ]
        );
    }

    render() {
        if (!this.state.aboutIcon || !this.state.helpIcon || !this.state.feedbackIcon || !this.state.helpSelectedIcon) {
            return false;
        }
        let plus = (<Icon name="ios-add-outline" size={26} />);
        let minus = (<Icon name="ios-remove-outline" size={26} />);
        let arrow = (<Icon name="ios-arrow-forward-outline" size={20} />);
        let radioOn = (<Icon name="ios-radio-button-on-outline" size={16} style={{color: '#007aff'}} />);
        let radioOff = (<Icon name="ios-radio-button-off-outline" size={16} />);

        let sort = (<Icon style={styles.leftIcon} name="ios-swap-outline" size={28} />);
        let category = (<Icon style={styles.leftIcon} name="ios-list-box-outline" size={28} />);
        let bookmarks = (<Icon style={styles.leftIcon} name="ios-bookmarks-outline" size={28} />);

        return (
            <View style={styles.container}>
                <List>
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
                <TabBarIOS unselectedItemTintColor={'#007aff'} translucent={true}>
                    <TabBarIOS.Item title="Help" icon={this.state.helpIcon} onPress={() => { this._handleNavigation('help')}}>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item title="Feedback" icon={this.state.feedbackIcon} onPress={() => {this._showFeedback()}} >
                    </TabBarIOS.Item>
                    <TabBarIOS.Item title="About" icon={this.state.aboutIcon} onPress={() => {this._showAbout()}}>
                    </TabBarIOS.Item>
                </TabBarIOS>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 43,
        flex: 1,
        backgroundColor: 'transparent',
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

