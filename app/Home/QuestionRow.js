import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
} from 'react-native';

import Question from '../Question/Question';

class QuestionRow extends Component {
    static propTypes = {
        title: PropTypes.string,
        navigator: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            item: {
                title: '',
                id: '',
                tags: [],
                author: '',
                language: []
            }
        };
        this._onPressButton = this._onPressButton.bind(this);
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
        this.setState({
            item: this.props.item
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.item.title !== nextProps.item.title) {
            return {
                item: nextProps.item
            };
        }
        return null;
    }

    _onPressButton() {
        this.props.navigator.push({
            title: this.state.item.title,
            backButtonTitle: null,
            component: Question,
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
    python: { backgroundColor: 'rgb(41, 85, 130)', borderRadius: 3, marginRight: 3, },
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

