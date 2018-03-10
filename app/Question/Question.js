import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

class Question extends Component {
    static propTypes = {
        title: PropTypes.string,
        item: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props);
        this.state = {
            isLoading: true,
            item: {
                title: '',
                id: '',
                tags: [],
                author: '',
                language: []
            }
        };
    }

    componentDidMount() {
        this.setState({
            item: this.props.item,
            isLoading: false
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, marginTop: 100}}>
                    <ActivityIndicator />
                </View>
            );
        }


        return (
            <ScrollView style={styles.container}>
              <Text>{this.state.item.title}</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});

export default Question;

