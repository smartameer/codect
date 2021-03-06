import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    ActionSheetIOS,
    FlatList,
    AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';

import EM from '../API/Event';
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
            searchText: '',
            refreshing: true,
            questions: null,
            sortBy: null,
            filterType: null,
            filterBy: null,
        };

        this.getData = this.getData.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
        this._onSearchQuestion = this._onSearchQuestion.bind(this);
        this._handleClearFilter = this._handleClearFilter.bind(this);
        this._refreshData = this._refreshData.bind(this);
    }

    componentDidMount() {
        EM.subscribe('codect:refresh:home', () => {
            this.getData();
        });
        this.getData();
    }

    getData (force = false) {
        AsyncStorage.getItem('questions').then(async (list) => {
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
                if (this.state.searchText !== '') {
                    questions = questions.filter(p => {
                        return p.title.toLowerCase().indexOf(this.state.searchText.toLowerCase()) > -1;
                    });
                }

                let sortBy = await AsyncStorage.getItem('sortBy');
                this.setState({ sortBy: sortBy || 'latest' });
                if (sortBy === 'latest') {
                    questions.sort((a, b) => { return a.id < b.id });
                }

                let filterType = await AsyncStorage.getItem('filterType');
                let filterBy = await AsyncStorage.getItem('filterBy');
                this.setState({filterType: filterType, filterBy: filterBy});
                if (filterBy !== null && filterType !== null) {
                    questions = questions.filter(q => q[filterType].indexOf(filterBy) > -1);
                }
                this.setState({
                    isLoading: false,
                    refreshing: false,
                    questions: questions
                });
            }
        }).done();
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
            if (this.state.sortBy === 'latest') {
                list.sort((a, b) => { return a.id < b.id });
            }
            this.setState({
                searchText: pattern,
                questions: list
            });
        }).done();
    }

    _handleClearFilter() {
        ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel', 'Clear Filter'],
            cancelButtonIndex: 0,
        }, (buttonIndex) => {
            if (buttonIndex === 1) {
                AsyncStorage.multiRemove(['filterType', 'filterBy']).then(() => {
                    this.getData();
                });
            }
        });
    }

    _refreshData() {
        this.setState({ refreshing: true }, () => {
            EM.publish('codect:refresh:all');
        });
    }

    renderHeader() {
        let filter = (this.state.filterType !== null) ? 'Filtered by ' + this.state.filterType.replace('s', '') + ': ' + this.state.filterBy : '';
        let header = (
            <View style={styles.header}>
              <Text style={styles.title}>Questions</Text>
              <SearchBar autoCapitalize='none' lightTheme platform={'ios'} inputStyle={styles.searchInput} containerStyle={styles.searchContainer} placeholder={'Search'} onChangeText={this._onSearchQuestion} />
              <View style={styles.sortFilter}>
                <Text style={styles.sortedBy}>Sorted by: {this.state.sortBy}</Text>
                <TouchableOpacity onPress={() => this._handleClearFilter()}>
                  <Text style={styles.filterBy}>{filter}</Text>
                </TouchableOpacity>
              </View>
            </View>
        );
        return header;
    }

    renderEmptyComponent() {
        return (
            <Text style={styles.emptyList}>No questions found.</Text>
        );
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
            <FlatList
                contentContainerStyle={styles.container}
                data={this.state.questions}
                extraData={this.state}
                refreshing={this.state.refreshing}
                onRefresh={() => { this._refreshData()}}
                ListEmptyComponent={this.renderEmptyComponent}
                ListHeaderComponent={this.renderHeader}
                renderItem={({item}) => <QuestionRow item={item} {...this.props}/>} />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 63,
        paddingBottom: 63,
        backgroundColor: 'transparent',
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
        fontSize: 16,
        color: '#333',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: '#0079fe'
    },
    sortFilter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
    },
    filterBy: {
        fontSize: 11,
        color: '#007aff',
    },
    sortedBy: {
        fontSize: 11,
        color: '#bbb',
    },
    emptyList: {
        marginTop: 20,
        textAlign: 'center',
        color: '#ccc',
        fontSize: 16,
    }
});

export default Home;
