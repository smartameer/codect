import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    FlatList,
    AsyncStorage,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import EM from '../API/Event';
import Question from '../Question/Question';

class Bookmarks extends Component {
    static propTypes = {
        title: PropTypes.string,
        navigator: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props);
        this.state = {
            bookmarks: [],
            undoBookmarkQuestionId: null,
        };
        this.getBookmarkData = this.getBookmarkData.bind(this);
        this._handleNavigationRequest = this._handleNavigationRequest.bind(this);
        this._removeBookmark = this._removeBookmark.bind(this);
        this._undoRemoveBookmark = this._undoRemoveBookmark.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderBookmarkRow = this.renderBookmarkRow.bind(this);
        this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
    }

    componentDidMount() {
        this.getBookmarkData();
    }

    getBookmarkData() {
        AsyncStorage.getItem('questions').then((resp) => {
            let questions = JSON.parse(resp);
            let bookmarks = [];
            AsyncStorage.getAllKeys().then((keys) => {
                keys.forEach((k) => {
                    if (k.indexOf('bookmark_question_') > -1) {
                        let qid = parseInt(k.split('bookmark_question_')[1], 10);
                        let bookmarkItem = questions.filter(q => q.id === qid)[0];
                        bookmarks.push(bookmarkItem);
                    }
                });
                this.setState({ bookmarks: bookmarks });
            });
        });
    }

    _handleNavigationRequest(item) {
        this.props.navigator.push({
            title: item.title,
            component: Question,
            passProps: { item: item }
        });
    }

    _removeBookmark(item) {
        Alert.alert(
            'Remove Bookmark',
            '',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => {
                    AsyncStorage.removeItem('bookmark_question_' + item.id).then(() => {
                        this.setState({ undoBookmarkQuestionId: item.id }, () => {
                            this.getBookmarkData();
                        });
                    });
                }},
            ],
            { cancelable: false }
        );
    }

    _undoRemoveBookmark() {
        AsyncStorage.setItem('bookmark_question_' + this.state.undoBookmarkQuestionId, 'true').then(() => {
            this.setState({ undoBookmarkQuestionId: null }, () => {
                this.getBookmarkData();
            });
        });
    }

    renderHeader() {
        return (
            <View style={styles.header}>
                <Text style={styles.title}>Bookmarks</Text>
                { this.state.undoBookmarkQuestionId !== null && (<TouchableHighlight underlayColor={'#DDDDDD'} onPress={this._undoRemoveBookmark}>
                    <Text style={styles.undoTitleStyle}>Undo</Text>
                </TouchableHighlight>)}
            </View>
        );
    }

    renderEmptyComponent() {
        return (
            <Text style={styles.emptyList}>You haven't bookmarked any questions.</Text>
        );
    }

    renderBookmarkRow(index, item) {
        return (
            <View key={index} style={styles.itemContainer}>
                <TouchableHighlight style={styles.fullWidth} onPress={()=>{this._handleNavigationRequest(item)}}>
                    <Text style={styles.listTitleStyle} numberOfLines={1}>{item.title}</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'#DDDDDD'} onPress={() => { this._removeBookmark(item)}}>
                    <Icon style={styles.rightIconStyle} name="ios-trash-outline" size={26} />
                </TouchableHighlight>
            </View>
        )
    }

    render() {
        let trash = (<Icon name="ios-trash-outline" size={26} style={{color: '#ff3b30', marginRight: 8}}/>);
        return (
            <ScrollView style={styles.container}>
                <FlatList
                    data={this.state.bookmarks}
                    extraData={this.state}
                    ListEmptyComponent={this.renderEmptyComponent}
                    ListHeaderComponent={this.renderHeader}
                    renderItem={({item}, index) => this.renderBookmarkRow(index, item)} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexGrow: 1
    },
    itemContainer: {
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fullWidth: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        alignContent: 'stretch',
    },
    listTitleStyle: {
        fontSize: 16,
        paddingTop: 16,
        paddingBottom: 16,
        paddingRight: 16,
        marginRight: 8,
        paddingLeft: 16,
    },
    rightIconStyle: {
        color: '#ff3b30',
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 16,
        paddingLeft: 16,
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
    undoTitleStyle: {
        fontSize: 14,
        color: '#007aff',
        alignSelf: 'flex-end',
        marginTop: -24,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#007aff',
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 3,
    }
});

export default Bookmarks;

