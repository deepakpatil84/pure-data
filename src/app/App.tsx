
import PureData from  '../lib/Data'
import {AppData} from './App.data'
import * as React from 'react'

import Row from './Row'
export default class App extends PureData.Component<AppData>{
    constructor(props:any,context:any){
        super(props,context)
    }
    render(){
        let data=this.props.data
        let oThis=this
        let rows: React.ReactNode[] = []
        for(let i=0;i<data.rows.length;i++){
            rows.push(<Row key={i} parent={oThis} data={data.rows[i]}/>)
        }
        return <div>
                <h1>{this.props.data.name}</h1>
                <table style={{border:'1px solid red'}} cellSpacing={20}>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
    }
}