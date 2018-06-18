
import * as React from 'react'
import { ReadonlyData } from './Component';

export type UpdateCallback<T> = (data: T) => void
class DataManager {
    static waitingForSchedular: boolean = false
    static updates: Data[] = []
    static scheduleUpdate(obj: Data) {
        DataManager.updates.push(obj)
        if (!DataManager.waitingForSchedular) {
            DataManager.waitingForSchedular = true
            let currentUpdates = DataManager.updates.slice()
            DataManager.updates.length = 0
            setTimeout(function () {
                for (let obj of currentUpdates) {
                    obj.setModified(false)
                    obj.triggerUpdate()
                }
                DataManager.waitingForSchedular = false
            }, 0)
        }
    }
}
export default abstract class Data {

    private _callbacks: UpdateCallback<ReadonlyData<this>>[]
    private _modified: boolean
    constructor() {
        this._callbacks = []
        this._modified = false
    }
    on(callback: UpdateCallback<ReadonlyData<this>>) {
        this._callbacks.push(callback)
    }

    off(callback: UpdateCallback<ReadonlyData<this>>) {
        let index = this._callbacks.indexOf(callback)
        if (index >= 0) {
            this._callbacks.splice(index, 1)
        }
    }

    triggerUpdate() {
        for (let callback of this._callbacks) {
            callback(this as ReadonlyData<this>)
        }
    }

    setModified(value: boolean) {
        if (this._callbacks.length > 0) {
            if (value === true && this._modified === false) {
                DataManager.scheduleUpdate(this)
            }
            this._modified = value
        }
    }

    set<K extends keyof this>(props: Pick<this, K>): this {
        let modified = false
        for (let k in props) {
            if (this[k] !== props[k]) {
                this[k] = props[k]
                modified = true
            }
        }
        modified && this.setModified(true)
        return this
    }

}
