import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    AsyncStorage,
    TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Base64 from 'base-64';

import EM from '../API/Event';

class Languages extends Component {
    static propTypes = {
        navigator: PropTypes.object.isRequired,
    }

    _keyExtractor = (item, index) => Base64.encode(index);

    constructor(props, context) {
        super(props);
        this.state = {
            languages: []
        };
        this._handleLanguageNavigation = this._handleLanguageNavigation.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem('languages').then((response) => {
            let languages = JSON.parse(response);
            this.setState({
                languages: languages.sort()
            });
        }).done();
    }

    _handleLanguageNavigation(item) {
        AsyncStorage.multiSet([['filterBy', item], ['filterType', 'languages']]).then(() => {
            this.props.navigator.popToTop();
            EM.publish('codect:refresh:home');
        });
    }

    render() {
        return (
            <FlatList
                data={this.state.languages}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                ListEmptyComponent={(
                    <Text style={styles.emptyList}>Languages hasn't been added.</Text>
                )}
                ListHeaderComponent={(
                    <View style={styles.header}>
                        <Text style={styles.title}>Languages</Text>
                    </View>
                )}
                renderItem={({item}) => (
                    <TouchableHighlight underlayColor="#DDDDDD" onPress={() => {this._handleLanguageNavigation(item)}}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.listTitleStyle} numberOfLines={1}>{item}</Text>
                            <Icon name="ios-arrow-forward-outline" size={20} style={styles.rightIconStyle}/>
                        </View>
                    </TouchableHighlight>
                )} />
        );
    }
}

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexGrow: 1,
        marginTop: 0,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    itemContainer: {
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    listTitleStyle: {
        fontSize: 16,
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 16,
        marginRight: 8,
        paddingLeft: 16,
    },
    rightIconStyle: {
        color: '#007aff',
        paddingRight: 16,
    },
    header: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 20,
        paddingBottom: 8,
        flexDirection: 'column',
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
    },
    emptyList: {
        marginTop: 20,
        textAlign: 'center',
        color: '#ccc',
        fontSize: 16,
    },
});

export default Languages;
