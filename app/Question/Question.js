import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    AsyncStorage
} from 'react-native';
import {Divider} from 'react-native-elements';
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
                language: [],
            },
            content: {},
        };
    }

    componentDidMount() {
        this.setState({
            item: this.props.item,
        }, () => {
            AsyncStorage.getItem('question_id_'+ this.state.item.id).then((resp) => {
                this.setState({
                    content: JSON.parse(resp),
                    isLoading: false,
                });
            });
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
              <Text style={styles.title}>{this.state.content.title}</Text>
              <Divider style={{ backgroundColor: '#007aff', height: 0.5 }} />
              <Text style={styles.description}>{this.state.content.description}</Text>
              <Divider style={{ backgroundColor: '#bbb', height: 0.5 }} />
              <View style={styles.codeContainer}>
              {
                  this.state.content.languages.map((l, i) => {
                      return (<View key={i} style={styles.codeWrapper}>
                          <View style={styles.langHeader}>
                              <Text>Language: </Text>
                              <View style={styles[l.toLowerCase()]}>
                                  <Text style={styles.language}>{l}</Text>
                              </View>
                          </View>
                          <Text style={styles.code}>{this.state.content.code[l]}</Text>
                      </View>)
                  })
              }
              </View>
              <Divider style={{ backgroundColor: '#bbb', height: 0.5 }} />
              <View style={styles.tags}>
              {
                  this.state.content.tags.map((t, i) => {
                    return <Text style={styles.tag} key={i}>{t}</Text>
                  })
              }
              </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 63,
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        padding: 8,
    },
    description: {
        padding: 8,
        fontSize: 16,
    },
    tags: {
        marginTop: 8,
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
    codeContainer: {
        marginTop: 3,
        flex: 1,
    },
    codeWrapper: {
        marginTop: 3,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#fefefe',
    },
    langHeader: {
        paddingLeft: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    javascript: { backgroundColor: 'rgb(244, 218, 26)', borderRadius: 3, marginRight: 3, },
    php: { backgroundColor: 'rgb(98, 101, 163)', borderRadius: 3, marginRight: 3, },
    python: { backgroundColor: 'rgb(41, 85, 130)', borderRadius: 3, marginRight: 3, },
    java: { backgroundColor: 'rgb(223, 91, 8)', borderRadius: 3, marginRight: 3, },
    c: { backgroundColor: 'rgb(18, 142, 224)', borderRadius: 3, marginRight: 3, },
    ruby: { backgroundColor: 'rgb(158, 0, 4)', borderRadius: 3, marginRight: 3, },
    'c++': { backgroundColor: 'rgb(82, 134, 200)', borderRadius: 3, marginRight: 3, },
    language: {
        paddingRight: 6,
        paddingLeft: 6,
        paddingTop: 4,
        paddingBottom: 4,
        fontSize: 13,
        fontWeight: "600",
    },
    code: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#efefef',
        color: '#282828',
        paddingTop: 8,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 8,
        borderRadius: 4,
    }
});

export default Question;

