import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TabBarIOS,
    AsyncStorage,
    TouchableHighlight,
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

class Tags extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            tags: []
        };
    }
    componentDidMount() {
        AsyncStorage.getItem('tags').then((response) => {
            let tags = JSON.parse(response);
            this.setState({
                tags: tags
            });
        }).done();
    }
    render() {
        let arrow = (<Icon name="ios-arrow-dropright-outline" size={20} style={{color: '#007aff'}}/>);
        return (
            <ScrollView containerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Tags</Text>
                </View>
                <List containerStyle={styles.listContainer}>
                {
                    this.state.tags.map((t, i) => (
                        <ListItem key={i} component={TouchableHighlight} rightIcon={arrow} titleStyle={styles.listTitleStyle} containerStyle={styles.itemContainer} title={t} />
                    ))
                }
                </List>
            </ScrollView>
        );
    }
}

class Languages extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            languages: []
        };
    }
    componentDidMount() {
        AsyncStorage.getItem('languages').then((response) => {
            let languages = JSON.parse(response);
            this.setState({
                languages: languages
            });
        }).done();
    }
    render() {
        let arrow = (<Icon name="ios-arrow-dropright-outline" size={20} style={{color: '#007aff'}}/>);
        return (
            <ScrollView containerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Languages</Text>
                </View>
                <List containerStyle={styles.listContainer}>
                {
                    this.state.languages.map((t, i) => (
                        <ListItem key={i} component={TouchableHighlight} rightIcon={arrow} titleStyle={styles.listTitleStyle} containerStyle={styles.itemContainer} title={t} />
                    ))
                }
                </List>
            </ScrollView>
        );
    }
}

class Categories extends Component {
    static propTypes = {
        title: PropTypes.string,
        navigator: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props);
        this.state = {
            selectedTab: 'tags',
        };
        this._onSelectTab = this._onSelectTab.bind(this);
    }

    componentDidMount() {
        Icon.getImageSource('ios-pricetags-outline', 24).then((source) => this.setState({ tagIcon: source }));
        Icon.getImageSource('ios-barcode-outline', 24).then((source) => this.setState({ languageIcon: source }));
    }

    _onSelectTab(type) {
        this.setState({ selectedTab: type });
    }

    render() {
        if (!this.state.tagIcon || !this.state.languageIcon) {
            return false;
        }
        return (
            <TabBarIOS selectedTab={this.state.selectedTab}>
              <TabBarIOS.Item title="Tags" selected={this.state.selectedTab === 'tags'} icon={this.state.tagIcon} onPress={() => { this._onSelectTab('tags') }}>
                <Tags />
              </TabBarIOS.Item>
              <TabBarIOS.Item title="Languages" selected={this.state.selectedTab === 'language'} icon={this.state.languageIcon} onPress={() => { this._onSelectTab('language') }}>
                <Languages />
              </TabBarIOS.Item>
            </TabBarIOS>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 63,
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexGrow: 1
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexGrow: 1,
        marginTop: 0
    },
    itemContainer: {
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 8,
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    listTitleStyle: {
        fontSize: 14,
    },
    header: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 20,
        paddingBottom: 8,
        flexDirection: 'column',
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
    },
});

export default Categories;

