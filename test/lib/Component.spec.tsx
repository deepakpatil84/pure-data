


import * as React from 'react'
import { shallow, mount, render } from 'enzyme'

import Component from '../../src/lib/Component'
import Data from '../../src/lib/Data'



describe('Component', () => {
    let data: ParentData = null
    class ChildData extends Data {
        name: string = 'PureData'
    }
    class ParentData extends Data {
        child: ChildData
        showChild: boolean
        constructor() {
            super()
            this.showChild = true
            this.child = new ChildData()
        }
    }
    class ParentComp extends Component<ParentData>{
        constructor(props:any,context:any){
            super(props,context)
            this.onUpdate = this.onUpdate.bind(this)
        }
        onUpdate(){

        }
        render() {
            if (this.props.data.showChild) {
                return <ChildComp parent={this} data={this.props.data.child} onUpdate={this.onUpdate} />
            } else {
                return <div />
            }

        }
    }
    interface ChildState{
        endsWithA: boolean
    }
    class ChildComp extends Component<ChildData,{},ChildState>{
        constructor(props:any,context:any){
            super(props,context)
            this.state = {
                endsWithA: this.props.data.name.endsWith('A') || this.props.data.name.endsWith('a')
            }
        }
        onDataUpdate(data:ChildData){
            this.setState({
                endsWithA:this.props.data.name.endsWith('A') || this.props.data.name.endsWith('a')
            })
            super.onDataUpdate(data)
        }
        render() {
            return <div>
                    <div>{this.props.data.name}</div>
                    <div>endsWithA:{this.state.endsWithA ? 'yes' : 'no'}</div>
                </div>
        }
    }
    class Root extends React.Component {
        public data: ParentData;
        constructor(props: any, context?: any) {
            super(props, context)
            this.onUpdate = this.onUpdate.bind(this)
            this.data = new ParentData()
            data = this.data;
        }
        onUpdate() {
            this.forceUpdate()
        }
        render() {
            return <ParentComp parent={null} data={this.data} onUpdate={this.onUpdate} />
        }
    }
    class NullDataComp extends React.Component {
        render() {
            return <ChildComp parent={null} data={null} />
        }
    }



    beforeEach(()=>{
        jest.useFakeTimers()
    })
    it('should call onUpdate', () => {

        let onUpdateSpy = jest.spyOn(Root.prototype, 'onUpdate')
        let wrapper = mount(<Root />)
        expect(wrapper.contains(<div>PureData</div>)).toBeTruthy()
        jest.runAllTimers()
        data.child.set({ name: '1' })
        jest.runAllTimers()
        expect(onUpdateSpy).toHaveBeenCalledTimes(2)
        data.child.set({ name: '2' })
        jest.runAllTimers()
        expect(onUpdateSpy).toHaveBeenCalledTimes(3)
        data.child.set({ name: '3' })
        jest.runAllTimers()
        expect(onUpdateSpy).toHaveBeenCalledTimes(4)
        onUpdateSpy.mockReset()
        onUpdateSpy.mockRestore()

    })
    //TODO:disabling it as it clutters the console
    xit('should throw error if data is null', () => {
        expect(() => {
            let errorSpy = jest.spyOn(console, 'error')
            mount(<NullDataComp />)
        }).toThrow(/PureData.Component data can not be null/)

    })

    it('should remove the child', () => {
        let wrapper = mount(<Root />)
        expect(wrapper.contains(<div>PureData</div>)).toBeTruthy()
        data.set({showChild:false})
        jest.runAllTimers()
        wrapper.update()
        expect(wrapper.contains(<div>PureData</div>)).toBeFalsy()
    })

    it('setState should call onUpdate', () => {

        let wrapper = mount(<Root />)
        expect(wrapper.contains(<div>endsWithA:{'yes'}</div>)).toBeTruthy()
        data.child.set({ name: 'Hello' })
        jest.runAllTimers()
        wrapper.update()
        expect(wrapper.contains(<div>endsWithA:{'no'}</div>)).toBeTruthy()

    })

})