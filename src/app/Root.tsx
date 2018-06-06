import { AppData } from './App.data'
import App from './App'

import PureData from '../lib/PureData'
import * as React from 'react'
import { RowData } from './Row.data'
import Row from './Row'
let appData: AppData = new AppData();

appData.rows.push(new RowData().set({
    firstName: 'First Name',
    lastName: 'Last Name',
    index: 0
}))
for (let i = 0; i < 10; i++) {
    appData.rows.push(new RowData().set({
        firstName: 'First Name ' + i,
        lastName: 'Last Name ' + i,
        userName: 'user' + i,
        index: i
    }))
};

(window as any).appData = appData
export default class Root extends React.PureComponent {
    private waitingForMoreUpdates = false;
    constructor(props: any, context: any) {
        super(props, context)
        this.onDataUpdate = this.onDataUpdate.bind(this)
    }
    onDataUpdate() {
        if(this.waitingForMoreUpdates == false){
            this.waitingForMoreUpdates = true
            setTimeout(()=>{
                console.log('forceUpdate')
                this.forceUpdate()
                this.waitingForMoreUpdates = false
            },5)
        }else{
            console.log('skip update')
        }

    }
    render() {
        return <App parent={null} data={appData} onUpdate={this.onDataUpdate} />
    }
}