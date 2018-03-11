import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    FlatList,
    AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';

import QuestionRow from './QuestionRow';

type Props = {};

class Home extends Component<Props> {
    static propTypes = {
        title: PropTypes.string,
        navigator: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: true,
            questions: null,
            sortBy: null,
            filterBy: null,
        };
        this.renderHeader = this.renderHeader.bind(this);
        this._onSearchQuestion = this._onSearchQuestion.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem('questions').then((list) => {
            if (list === null) {
                this.setState({
                    isLoading: false,
                    questions: []
                });

            } else {
                let questions = JSON.parse(list);
                if (questions.message) {
                    questions = [];
                }
                this.setState({
                    isLoading: false,
                    questions: questions
                });
            }
        }).done();
        AsyncStorage.getItem('sortBy').then((resp) =>  {
            this.setState({ sortBy: resp || 'latest' });
        });
        AsyncStorage.getItem('filterBy').then((resp) => {
            this.setState({ filterBy: resp })
        });
    }

    _onSearchQuestion(pattern) {
        AsyncStorage.getItem('questions').then((response) => {
            let list = [];
            if (response !== null) {
                let questions = JSON.parse(response);
                list = questions.filter(p => {
                    return p.title.toLowerCase().indexOf(pattern.toLowerCase()) > -1;
                });
            }
            this.setState({
                questions: list
            });
        }).done();
    }

    renderHeader() {
        let header = (
            <View style={styles.header}>
              <Text style={styles.title}>Questions</Text>
              <SearchBar autoCapitalize='none' lightTheme platform={'ios'} inputStyle={styles.searchInput} containerStyle={styles.searchContainer} placeholder={'Search from ' + this.state.questions.length + ' questions'} onChangeText={this._onSearchQuestion} />
              <Text style={styles.sortedBy}>Sorted by: {this.state.sortBy}</Text>
            </View>
        );
        return header;
    }

    render() {
        if (this.state.isLoading || this.state.questions === null || this.state.sortBy === null) {
            return (
                <View style={{flex: 1, marginTop: 100}}>
                    <ActivityIndicator />
                </View>
            );
        }

        return (
            <ScrollView contentContainerStyle={styles.container}>
              <FlatList data={this.state.questions} ListHeaderComponent={this.renderHeader} renderItem={({item}, index) => <QuestionRow key={index} item={item} {...this.props}/>} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 65,
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexGrow: 1,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
    },
    header: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 20,
        paddingBottom: 8,
        flexDirection: 'column',
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
        backgroundColor: 'transparent'
    },
    searchContainer: {
        marginLeft: -8,
        marginRight: -8,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        shadowColor: 'transparent',
    },
    searchInput: {
        backgroundColor: '#efefef',
        borderRadius: 6,
        padding: 4,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: '#0079fe'
    },
    sortedBy: {
        fontSize: 11,
        color: '#bbb',
        alignSelf: 'flex-end',
        marginTop: -3,
    }
});

export default Home;
