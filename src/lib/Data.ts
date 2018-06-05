import * as React from 'react'

namespace PureData {
    type UpdateCallback = () => void

    export class Data {

        private callbacks: UpdateCallback[]
        private modified: boolean
        constructor() {
            this.callbacks = []
            this.modified = false
        }
        on(callback: UpdateCallback) {
            this.callbacks.push(callback)
        }
        off(callback: UpdateCallback) {
            let index = this.callbacks.indexOf(callback)
            if (index >= 0) {
                this.callbacks.splice(index, 1)
            }
        }
        triggerUpdate() {
            for (let callback of this.callbacks) {
                callback()
            }
        }
        protected setModified(value: boolean) {
            if (value == true && this.modified == false) {
                Data.scheduleUpdate(this)
            }
            this.modified = value
        }

        private static waitingForSchedular: boolean = false
        private static updates: Data[] = []
        protected static scheduleUpdate(obj: Data) {
            Data.updates.push(obj)
            if (!Data.waitingForSchedular) {
                Data.waitingForSchedular = true
                setTimeout(function () {
                    //NOTE: no clear justication about why we are doing it in two phases
                    for (let obj of Data.updates) {
                        obj.triggerUpdate()
                    }
                    while (obj = Data.updates.shift()) {
                        obj.setModified(false)
                    }
                    Data.waitingForSchedular = false
                }, 0)
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
    export type ReadonlyData<T> = {
        readonly [P in keyof T]: T[P] extends Data ? ReadonlyData<T[P]> : T[P]
    };

    type IProp<P> = {
        parent: Component<Data>
        data: ReadonlyData<P>
        onUpdate?: UpdateCallback
    };

    export abstract class Component<P extends Data, A = {}> extends React.Component<A &  IProp<P>>{
        private pureCompChilds: Component<P>[]
        private update: boolean = false
        constructor(props: A & IProp<P>, context: any) {
            super(props, context)
            this.pureCompChilds = []
            if (this.props.parent) {
                this.props.parent.addChild(this)
            }
            if (this.props.data) {
                this.onDataUpdate = this.onDataUpdate.bind(this);
                //TODO: why we need any here
                (this.props.data as any).on(this.onDataUpdate)
            }
        }
        componentDidUpdate() {
            this.update = false
        }
        shouldComponentUpdate() {
            return this.update
        }
        onDataUpdate():void {
            if (!this.update) {
                this.update = true
                if (this.props.onUpdate) {
                    this.props.onUpdate()
                }
                if (this.props.parent) {
                    this.props.parent.onChildUpdate()
                }
            }
        }
        onChildUpdate() {
            if (!this.update) {
                this.update = true
                if (this.props.onUpdate) {
                    this.props.onUpdate()
                }
                if (this.props.parent) {
                    this.props.parent.onChildUpdate()
                }
            }
        }
        addChild(child: Component<P>) {
            this.pureCompChilds.push(child)
        }
        removeChild(child: Component<P>) {
            let index = this.pureCompChilds.indexOf(child)
            if (index >= 0) {
                this.pureCompChilds.splice(index, 1)
            }
        }
    }

    /// test
    class Info extends Data {
        url: string
    }
    class User extends Data {
        name: string
        sessionKey: string
        info: Info
    }


    class App extends Data {
        user: User
        loggin: boolean
        setLogin() {
            this.loggin = false;
        }
    }
    const i: ReadonlyData<App> = new App


}
export default PureData;