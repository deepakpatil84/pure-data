
import * as React from 'react'

export type UpdateCallback = () => void
class DataManager{
    static waitingForSchedular: boolean = false
    static updates: Data[] = []
    static scheduleUpdate(obj: Data) {
        DataManager.updates.push(obj)
        if (!DataManager.waitingForSchedular) {
            DataManager.waitingForSchedular = true
            setTimeout(function () {
                //NOTE: no clear justication about why we are doing it in two phases
                for (let obj of DataManager.updates) {
                    obj.triggerUpdate()
                }
                while (obj = DataManager.updates.shift()) {
                    obj.setModified(false)
                }
                DataManager.waitingForSchedular = false
            }, 0)
        }
    }
}
export class Data {

    private _callbacks: UpdateCallback[]
    private _modified: boolean
    constructor() {
        this._callbacks = []
        this._modified = false
    }
    on(callback: UpdateCallback) {
        this._callbacks.push(callback)
    }
    off(callback: UpdateCallback) {
        let index = this._callbacks.indexOf(callback)
        if (index >= 0) {
            this._callbacks.splice(index, 1)
        }
    }
    triggerUpdate() {
        for (let callback of this._callbacks) {
            callback()
        }
    }
    setModified(value: boolean) {
        if (value === true && this._modified === false) {
            DataManager.scheduleUpdate(this)
        }
        this._modified = value
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
