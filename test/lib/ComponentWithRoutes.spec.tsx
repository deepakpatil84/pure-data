


import * as React from 'react'
import { MemoryRouter } from 'react-router'
import * as PropTypes from 'prop-types'
import {History} from 'history'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom';
import { shallow, mount, render } from 'enzyme'

import ComponentWithRoutes from '../../src/lib/ComponentWithRoutes'
import Component from '../../src/lib/Component'
import Data from '../../src/lib/Data'



describe('ComponentWithRoutes', () => {
    let historyRef:History;
    class CompData extends Data {
        testString: string = 'TEST'
    }
    let data: CompData = null;

    class Root extends React.Component {
        static contextTypes = {
            router: PropTypes.object
        }
        public data: CompData;
        constructor(props: any, context?: any) {
            super(props, context)
            this.onUpdate = this.onUpdate.bind(this)
            this.data = new CompData()
            data = this.data;
            historyRef = this.context.router.history;
        }
        onUpdate() {
            this.forceUpdate()
        }
        render() {
            return <App parent={null} data={this.data} onUpdate={this.onUpdate} />
        }
    }
    class App extends ComponentWithRoutes<CompData>{
        static contextTypes = {
            router: PropTypes.object
        }
        constructor(props:any,context?:any){
            super(props,context)
        }

        render() {
            let url = this.context.router.route.match.url;
            return <div>
                <a>{url}</a>
                <Switch>
                    <Route exact path="/" render={() => {
                        return <Route1 parent={this} data={this.props.data} />
                    }} />
                    <Route path="/route2" render={() => {
                        return <Route2 parent={this} data={this.props.data} />
                    }} />
                </Switch>
            </div>
        }
    }
    class Route1 extends Component<CompData> {
        render() {
            return <div>Route1:{this.props.data.testString}</div>
        }
    }
    class Route2 extends Component<CompData> {
        render() {
            return <div>Route2:{this.props.data.testString}</div>
        }
    }

    beforeEach(() => {
        jest.useFakeTimers()
    })
    it('should account for routPath', () => {
        let wrapper = mount(<MemoryRouter initialEntries={['/','/route2']} initialIndex={0}>
            <Root />
        </MemoryRouter>)

        expect(wrapper.contains(<div>Route1:{'TEST'}</div>)).toBeTruthy()
        expect(wrapper.find(Route1)).toHaveLength(1)
        expect(wrapper.find(Route2)).toHaveLength(0)
        historyRef.push('/route2')
        jest.runAllTimers()
        wrapper.update()
        expect(wrapper.contains(<div>Route2:{'TEST'}</div>)).toBeTruthy()

    })


})