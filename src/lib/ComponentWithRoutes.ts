import * as React from 'react'
import * as PropTypes from 'prop-types'
import Data  from './Data'
import Component  from './Component'

export interface IComponentWithRoutesState {
    routePath: string
}
export default abstract class ComponentWithRoutes<P extends Data, A = {}, S = {}> extends Component<P, A, S & IComponentWithRoutesState>{
    static contextTypes = {
        router: PropTypes.shape({
            route: PropTypes.object.isRequired
        })
    }

    constructor(props: any, context?: any) {
        super(props, context)
        if (!this.state) {
            (this as any).state = {}
        }
    }

    shouldComponentUpdate(nextProps: any, nextState: any, nextContext: any) {
        this.setState({ routePath: nextContext.router.route.location.pathname })
        return super.shouldComponentUpdate(nextProps, nextState, nextContext)
    }
}
