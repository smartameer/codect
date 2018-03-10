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
            isLoading: true
        };
        this.renderHeader = this.renderHeader.bind(this);
        this._onSearchProblem = this._onSearchProblem.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem('problems').then((list) => {
            this.setState({
                isLoading: false,
                problems: JSON.parse(list)
            });
        }).done();
    }

    _onSearchProblem(pattern) {
        AsyncStorage.getItem('problems').then((response) => {
            let problems = JSON.parse(response);
            let list = problems.filter(p => {
                return p.title.toLowerCase().indexOf(pattern.toLowerCase()) > -1;
            });
            this.setState({
                problems: list
            });
        }).done();
    }

    renderHeader() {
        let header = (
            <View style={styles.header}>
              <Text style={styles.title}>Problems</Text>
              <SearchBar autoCapitalize='none' lightTheme platform={'ios'} inputStyle={styles.searchInput} containerStyle={styles.searchContainer} placeholder='Search' onChangeText={this._onSearchProblem} />
            </View>
        );
        return header;
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
              <FlatList data={this.state.problems} ListHeaderComponent={this.renderHeader} renderItem={({item}, index) => <ProblemRow key={index} item={item} {...this.props}/>} />
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
    }
});

export default Home;
