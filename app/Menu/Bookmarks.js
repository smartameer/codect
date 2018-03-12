import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    AsyncStorage,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

class Bookmarks extends Component {
    static propTypes = {
        title: PropTypes.string,
        navigator: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props);
        this.state = {
            bookmarks: []
        };
    }

    componentDidMount() {
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

    render() {
        let arrow = (<Icon name="ios-arrow-forward-outline" size={20} style={{color: '#007aff'}}/>);
        return (
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Bookmarks</Text>
                </View>
                <List containerStyle={styles.listContainer}>
                {
                    this.state.bookmarks.map((t, i) => (
                        <ListItem key={i} component={TouchableHighlight} rightIcon={arrow} titleStyle={styles.listTitleStyle} containerStyle={styles.itemContainer} title={t.title} />
                    ))
                }
                </List>
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
    listContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexGrow: 1,
        marginTop: 0
    },
    itemContainer: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 16,
        paddingLeft: 0,
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    listTitleStyle: {
        fontSize: 16,
    },
    header: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 20,
        paddingBottom: 8,
        flexDirection: 'column',
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
    },
});

export default Bookmarks;

