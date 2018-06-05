
import PureData from  '../lib/Data'
import RowData from './Row.data'
import * as React from 'react'
export default class Row extends PureData.Component<RowData>{
    constructor(props:any,context:any){
        super(props,context)
    }
    render(){
        const row=this.props.data;
        return <tr>
            <td>{row.index}</td>
            <td>{row.firstName}</td>
            <td>{row.lastName}</td>
            <td>{row.email}</td>
            <td>{row.userName}</td>
        </tr>
    }
}