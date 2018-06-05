import AppData from './App.data'
import App from './App'

import PureData from  '../lib/Data'
import * as React from 'react'
import RowData from './Row.data'
import Row from './Row'
let appData = new AppData();
(window as any).appData = appData
export default class Root extends React.PureComponent{
    constructor(props:any,context:any){
        super(props,context)
        PureData.Data.globalUpdate = ()=>{
            console.log('Force Update')
            this.forceUpdate()
        }
    }
    render(){
        return <App parent={null} data={appData}/>
    }
}