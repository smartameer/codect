import {
    AsyncStorage
} from 'react-native';

import Base64 from 'base-64';
import yaml from 'js-yaml';


class API {
    constructor() {
        this.api_uri = 'https://api.github.com';
        this.base_path = '/repos/smartameer/codect-code/contents/';
        this.questions_uri = 'list.json';
        this.processRequest = this.processRequest.bind(this);
        this._updateTime = this._updateTime.bind(this);
        this.fetchQuestionsList = this.fetchQuestionsList.bind(this);
    }

    processRequest(api, headers = {}) {
        let requestHeaders = Object.assign({}, {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
        }, headers);
        return fetch(this.api_uri + this.base_path + api + '?ref=master', {
            method: 'GET',
            headers: requestHeaders
        });
    }

    _updateTime() {
        AsyncStorage.setItem('last_updated', new Date().getTime().toString());
    }

    fetchQuestionsList(force = false) {
        return new Promise((resolve, reject) => {
            this.processRequest(this.questions_uri)
                .then((resp) => {
                    AsyncStorage.setItem('requests_left', resp.headers.get('x-ratelimit-remaining').toString());
                    return resp.json();
                })
                .then(async (resp) => {
                    let response = resp;
                    if (response.message) {
                        return reject();
                    }

                    this._updateTime();
                    let sha = await AsyncStorage.getItem('last_fetched_sha');
                    if (!force && sha !== null && response.sha === sha) {
                        return resolve();
                    }
                    AsyncStorage.multiRemove(['questions', 'tags', 'languages']);
                    try {
                        let content = Base64.decode(response.content);
                        if (content.length > 0) {
                            let tags = {}, languages = {};
                            content = JSON.parse(content);
                            content.forEach((c) => {
                                c.key = Base64.encode(c.id);
                            });
                            AsyncStorage.setItem('questions', JSON.stringify(content));
                            AsyncStorage.setItem('last_fetched_sha', response.sha);

                            content.forEach(p => {
                                p.tags.forEach(t => {
                                    tags[t] = true;
                                });
                                p.languages.forEach(l => {
                                    languages[l] = true;
                                });
                            });

                            AsyncStorage.setItem('tags', JSON.stringify(Object.keys(tags)));
                            AsyncStorage.setItem('languages', JSON.stringify(Object.keys(languages)));
                        }
                        return resolve();
                    } catch (error) {
                        console.log(error);
                        return reject(error);
                    }
                }).catch(error => {
                    console.log(error);
                    return reject(error);
                });
        });
    }

    async fetchQuestionContent() {
        AsyncStorage.getItem('questions').then((questions) => {
            let list = JSON.parse(questions);
            list.sort((a, b) => { return a.id < b.id }).forEach(q => {
                this.processRequest(q.content)
                    .then((resp) => {
                        AsyncStorage.setItem('requests_left', resp.headers.get('x-ratelimit-remaining').toString());
                        return resp.json();
                    })
                    .then(async (resp) => {
                        try {
                            let content = Base64.decode(resp.content);
                            let jsonContent = yaml.safeLoad(content);
                            let stringifyContent = JSON.stringify(jsonContent);
                            AsyncStorage.setItem('question_id_' + q.id, stringifyContent);
                            AsyncStorage.setItem('question_id_' + q.id + '_last_sha', resp.sha);
                            this._updateTime();
                        } catch (error) {
                            console.log(error);
                        }
                    }).catch(error => {
                        console.log(error);
                    });
            });
        });
    }
}

export default API;
