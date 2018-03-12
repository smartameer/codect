import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    SegmentedControlIOS,
    AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import EM from '../API/Event';

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
                languages: [],
            },
            content: {},
            selectedIndex: 0,
        };
        this.renderLanguageList = this.renderLanguageList.bind(this);
        this._updateIndex = this._updateIndex.bind(this);
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

    _updateIndex(selectedIndex) {
        this.setState({selectedIndex})
    }

    renderLanguageList () {
        const languages = this.state.content.languages || [];
        const { selectedIndex } = this.state;

        return (
            <SegmentedControlIOS
                selectedIndex={selectedIndex}
                values={languages}
                onChange={(event) => {
                    this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
                }}
            />
        )
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, marginTop: 100}}>
                    <ActivityIndicator />
                </View>
            );
        }


        let currentCode = this.state.content.languages[this.state.selectedIndex];
        return (
            <View style={styles.container}>
                <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 10}} />
                <ScrollView style={styles.page}>
                    <Text style={styles.title}>{this.state.content.title}</Text>
                    <View style={styles.tags}>
                    <Icon name="ios-pricetags" size={18} style={styles.tagIcon}/>
                    {
                        this.state.content.tags.map((t, i) => {
                          return <Text style={styles.tag} key={i}>{t}</Text>
                        })
                    }
                    </View>
                    <Text style={styles.description}>{this.state.content.description}</Text>
                    { this.renderLanguageList() }
                    <View style={styles.codeContainer}>
                        <Text style={styles.code}>{this.state.content.code[currentCode]}</Text>
                    </View>
                    <Text style={styles.credits}>Credits: {this.state.content.author}</Text>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 63,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        alignSelf: 'flex-start',
    },
    page: {
        padding: 12,
        flex: 1,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
        paddingBottom: 8,
    },
    tagIcon: {
        color: '#007aff',
        marginRight: 8,
    },
    tag: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#007aff',
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 10,
        fontSize: 12,
        color: '#007aff',
        marginRight: 5,
    },
    description: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 16,
        paddingBottom: 8,
    },
    codeContainer: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#bbb',
        borderRadius: 4,
        backgroundColor: 'transparent',
        marginTop: 8,
        marginBottom: 20,
    },
    code: {
        color: '#434343',
        fontWeight: '600',
        paddingLeft: 12,
        paddingTop: 6,
        paddingBottom: 6,
        paddingRight: 6,
        fontSize: 14,
    },
    credits: {
        color: '#bbb',
        fontSize: 13,
        marginBottom: 30,
    },
});

export default Question;

