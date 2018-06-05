
import PureData from  '../lib/Data'
import {RowData} from './Row.data'
import * as React from 'react'
export default class Row extends PureData.Component<RowData>{
    private name: string
    constructor(props:any,context:any){
        super(props,context)
        this.name = this.props.data.firstName + ' ' + this.props.data.lastName
    }
    onDataUpdate(){
        this.name = this.props.data.firstName + ' ' + this.props.data.lastName
        super.onDataUpdate()
    }
    render(){
        const row=this.props.data;
        return <tr>
            <td>{this.name}</td>
            <td>{row.index}</td>
            <td>{row.firstName}</td>
            <td>{row.lastName}</td>
            <td>{row.email}</td>
            <td>{row.userName}</td>
        </tr>
    }
}