import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    ScrollView
} from 'react-native';

class Menu extends Component {
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
              <Text>Menu</Text>
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

export default Menu;

