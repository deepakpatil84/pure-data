import PureData from  '../lib/Data'
import RowData from './Row.data'
export default class AppData extends PureData.Data{
    name: String = 'Default'
    rows: RowData[]
    constructor(){
        super()
        this.rows = [];
        for(let i=0;i<10;i++){
            let r=new RowData().set({
                firstName:'First Name 1',
                lastName:'Last Name 1',
                index: i
            })
            this.rows.push(r)
        }
    }
}