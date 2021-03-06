import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {SettingModel} from '../../models/setting.model'
import {Storage} from '@ionic/storage';
import {Device} from '@ionic-native/device';
import {HttpProvider} from '../http/http';
import {URLSearchParams} from '@angular/http';
import {Platform} from "ionic-angular";
import {Http, Response} from '@angular/http';
import {Observable} from "rxjs/Rx";

declare var Wechat;
declare var WeiboSDK;
declare var QQSDK;


@Injectable()
export class UserProvider {

    constructor(public httpProvider: HttpProvider,
                private storage: Storage,
                private device: Device,
                private platform: Platform,
                private http: Http) {
    }

    login(user) {
        user.device = this.device;
        return this.httpProvider.httpPostNoAuth("/auth/login", user);
    }

    changePassword(data) {
        return this.httpProvider.httpPostWithAuth("/user/password/change", data);
    }

    doWechatLogin(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                var scope = "snsapi_userinfo",
                    state = "_" + (+new Date());

                Wechat.auth(scope, state, response => {
                    response.provider = 'wechat';
                    response.device = this.device;

                    this.httpProvider.httpPostNoAuth('/auth/third', response).then((data) => {
                        console.log(data);
                        resolve(data);
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                }, reason => {
                    reject(reason);
                });
            } else {
                reject("非cordova平台");
            }
        });
    }

    doQQLogin(): Promise<any> {

        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {

                var args = {
                    client: QQSDK.ClientType.QQ
                };

                QQSDK.ssoLogin(result => {

                    result.provider = 'qq';
                    result.device = this.device;

                    this.httpProvider.httpPostNoAuth('/auth/third', result).then((data) => {
                        console.log(data);
                        resolve(data);
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                }, err => {
                    reject(err);
                }, args);
            } else {
                reject("非cordova平台");
            }

        });
    }

    doWeiboLogin(): Promise<any> {

        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                WeiboSDK.ssoLogin(result => {

                    result.provider = 'weibo';
                    result.device = this.device;

                    this.httpProvider.httpPostNoAuth('/auth/third', result).then((data) => {
                        console.log(data);
                        resolve(data);
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                }, err => {
                    reject(err);
                });
            } else {
                reject("非cordova平台");
            }
        });
    }

    doWechatBind(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                var scope = "snsapi_userinfo",
                    state = "_" + (+new Date());

                Wechat.auth(scope, state, response => {
                    response.provider = 'wechat';
                    response.device = this.device;

                    this.httpProvider.httpPostWithAuth('/user/bind', response).then((data) => {
                        console.log(data);
                        resolve(data);
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                }, reason => {
                    reject(reason);
                });
            } else {
                reject("非cordova平台");
            }
        });
    }

    doQQBind(): Promise<any> {

        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {

                var args = {
                    client: QQSDK.ClientType.QQ
                };

                QQSDK.ssoLogin(result => {

                    result.provider = 'qq';
                    result.device = this.device;

                    this.httpProvider.httpPostWithAuth('/user/bind', result).then((data) => {
                        console.log(data);
                        resolve(data);
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                }, err => {
                    reject(err);
                }, args);
            } else {
                reject("非cordova平台");
            }

        });
    }

    doWeiboBind(): Promise<any> {

        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                WeiboSDK.ssoLogin(result => {

                    result.provider = 'qq';
                    result.device = this.device;

                    this.httpProvider.httpPostWithAuth('/user/bind', result).then((data) => {
                        console.log(data);
                        resolve(data);
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                }, err => {
                    reject(err);
                });
            } else {
                reject("非cordova平台");
            }
        });
    }


    // checkWechatInstalled():Promise<any> {
    //   return new Promise<any>((resolve, reject) => {
    //
    //     if(this.platform.is('cordova')) {
    //       Wechat.isInstalled(function (installed) {
    //         resolve(true);
    //       }, function (reason) {
    //         reject(reason);
    //       });
    //     } else {
    //       reject("非cordova平台");
    //     }
    //   });
    // }

    checkQQInstalled(): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            if (this.platform.is('cordova')) {
                var args = {
                    client: QQSDK.ClientType.QQ
                }
                QQSDK.checkClientInstalled(function () {
                    resolve(true);
                }, function (reason) {
                    reject(reason);
                }, args);
            } else {
                reject("非cordova平台");
            }
        });

    }

    register(user) {
        user.device = this.device;
        return this.httpProvider.httpPostNoAuth("/auth/register", user);
    }

    find(user) {
        user.device = this.device;
        return this.httpProvider.httpPostNoAuth("/auth/find", user);
    }

    getUser(id) {
        return this.httpProvider.httpGetWithAuth("/user/" + id, null);
    }

    getCode(account, type) {
        let param = {
            account: account,
            type: type
        };

        let body = JSON.stringify(param);

        return this.httpProvider.httpPostNoAuth("/auth/code", body);
    }


    follow(id) {
        return this.httpProvider.httpPutWithAuth("/user/follow/" + id, null).then(value => {
            return value;
        }).catch(e => {
            console.log(e)
        });
    }

    unFollow(id) {
        return this.httpProvider.httpDeleteWithAuth("/user/follow/" + id).then(value => {
            return value;
        }).catch(e => {
            console.log(e)
        });
    }

    getGoals(data) {
        var params = new URLSearchParams();
        params.set('day', data);
        return this.httpProvider.httpGetWithAuth("/user/goals", params);
    }

    getGoal(id) {
        return this.httpProvider.httpGetWithAuth("/user/goal/" + id, null);
    }

    getGoalDay(id, day) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('day', day);
        return this.httpProvider.httpGetWithAuth("/user/goal/" + id + "/day", params);
    }

    getGoalWeek(id) {
        return this.httpProvider.httpGetWithAuth("/user/goal/" + id + "/week", null);
    }

    getGoalCalendar(id) {
        return this.httpProvider.httpGetWithAuth("/user/goal/" + id + "/calendar", null);
    }

    deleteGoal(id) {
        return this.httpProvider.httpDeleteWithAuth("/user/goal/" + id).then(value => {
            return value;
        }).catch(e => {
            console.log(e)
        });
    }

    checkinGoal(id, body) {
        return this.httpProvider.httpPostWithAuth("/user/goal/" + id + "/checkin", body).then(value => {
            return value;
        }).catch(e => {
            console.log(e)
        });
    }

    getGoalEvents(id, page, per_page) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('page', page);
        params.set('per_page', per_page);
        return this.httpProvider.httpGetWithAuth("/user/goal/" + id + "/events", params);
    }

    getGoalChart(id, mode, day) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('mode', mode);
        params.set('day', day);
        return this.httpProvider.httpGetWithAuth("/user/goal/" + id + "/chart", params);
    }

    getGoalsCalendar(start_date, end_date) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('start_date', start_date);
        params.set('end_date', end_date);
        return this.httpProvider.httpGetWithAuth("/user/goals/calendar", params);
    }

    updateGoal(id, body) {
        return this.httpProvider.httpPatchWithAuth("/user/goal/" + id, body);
    }

    getSetting() {
        return this.storage.get('setting');
    }

    getDefaultSetting(): SettingModel {

        var d = <SettingModel> {
            viewMode: "list",
            calendarMode: "week"
        };

        return d;
    }

    updateSetting(data: SettingModel) {
        this.storage.set('setting', data);
    }

    getFanMessages(page, perPage) {
        var params = new URLSearchParams();
        params.set('page', page);
        params.set('per_page', perPage);
        return this.httpProvider.httpGetWithAuth("/user/messages/fan", params);
    }

    getCommentMessages(page, perPage) {
        var params = new URLSearchParams();
        params.set('page', page);
        params.set('per_page', perPage);
        return this.httpProvider.httpGetWithAuth("/user/messages/comment", params);
    }

    getLikeMessages(page, perPage) {
        var params = new URLSearchParams();
        params.set('page', page);
        params.set('per_page', perPage);
        return this.httpProvider.httpGetWithAuth("/user/messages/like", params);
    }

}
