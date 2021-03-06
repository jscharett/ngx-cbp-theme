import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CBP_USER_SERVICE, CBPUser, CBPUserService} from '../app/user/user';
import {
    CBPApplication, CBPApplicationsData,
    CBPApplicationsService
} from '../app/applications/cbp-applications-service';



@Injectable()
export class MockApplicationsService implements  CBPApplicationsService {



    private subject: BehaviorSubject<CBPApplicationsData> = new BehaviorSubject<CBPApplicationsData>(null);
    private loaded = false;

    constructor(@Inject(CBP_USER_SERVICE) private userService: CBPUserService) {}

    getApplicationsData(): Observable<CBPApplicationsData> {
        this._load();
        return this.subject;
    }

    refresh(): Observable<boolean> {
        this.loaded = false;
        this._load();
        return null;
    }
    search(token: string): Observable<CBPApplication[]> {
        return null;
    }

    removeFavoriteApplication(favoriteApplication: CBPApplication): Observable<boolean> {
        let data: CBPApplicationsData  = this.subject.getValue();
        return this._removeAppFromArray(favoriteApplication, data.favorites);
    }
    removeRecentApplication(recentApplication: CBPApplication): Observable<boolean> {
        let data: CBPApplicationsData  = this.subject.getValue();
        return this._removeAppFromArray(recentApplication, data.recents);
    }

    private _removeAppFromArray(app: CBPApplication, fromArray: CBPApplication[]): Observable<boolean> {
        let index = fromArray.indexOf(app);
        if (index >= 0) {
            fromArray.splice(index, 1);
        }
        return null;
    }
    private _load() {
        if (!this.loaded) {
            this.loaded = true;
            // simulates fetching some data
            setTimeout( () => {
                this._getData().subscribe({next: data => {
                    // next() few items then we send other items
                    this.subject.next(data);
                    // we enhance data from user later
                    this.userService.getUser().subscribe({ next: (user: CBPUser) => {
                        this.subject.next(this._applyUserToApplications(user, data));
                    }});
                }});
            }, 2000);
        }
    }
    private _getData(): Observable<CBPApplicationsData> {
        return this._getMockHttpData()
            .map((data: CBPApplicationsData) => {
                data.currentApp = new CBPApplication('Kitchen Sink v4.0.1.0', null);
                data.lastRetrieved = new Date();
                return data;
            });
    }

    private _getMockHttpData(): Observable<CBPApplicationsData> {
        let rawList: any[] = [];
        let count = 100;
        do {
            rawList.push({name: `App ${count}`, description: `Description ${count}`, href: `http://example.com/app-${count}`});
        } while (count-- >= 0);

        let data = new CBPApplicationsData();
        data.list = <CBPApplication[]> rawList;
        return Observable.of(data);

    }

    /**
     * Fakeology - it does not even use user object
     * @param {CBPUser} user
     * @param {CBPApplicationsData} data
     * @returns {CBPApplicationsData}
     * @private
     */
    private _applyUserToApplications(user: CBPUser, data: CBPApplicationsData): CBPApplicationsData {

        let applications = <CBPApplication[]> data.list;
        if (applications) {
            let random = 0;
            data.recents = [];
            data.favorites = [];
            // randomly assign few a favorites and some as recent
            random = this._randomIndex(0, applications.length / 10);
            data.recents.push(applications[random]);
            random = this._randomIndex(applications.length / 10, 2 * applications.length / 10);
            data.recents.push(applications[random]);

            random = this._randomIndex(2 * applications.length / 10, 3 * applications.length / 10);
            data.favorites.push(applications[random]);
            random = this._randomIndex(3 * applications.length / 10, 4 * applications.length / 10);
            data.favorites.push(applications[random]);
            random = this._randomIndex(4 * applications.length / 10, 5 * applications.length / 10);
            data.favorites.push(applications[random]);
        }
        return data;
    }
    private _randomIndex(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


}

