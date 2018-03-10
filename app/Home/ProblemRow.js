import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
} from 'react-native';

import Problem from '../Problem/Problem';

class ProblemRow extends Component {
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
            component: Problem,
            passProps: { item: this.state.item }
        });
    }

    render() {
        return (
            <TouchableHighlight underlayColor={'#DDDDDD'} onPress={this._onPressButton}>
                <View style={styles.container}>
                    <Text style={styles.title} numberOfLines={1}>{this.state.item.title}</Text>
                    <View style={styles.tags}>
                    {
                        this.state.item.tags.map((tag, i) => {
                            return <View style={styles.tagData} key={i}><Text style={styles.tag}>{tag}</Text> { (i < (this.state.item.tags.length - 1)) && (<Text style={styles.centerDot}>.</Text>)}</View>
                        })
                    }
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
    },
    tags: {
        marginTop: 3,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    tagData: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    tag: {
        paddingRight: 0,
        paddingTop: 3,
        paddingBottom: 3,
        fontSize: 11,
        fontWeight: "600",
        color: '#aaa',
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
    container: {
        paddingLeft: 16,
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    }
});

export default ProblemRow;

