import { expect } from 'chai';

import {Data,Component,ComponentWithRoutes} from '../src/index'

describe('index',()=>{
    it('should export classes',()=>{
        expect(Data).to.be.not.undefined
        expect(Component).to.not.undefined
        expect(ComponentWithRoutes).to.not.undefined
    })
})