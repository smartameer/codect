import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    FlatList,
    Button,
    AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import ProblemRow from './ProblemRow';

type Props = {};

class Home extends Component<Props> {
    static propTypes = {
        title: PropTypes.string.isRequired,
        navigator: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: true,
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('problems').then((list) => {
            this.setState({
                isLoading: false,
                problems: JSON.parse(list)
            });
        }).done();
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
            <ScrollView contentContainerStyle={styles.container}>
              <FlatList data={this.state.problems} renderItem={({item}, index) => <ProblemRow key={index} item={item} {...this.props}/>} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 65,
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: '#0079fe'
    }
});

export default Home;
