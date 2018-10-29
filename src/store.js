import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import fastXmlParser from 'fast-xml-parser'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        po: {},
        poConfirmation: [],
        poHistoryTotal: [],
        itemList: [],
        inspectionCharacteristics: [
            {
                mstr_char: '50000000',
                description: 'SERVICEABILITY AUTHORITY',
                options: [
                    { code: 'DGCA', description: 'DGCA approved part' },
                    { code: 'EASA', description: 'EASA approved part' },
                    { code: 'FAA', description: 'FAA approved part' }
                ]
            },
            {
                mstr_char: '50000001',
                description: 'SEC SERVICEABLE AUTHORITY 1',
                options: [
                    { code: 'DGCA', description: 'DGCA approved part' },
                    { code: 'EASA', description: 'EASA approved part' },
                    { code: 'FAA', description: 'FAA approved part' },
                    { code: '0002', description: 'Not Applicable' }
                ]
            },
            {
                mstr_char: '50000002',
                description: 'SEC SERVICEABLE AUTHORITY 2',
                options: [
                    { code: 'DGCA', description: 'DGCA approved part' },
                    { code: 'EASA', description: 'EASA approved part' },
                    { code: 'FAA', description: 'FAA approved part' },
                    { code: '0002', description: 'Not Applicable' }
                ]
            },
            {
                mstr_char: '50000003',
                description: 'SERVICEABILITY STATUS',
                options: [
                    { code: 'SERV', description: 'Serviceable' },
                    { code: 'STAC', description: 'STAC' },
                    { code: 'UNSV', description: 'Unserviceable' }
                ]
            },
            {
                mstr_char: '50000004',
                description: 'General Document - Invoice',
                options: [
                    { code: 'GD01', description: 'INVOICE AVAILABLE (ACCEPTED)' },
                    { code: 'GD02', description: 'INVOICE NOT AVAILABLE (ACCEPTED)' },
                    { code: 'GD1A', description: 'INVOICE AVAILABLE (REJECTED)' },
                    { code: 'GD2A', description: 'INVOICE NOT AVAILABLE (REJECTED)' }
                ]
            },
            {
                mstr_char: '50000005',
                description: 'General Document - Airway Bill',
                options: [
                    { code: 'GD03', description: 'AIRWAYBILL AVAILABLE (ACCEPTED)' },
                    { code: 'GD04', description: 'AIRWAYBILL NOT AVAILABLE (ACCEPTED)' },
                    { code: 'GD3A', description: 'AIRWAYBILL AVAILABLE (REJECTED)' },
                    { code: 'GD4A', description: 'AIRWAYBILL NOT AVAILABLE (REJECTED)' }
                ]
            },
            {
                mstr_char: '50000006',
                description: 'General Document - Shipping Document',
                options: [
                    { code: '', description: 'SHIPPNG DOCUMENT AVAILABLE (ACCEPTED)' },
                    { code: '', description: 'SHIPPNG DOCUMENT NOT AVAILABLE (ACCEPT)' },
                    { code: '', description: 'SHIPPNG DOCUMENT AVAILABLE (REJECTED)' },
                    { code: '', description: 'SHIPPNG DOCUMENT NOT AVAILABLE(REJECT)' }
                ]
            },
            {
                mstr_char: '50000007',
                description: 'Certificate of Conformity',
                options: [
                    { code: 'CC01', description: 'CERTIFICATE OF CONFORMITY AVAILABLE(ACC)' },
                    { code: 'CC02', description: 'CERTIFICATE OF CONFORMITY NOT AVAIL(ACC)' },
                    { code: 'CC1A', description: 'CERTIFICATE OF CONFORMITY AVAILABLE(REJ)' },
                    { code: 'CC2A', description: 'CERTIFICATE OF CONFORMITY NOT AVAIL(REJ)' }
                ]
            },
            {
                mstr_char: '50000008',
                description: 'Calibration Certificate',
                options: [
                    { code: 'CL01', description: 'CALIBRATION CERTIFICATE AVAILABLE(ACCEP)' },
                    { code: 'CL02', description: 'CALIBRATION CERTIFICATE NOT AVAIL(ACCEP)' },
                    { code: 'CL1A', description: 'CALIBRATION CERTIFICATE AVAILABLE(REJEC)' },
                    { code: 'CL2A', description: 'CALIBRATION CERTIFICATE NOT AVAIL(REJEC)' }
                ]
            },
            {
                mstr_char: '50000009',
                description: 'Servicable Tag',
                options: [
                    { code: 'ST01', description: 'SERVICABLE TAG AVAILABLE (ACCEPTED)' },
                    { code: 'ST02', description: 'SERVICABLE TAG NOT AVAILABLE (ACCEPTED)' },
                    { code: 'ST1A', description: 'SERVICABLE TAG AVAILABLE (REJECTED)' },
                    { code: 'ST2A', description: 'SERVICABLE TAG NOT AVAILABLE (REJECTED)' }
                ]
            },
            {
                mstr_char: '50000010',
                description: 'Test Certificate',
                options: [
                    { code: 'TC01', description: 'TEST CERTIFICATE AVAILABLE (ACCEPTED)' },
                    { code: 'TC02', description: 'TEST CERTIFICATE NOT AVAILABLE (ACCEPT)' },
                    { code: 'TC1A', description: 'TEST CERTIFICATE AVAILABLE (REJECTED)' },
                    { code: 'TC2A', description: 'TEST CERTIFICATE NOT AVAILABLE(REJECTED)' }
                ]
            },
            {
                mstr_char: '50000011',
                description: 'Technical Data & Document',
                options: [
                    { code: '0001', description: 'ACCEPTABLE' },
                    { code: '9900', description: 'OTHER EXPLANATION FOR REJECTION' },
                    { code: 'TD01', description: 'DOCUMENT NOT RECEIVED' },
                    { code: 'TD02', description: 'DOCUMENT NOT COMPLETE' },
                    { code: 'TD03', description: 'DOCUMENT NOT APPLICABLE' },
                    { code: 'TD04', description: 'DOCUMENT ILLEGIBLE OR MUTILATED' }
                ]
            },
            {
                mstr_char: '50000012',
                description: 'Packaging Type',
                options: [
                    { code: 'PT01', description: 'REUSABLE CONTAINER USED' },
                    { code: 'PT02', description: 'WOODEN BOX USED' },
                    { code: 'PT03', description: 'CARTON BOX USED' },
                    { code: 'PT04', description: 'UNPACKAGE' }
                ]
            },
            {
                mstr_char: '50000013',
                description: 'Packaging Condition',
                options: [
                    { code: '0001', description: 'ACCEPTABLE' },
                    { code: '9900', description: 'OTHER EXPLANATION FOR REJECTION' },
                    { code: 'PA01', description: 'CONTAINER BROKEN' },
                    { code: 'PA02', description: 'IMPROPER TYPE OF CONTAINER' },
                    { code: 'PA03', description: 'CONTAINER CAME OPEN' }
                ]
            },
            {
                mstr_char: '50000014',
                description: 'Physical Condition',
                options: [
                    { code: '0001', description: 'ACCEPTABLE' },
                    { code: '9900', description: 'OTHER EXPLANATION FOR REJECTION' },
                    { code: 'PY01', description: 'INCORRECT ITEM RECEIPT' },
                    { code: 'PY02', description: 'ITEM NOT COMPLETE' },
                    { code: 'PY03', description: 'SUSPECTED UNAPPROVED' },
                    { code: 'PY04', description: 'PART DAMAGE' }
                ]
            },
            {
                mstr_char: '50000015',
                description: 'Quantity',
                options: [
                    { code: '0001', description: 'ACCEPTABLE' },
                    { code: '9900', description: 'OTHER EXPLANATION FOR REJECTION' },
                    { code: 'QT01', description: 'QTY RECEIVED > QTY ORDERED' },
                    { code: 'QT02', description: 'QTY RECEIVED < QTY ORDERED' }
                ]
            },
            {
                mstr_char: '50000016',
                description: 'Material Status',
                options: [
                    { code: 'MS01', description: 'NEW ITEM' },
                    { code: 'MS02', description: 'REPAIR/INSPECT' },
                    { code: 'MS03', description: 'TEST/CALIBRATION' },
                    { code: 'MS04', description: 'OVERHAUL' },
                    { code: 'MS05', description: 'MODIFICATION' }
                ]
            },
            {
                mstr_char: '50000017',
                description: 'Preservation Check',
                options: [
                    { code: '0001', description: 'ACCEPTABLE' },
                    { code: '9900', description: 'OTHER EXPLANATION FOR REJECTION' },
                    { code: 'PR01', description: 'NO PRESERVATION' },
                    { code: 'PR02', description: 'PRESERVATION IMPROPER APPLIED' },
                    { code: 'PR03', description: 'CORROSION' },
                    { code: 'PR04', description: 'CONTAMINATION' },
                    { code: 'PR05', description: 'PACKAGE IMPROPER SEALED' }
                ]
            }
        ]
    },
    mutations: {
        update: function(state, po_number) {
            if (typeof po_number === 'object') {
                state.po = po_number.po
                state.poConfirmation = po_number.poConfirmation
                state.poHistoryTotal = po_number.poHistoryTotal
                state.itemList = po_number.itemList
                return
            }

            axios.get(process.env.ROOT_API + 'poDetail', {
                headers: {'Content-Type': 'text/xml'},
                params: {
                    po_number: po_number,
                    api_token: window.localStorage.api_token
                }
            }).then(function(r) {
                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                if (jsonData.Envelope.Body["ZFM_PO_OUTBOUND.Response"].E_POHEADER.PO_NUMBER === '') {
                    state.po = {}
                    state.poConfirmation = []
                    state.poHistoryTotal = []
                    state.itemList = []
                    return
                }

                state.po = jsonData.Envelope.Body["ZFM_PO_OUTBOUND.Response"]
                state.itemList = Array.isArray(state.po.ET_POITEM.item)
                    ? state.po.ET_POITEM.item
                    : [state.po.ET_POITEM.item];
                state.poConfirmation = Array.isArray(state.po.ET_POCONFIRMATION.item)
                    ? state.po.ET_POCONFIRMATION.item
                    : [state.po.ET_POCONFIRMATION.item];

                if (po.ET_POHISTORY_TOTALS !== '') {
                    state.poHistoryTotal = Array.isArray(state.po.ET_POHISTORY_TOTALS.item)
                        ? state.po.ET_POHISTORY_TOTALS.item
                        : [state.po.ET_POHISTORY_TOTALS.item];
                }
            }).catch(function(e) {
                state.po = {}
                state.poConfirmation = []
                state.poHistoryTotal = []
                state.itemList = []
            })
        }
    }
})
