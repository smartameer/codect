import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    AsyncStorage,
    ActionSheetIOS,
    TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Question from '../Question/Question';
import EM from '../API/Event';

class QuestionRow extends Component {
    static propTypes = {
        title: PropTypes.string,
        navigator: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            item: this.props.item,
            rightButtonIcon: null,
            bookmarked: false,
        };
        this._onPressButton = this._onPressButton.bind(this);
        this._handleBookmarking = this._handleBookmarking.bind(this);
        this._handleActions = this._handleActions.bind(this);
        this.getBookmarkData = this.getBookmarkData.bind(this);
        this.langMap = {
            javascript: 'JS',
            php: 'PHP',
            python: 'Python',
            c: 'C',
            'c++': 'C++',
            java: 'Java',
            ruby: 'Ruby',
        };
    }

    componentDidMount() {
        this.getBookmarkData();
    }

    getBookmarkData() {
        AsyncStorage.getItem('bookmark_question_' + this.state.item.id).then((resp) => {
            if (resp !== null) {
                this.setState({ bookmarked: true });
            }
        });
        Icon.getImageSource('ios-more-outline', 26).then((source) => this.setState({ rightButtonIcon: source }));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.item.title !== nextProps.item.title) {
            return {
                item: nextProps.item
            };
        }
        return null;
    }

    _handleActions() {
        ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel', (!this.state.bookmarked ? 'Bookmark' : 'Remove Bookmark'), 'Mark as Read'],
            cancelButtonIndex: 0,
        }, (buttonIndex) => {
            if (buttonIndex === 1) {
                this._handleBookmarking();
            }
        });
    }

    _handleBookmarking() {
        this.setState({
            bookmarked: !this.state.bookmarked
        }, () => {
            if (this.state.bookmarked) {
                AsyncStorage.setItem('bookmark_question_' + this.state.item.id, 'true').then(() => {
                    EM.publish('codect:refresh:bookmark');
                });
            } else {
                AsyncStorage.removeItem('bookmark_question_' + this.state.item.id).then(() => {
                    EM.publish('codect:refresh:bookmark');
                });
            }
        });
    }

    _onPressButton() {
        this.props.navigator.push({
            title: this.state.item.title,
            backButtonTitle: null,
            component: Question,
            rightButtonIcon: this.state.rightButtonIcon,
            onRightButtonPress: () => this._handleActions(),
            passProps: { item: this.state.item }
        });
    }

    render() {
        return (
            <TouchableHighlight underlayColor={'#DDDDDD'} onPress={this._onPressButton}>
                <View style={styles.container}>
                    <Text style={styles.title} numberOfLines={1}>{this.state.item.title}</Text>
                    <View style={styles.tagnlang}>
                        <View style={styles.tags}>
                        {
                            this.state.item.tags.map((tag, i) => {
                                return <View style={styles.tagData} key={i}><Text style={styles.tag}>{tag}</Text> { (i < (this.state.item.tags.length - 1)) && (<Text style={styles.centerDot}>.</Text>)}</View>
                            })
                        }
                        </View>
                        <View style={styles.languages}>
                        {
                            this.state.item.languages.map((language, i) => {
                                return <View style={styles[language.toLowerCase()]} key={i}><Text style={styles.language}>{this.langMap[language.toLowerCase()]}</Text></View>
                            })
                        }
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 16,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: {
        fontSize: 16,
    },
    tagnlang: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tags: {
        marginTop: 3,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagData: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        paddingRight: 0,
        paddingTop: 3,
        paddingBottom: 3,
        fontSize: 11,
        fontWeight: "600",
        color: '#aaa',
    },
    languages: {
        marginTop: 3,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    javascript: { backgroundColor: 'rgb(244, 218, 26)', borderRadius: 3, marginRight: 3, },
    php: { backgroundColor: 'rgb(98, 101, 163)', borderRadius: 3, marginRight: 3, },
    python: { backgroundColor: 'rgb(254, 199, 53)', borderRadius: 3, marginRight: 3, },
    java: { backgroundColor: 'rgb(223, 91, 8)', borderRadius: 3, marginRight: 3, },
    c: { backgroundColor: 'rgb(18, 142, 224)', borderRadius: 3, marginRight: 3, },
    ruby: { backgroundColor: 'rgb(158, 0, 4)', borderRadius: 3, marginRight: 3, },
    'c++': { backgroundColor: 'rgb(82, 134, 200)', borderRadius: 3, marginRight: 3, },
    language: {
        paddingRight: 4,
        paddingLeft: 4,
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 11,
        fontWeight: "600",
    },
    centerDot: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 20,
        lineHeight: 16,
        marginRight: 4,
        marginLeft: 4,
        alignSelf: 'center'
    },
});

export default QuestionRow;

