import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    ScrollView
} from 'react-native';

class Help extends Component {
    static propTypes = {
        title: PropTypes.string,
        navigator: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props);
        this.state = {
            settings: {}
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <ScrollView style={styles.container}>
              <Text style={{textAlign: 'center', marginTop: 30, fontSize: 30}}>Help</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});

export default Help;

