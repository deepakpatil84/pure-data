import * as React from 'react'

import Data, { UpdateCallback } from './Data'

export type ReadonlyData<T> =
    T extends Function ? T :
    T extends Array<any> ? ReadonlyDataArray<T[any]> :
    T extends Object ? ReadonlyDataObject<T> :
    T;

interface ReadonlyDataArray<T> extends ReadonlyArray<ReadonlyData<T>> { }

type ReadonlyDataObject<T> = { readonly [P in keyof T]: ReadonlyData<T[P]> }

type IProp<P> = {
    parent: Component<Data>
    data: ReadonlyData<P>
    onUpdate?: ()=>void
};

export default abstract class Component<P extends Data, A = {}, S ={}> extends React.Component<A & IProp<P>, S>{

    private pureCompChilds: Component<P>[]
    private update: boolean = false

    constructor(props: A & IProp<P>, context?: any) {
        super(props, context)
        this.pureCompChilds = []
        if (this.props.parent) {
            this.props.parent.addChild(this)
        }
        if (this.props.data) {
            this.onDataUpdate = this.onDataUpdate.bind(this);
            this.props.data.on(this.onDataUpdate)
        }else{
            throw new Error('[PureData] PureData.Component data can not be null')
        }
    }

    componentDidUpdate() {
        this.update = false
    }

    shouldComponentUpdate(nextProps?: A & IProp<P>, nextState?: S, nextContext?: any) {
        return this.update
    }

    setState<K extends keyof S>(props: Pick<S, K>) {
        let needUpdate = false
        let state = this.state;
        for (let k in props) {
            if (state[k] !== props[k]) {
                (state as any)[k] = props[k]
                needUpdate = true
            }
        }


        if (needUpdate) {
            this.update = true
            if (this.props.parent) {
                this.props.parent.onChildUpdate()
            }
        }
        return this
    }

    onDataUpdate(data: ReadonlyData<P>): void {
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