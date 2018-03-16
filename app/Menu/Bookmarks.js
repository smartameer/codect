import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    AlertIOS,
    FlatList,
    AsyncStorage,
    TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Base64 from 'base-64';

import EM from '../API/Event';
import Question from '../Question/Question';

class Bookmarks extends Component {
    static propTypes = {
        title: PropTypes.string,
        navigator: PropTypes.object.isRequired,
    }

    _keyExtractor = (item, index) => Base64.encode(index);

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
        AlertIOS.alert(
            'Remove Bookmark',
            '',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: () => {
                    AsyncStorage.removeItem('bookmark_question_' + item.id).then(() => {
                        EM.publish('codect:bookmark:removed', item.id);
                        this.setState({ undoBookmarkQuestionId: item.id }, () => {
                            this.getBookmarkData();
                        });
                    });
                }},
            ]
        );
    }

    _undoRemoveBookmark() {
        AsyncStorage.setItem('bookmark_question_' + this.state.undoBookmarkQuestionId, 'true').then(() => {
            EM.publish('codect:bookmark:added', this.state.undoBookmarkQuestionId);
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

    renderBookmarkRow({item}) {
        return (
            <View style={styles.itemContainer}>
                <TouchableHighlight underlayColor={'#DDDDDD'} style={styles.fullWidth} onPress={()=>{this._handleNavigationRequest(item)}}>
                    <Text style={styles.listTitleStyle} numberOfLines={1}>{item.title}</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'#DDDDDD'} onPress={() => { this._removeBookmark(item)}}>
                    <Icon style={styles.rightIconStyle} name="ios-trash-outline" size={26} />
                </TouchableHighlight>
            </View>
        )
    }

    render() {
        return (
            <FlatList
                containerStyle={styles.container}
                data={this.state.bookmarks}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                ListEmptyComponent={this.renderEmptyComponent}
                ListHeaderComponent={this.renderHeader}
                renderItem={this.renderBookmarkRow} />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
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
        flex: 1,
    },
    listTitleStyle: {
        fontSize: 16,
        paddingTop: 16,
        paddingBottom: 16,
        paddingRight: 16,
        marginRight: 8,
        paddingLeft: 16,
        alignSelf: 'flex-start',
    },
    rightIconStyle: {
        color: '#ff3b30',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 16,
        paddingLeft: 16,
        alignSelf: 'flex-end',
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

