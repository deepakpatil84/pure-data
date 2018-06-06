
import PureData from  '../lib/PureData'
import {RowData} from './Row.data'
import * as React from 'react'
interface IState{
    name :string
}
export default class Row extends PureData.Component<RowData,{},IState>{
    constructor(props:any,context:any){
        super(props,context)
        this.state = {
            name: this.props.data.firstName + ' ' + this.props.data.lastName
        }
        setInterval(()=>{
            this.setState({
                name:'aa'+Math.random()
            })
        },2000)
    }
    onDataUpdate(){
        super.onDataUpdate()
    }
    render(){
        const row=this.props.data;
        return <tr>
            <td>{this.state.name}</td>
            <td>{row.index}</td>
            <td>{row.firstName}</td>
            <td>{row.lastName}</td>
            <td>{row.email}</td>
            <td>{row.userName}</td>
        </tr>
    }
}