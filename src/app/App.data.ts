import PureData from '../lib/PureData'
import {RowData} from './Row.data'
export class AppData extends PureData.Data {
    name: String = 'Default'
    rows: RowData[] = []
}