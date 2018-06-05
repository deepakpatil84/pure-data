import PureData from '../lib/Data'
import {RowData} from './Row.data'
export class AppData extends PureData.Data {
    name: String = 'Default'
    rows: RowData[]
    constructor() {
        super()
        this.rows = [];
        this.rows.push(new RowData().set({
            firstName: 'First Name',
            lastName: 'Last Name',
            index: 0
        }))
        for (let i = 0; i < 10; i++) {
            this.rows.push(new RowData().set({
                firstName: 'First Name ' + i,
                lastName: 'Last Name ' + i,
                userName: 'user' + i,
                index: i
            }))
        }
    }
}