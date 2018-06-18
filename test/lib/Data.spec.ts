

import Data from '../../src/lib/Data'

describe('Data', () => {
    class ExData extends Data {
        testString: string = 'hello'
        testObject = {
            prop: 'value'
        }
    }
    let instance: ExData = null;
    beforeEach(() => {
        instance = new ExData();
        jest.useFakeTimers()
    })

    it('should be able to set the value', () => {
        expect(instance.testString).toEqual('hello')
        instance.set({ testString: 'hi' })
        expect(instance.testString).toEqual('hi')
    })

    it('should trigger update on setting value', () => {
        instance.on(() => {
            expect(instance.testString).toEqual('hi')
        })
        instance.set({ testString: 'hi' })
        jest.runAllTimers()
    })

    it('should not trigger update on setting same value', () => {
        expect(instance.testString).toEqual('hello')
        instance.on(fail)
        instance.set({ testString: 'hello' })
        jest.runAllTimers()
    })
    it('should able turn off the update callback', () => {
        let expectingUpdate = true

        let updateCallback = () => {
            if (expectingUpdate) {
                expect(instance.testString).toEqual('hi')
                expectingUpdate = false
                instance.off(updateCallback)
                instance.set({ testString: 'hello' })
                jest.runAllTimers()
            } else {
                fail()
            }
        }
        //trying to remove callback isnt there
        instance.off(updateCallback)
        instance.on(updateCallback)
        expect(instance.testString).toEqual('hello')
        instance.set({ testString: 'hi' })
        jest.runAllTimers()
    })
    it('multiple set for same value should trigger only one update',()=>{
        let updateCallbackCount = 0;
        let updateCallback = ()=>{
            expect(instance.testString).toEqual('2')
            updateCallbackCount++;
        }
        instance.on(updateCallback)
        instance.set({testString:'1'})
        instance.set({testString:'2'})
        //TODO:following thee lines are for code coverage only
        let anotherInstance = new ExData()
        anotherInstance.on(()=>{})
        anotherInstance.set({testString:'3'})
        jest.runAllTimers()
        expect(updateCallbackCount).toEqual(1)
    })
    it('should be able to set multiple callbacks',()=>{
        let counter = 0
        instance.on(()=>{
            counter++;
        })
        instance.on(()=>{
            counter++;
        })
        instance.set({testString:'4'})
        jest.runAllTimers()
        expect(counter).toEqual(2)
    })

})