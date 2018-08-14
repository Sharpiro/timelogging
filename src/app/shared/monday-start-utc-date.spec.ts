import * as assert from 'assert'
import { MondayStartDate } from './monday-start-utc-date';

describe('MondayStartUTCDate', () => {
    describe('getDay', () => {
        it('1', () => {
            const date = new MondayStartDate(2018, 7, 13, 0, 0, 0, 0)
            assert.equal(date.dayOfTheWeek, 0)
        })
        it('2', () => {
            const date = new MondayStartDate(2018, 7, 13, 23, 59, 59, 999)
            assert.equal(date.dayOfTheWeek, 0)
        })
        it('3', () => {
            const date = new MondayStartDate(2018, 7, 17, 0, 0, 0, 0)
            assert.equal(date.dayOfTheWeek, 4)
        })
        it('4', () => {
            const date = new MondayStartDate(2018, 7, 19, 23, 59, 59, 999)
            assert.equal(date.dayOfTheWeek, 6)
        })
    })
    describe('weekStart', () => {
        it('1', () => {
            const date = new MondayStartDate(2018, 7, 13, 0, 0, 0, 0)
            assert.equal(date.weekStart.isoString, "2018-08-13T04:00:00.000Z")
        })
        it('2', () => {
            const date = new MondayStartDate(2018, 7, 13, 23, 59, 59, 999)
            assert.equal(date.weekStart.isoString, "2018-08-13T04:00:00.000Z")
        })
        it('3', () => {
            const date = new MondayStartDate(2018, 7, 17, 0, 0, 0, 0)
            assert.equal(date.weekStart.isoString, "2018-08-13T04:00:00.000Z")
        })
        it('4', () => {
            const date = new MondayStartDate(2018, 7, 19, 23, 59, 59, 999)
            assert.equal(date.weekStart.isoString, "2018-08-13T04:00:00.000Z")
        })
    })
    describe('weekEnd', () => {
        it('1', () => {
            const date = new MondayStartDate(2018, 7, 13, 0, 0, 0, 0)
            assert.equal(date.weekEnd.isoString, "2018-08-20T03:59:59.999Z")
        })
        it('2', () => {
            const date = new MondayStartDate(2018, 7, 13, 23, 59, 59, 999)
            assert.equal(date.weekEnd.isoString, "2018-08-20T03:59:59.999Z")
        })
        it('3', () => {
            const date = new MondayStartDate(2018, 7, 17, 0, 0, 0, 0)
            assert.equal(date.weekEnd.isoString, "2018-08-20T03:59:59.999Z")
        })
        it('4', () => {
            const date = new MondayStartDate(2018, 7, 19, 23, 59, 59, 999)
            assert.equal(date.weekEnd.isoString, "2018-08-20T03:59:59.999Z")
        })
        it('5', () => {
            const date = new MondayStartDate(2018, 7, 19, 0, 0, 0, 0)
            assert.equal(date.weekEnd.isoString, "2018-08-20T03:59:59.999Z")
        })
    })
})
