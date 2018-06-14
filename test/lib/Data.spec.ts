import { expect } from 'chai';

import Data from '../../src/lib/Data'

describe('exports', () => {
    class ExData extends Data {
        testString: string = 'hello'
        testObject = {
            prop: 'value'
        }
    }
    let instance: ExData = null;
    beforeEach(() => {
        instance = new ExData();
    })
    it('should be able to set the value', () => {
        expect(instance.testString).to.equal('hello')
        instance.set({ testString: 'hi' })
        expect(instance.testString).to.equal('hi')
    })
    it('should trigger update on setting value', (callback) => {
        instance.on(() => {
            expect(instance.testString).to.equal('hi')
            callback()
        })
        instance.set({ testString: 'hi' })
    })
    it('should not trigger update on setting same value', (callback) => {
        expect(instance.testString).to.equal('hello')
        instance.on(fail)
        instance.set({ testString: 'hello' })
        setTimeout(callback, 2)//give a chance to execure callback
    })
    it('should able off the update callbanck', (callback) => {
        let expectingUpdate = true

        let updateCallback = () => {
            if (expectingUpdate) {
                expect(instance.testString).to.equal('hi')
                expectingUpdate = false
                instance.off(updateCallback)
                instance.set({ testString: 'hello' })
                setTimeout(callback, 2)
            } else {
                fail()
            }

        }
        //trying to remove callback isnt there
        instance.off(updateCallback)
        instance.on(updateCallback)
        expect(instance.testString).to.equal('hello')
        instance.set({ testString: 'hi' })
    })
    it('multiple set should trigger only one update',(callback)=>{
        let updateCallbackCount = 0;
        let updateCallback = ()=>{
            expect(instance.testString).to.equal(2)
            updateCallbackCount++;
        }
        instance.on(updateCallback)
        instance.set({testString:'1'})
        instance.set({testString:'2'})
        //TODO:following thee lines are for code coverage only
        let anotherInstance = new ExData()
        anotherInstance.on(()=>{})
        anotherInstance.set({testString:'3'})
        setTimeout(()=>{
            expect(updateCallbackCount).to.equal(1)
            callback()
        },2)
    })
})