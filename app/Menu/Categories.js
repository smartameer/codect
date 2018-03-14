import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    TabBarIOS,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Tags from './Tags';
import Languages from './Languages';

class Categories extends Component {
    static propTypes = {
        title: PropTypes.string,
        navigator: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props);
        this.state = {
            selectedTab: 'languages',
        };
        this._onSelectTab = this._onSelectTab.bind(this);
    }

    componentDidMount() {
        Icon.getImageSource('ios-pricetags-outline', 24).then((source) => this.setState({ tagIcon: source }));
        Icon.getImageSource('ios-analytics-outline', 24).then((source) => this.setState({ languageIcon: source }));
        Icon.getImageSource('ios-pricetags', 24).then((source) => this.setState({ selectedTagIcon: source }));
        Icon.getImageSource('ios-analytics', 24).then((source) => this.setState({ selectedLanguageIcon: source }));
    }

    _onSelectTab(type) {
        this.setState({ selectedTab: type });
    }

    render() {
        if (!this.state.tagIcon || !this.state.languageIcon || !this.state.selectedTagIcon || !this.state.selectedLanguageIcon) {
            return false;
        }
        return (
            <TabBarIOS selectedTab={this.state.selectedTab}>
              <TabBarIOS.Item title="Languages" selected={this.state.selectedTab === 'languages'} selectedIcon={this.state.selectedLanguageIcon} icon={this.state.languageIcon} onPress={() => { this._onSelectTab('languages') }}>
                <Languages {...this.props}/>
              </TabBarIOS.Item>
              <TabBarIOS.Item title="Tags" selected={this.state.selectedTab === 'tags'} selectedIcon={this.state.selectedTagIcon} icon={this.state.tagIcon} onPress={() => { this._onSelectTab('tags') }}>
                <Tags {...this.props}/>
              </TabBarIOS.Item>
            </TabBarIOS>
        );
    }
}

export default Categories;

