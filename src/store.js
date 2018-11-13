import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import fastXmlParser from 'fast-xml-parser'

Vue.use(Vuex)

export default new Vuex.Store({
    getters: {
        poConfirmation: state => {
            if (state.po.ET_POCONFIRMATION !== '' && state.po.ET_POCONFIRMATION !== undefined) {
                return Array.isArray(state.po.ET_POCONFIRMATION.item)
                ? state.po.ET_POCONFIRMATION.item
                : [state.po.ET_POCONFIRMATION.item];
            }

            return []
        },
        poHistoryTotal: state => {
            if (state.po.ET_POHISTORY_TOTALS !== '' && state.po.ET_POHISTORY_TOTALS !== undefined) {
                return Array.isArray(state.po.ET_POHISTORY_TOTALS.item)
                    ? state.po.ET_POHISTORY_TOTALS.item
                    : [state.po.ET_POHISTORY_TOTALS.item];
            }

            return []
        },
        itemList: state => {
            if (state.po.ET_POITEM === undefined) {
                return []
            }

            let itemList = Array.isArray(state.po.ET_POITEM.item)
                ? state.po.ET_POITEM.item
                : [state.po.ET_POITEM.item];

            return itemList.filter(i => i.DELETE_IND !== 'X' && i.RET_TEM !== 'X')
        }
    },
    state: {
        po: {},
        inspectionCharacteristics: [
            {
                mstr_char: '50000000',
                description: 'SERVICEABILITY AUTHORITY',
                options: [
                    { group: 'AUTHORTY', code: 'DGCA', description: 'DGCA approved part' },
                    { group: 'AUTHORTY', code: 'EASA', description: 'EASA approved part' },
                    { group: 'AUTHORTY', code: 'FAA', description: 'FAA approved part' }
                ]
            },
            {
                mstr_char: '50000001',
                description: 'SEC SERVICEABLE AUTHORITY 1',
                options: [
                    { group: 'AUTHORTY', code: 'DGCA', description: 'DGCA approved part' },
                    { group: 'AUTHORTY', code: 'EASA', description: 'EASA approved part' },
                    { group: 'AUTHORTY', code: 'FAA', description: 'FAA approved part' },
                    { group: 'MIC', code: '0002', description: 'Not Applicable' }
                ]
            },
            {
                mstr_char: '50000002',
                description: 'SEC SERVICEABLE AUTHORITY 2',
                options: [
                    { group: 'AUTHORTY', code: 'DGCA', description: 'DGCA approved part' },
                    { group: 'AUTHORTY', code: 'EASA', description: 'EASA approved part' },
                    { group: 'AUTHORTY', code: 'FAA', description: 'FAA approved part' },
                    { group: 'MIC', code: '0002', description: 'Not Applicable' }
                ]
            },
            {
                mstr_char: '50000003',
                description: 'SERVICEABILITY STATUS',
                options: [
                    { group: 'STATUS', code: 'SERV', description: 'Serviceable' },
                    { group: 'STATUS', code: 'STAC', description: 'STAC' },
                    { group: 'STATUS', code: 'UNSV', description: 'Unserviceable' }
                ]
            },
            {
                mstr_char: '50000004',
                description: 'General Document - Invoice',
                options: [
                    { group: 'INVOICE', code: 'GD01', description: 'INVOICE AVAILABLE (ACCEPTED)' },
                    { group: 'INVOICE', code: 'GD02', description: 'INVOICE NOT AVAILABLE (ACCEPTED)' },
                    { group: 'INVOICE', code: 'GD1A', description: 'INVOICE AVAILABLE (REJECTED)' },
                    { group: 'INVOICE', code: 'GD2A', description: 'INVOICE NOT AVAILABLE (REJECTED)' }
                ]
            },
            {
                mstr_char: '50000005',
                description: 'General Document - Airway Bill',
                options: [
                    { group: 'ARWYBILL', code: 'GD03', description: 'AIRWAYBILL AVAILABLE (ACCEPTED)' },
                    { group: 'ARWYBILL', code: 'GD04', description: 'AIRWAYBILL NOT AVAILABLE (ACCEPTED)' },
                    { group: 'ARWYBILL', code: 'GD3A', description: 'AIRWAYBILL AVAILABLE (REJECTED)' },
                    { group: 'ARWYBILL', code: 'GD4A', description: 'AIRWAYBILL NOT AVAILABLE (REJECTED)' }
                ]
            },
            {
                mstr_char: '50000006',
                description: 'General Document - Shipping Document',
                options: [
                    { group: 'SHIPDOC', code: 'GD05', description: 'SHIPPNG DOCUMENT AVAILABLE (ACCEPTED)' },
                    { group: 'SHIPDOC', code: 'GD06', description: 'SHIPPNG DOCUMENT NOT AVAILABLE (ACCEPT)' },
                    { group: 'SHIPDOC', code: 'GD5A', description: 'SHIPPNG DOCUMENT AVAILABLE (REJECTED)' },
                    { group: 'SHIPDOC', code: 'GD6A', description: 'SHIPPNG DOCUMENT NOT AVAILABLE(REJECT)' }
                ]
            },
            {
                mstr_char: '50000007',
                description: 'Certificate of Conformity',
                options: [
                    { group: 'CERTCONF', code: 'CC01', description: 'CERTIFICATE OF CONFORMITY AVAILABLE(ACC)' },
                    { group: 'CERTCONF', code: 'CC02', description: 'CERTIFICATE OF CONFORMITY NOT AVAIL(ACC)' },
                    { group: 'CERTCONF', code: 'CC1A', description: 'CERTIFICATE OF CONFORMITY AVAILABLE(REJ)' },
                    { group: 'CERTCONF', code: 'CC2A', description: 'CERTIFICATE OF CONFORMITY NOT AVAIL(REJ)' }
                ]
            },
            {
                mstr_char: '50000008',
                description: 'Calibration Certificate',
                options: [
                    { group: 'CERTCALB', code: 'CL01', description: 'CALIBRATION CERTIFICATE AVAILABLE(ACCEP)' },
                    { group: 'CERTCALB', code: 'CL02', description: 'CALIBRATION CERTIFICATE NOT AVAIL(ACCEP)' },
                    { group: 'CERTCALB', code: 'CL1A', description: 'CALIBRATION CERTIFICATE AVAILABLE(REJEC)' },
                    { group: 'CERTCALB', code: 'CL2A', description: 'CALIBRATION CERTIFICATE NOT AVAIL(REJEC)' }
                ]
            },
            {
                mstr_char: '50000009',
                description: 'Servicable Tag',
                options: [
                    { group: 'SERVTAG', code: 'ST01', description: 'SERVICABLE TAG AVAILABLE (ACCEPTED)' },
                    { group: 'SERVTAG', code: 'ST02', description: 'SERVICABLE TAG NOT AVAILABLE (ACCEPTED)' },
                    { group: 'SERVTAG', code: 'ST1A', description: 'SERVICABLE TAG AVAILABLE (REJECTED)' },
                    { group: 'SERVTAG', code: 'ST2A', description: 'SERVICABLE TAG NOT AVAILABLE (REJECTED)' }
                ]
            },
            {
                mstr_char: '50000010',
                description: 'Test Certificate',
                options: [
                    { group: 'TESTCERT', code: 'TC01', description: 'TEST CERTIFICATE AVAILABLE (ACCEPTED)' },
                    { group: 'TESTCERT', code: 'TC02', description: 'TEST CERTIFICATE NOT AVAILABLE (ACCEPT)' },
                    { group: 'TESTCERT', code: 'TC1A', description: 'TEST CERTIFICATE AVAILABLE (REJECTED)' },
                    { group: 'TESTCERT', code: 'TC2A', description: 'TEST CERTIFICATE NOT AVAILABLE(REJECTED)' }
                ]
            },
            {
                mstr_char: '50000011',
                description: 'Technical Data and Document',
                options: [
                    { group: 'MIC', code: '0001', description: 'ACCEPTABLE' },
                    { group: 'MIC', code: '9900', description: 'OTHER EXPLANATION FOR REJECTION' },
                    { group: 'TECHDOC', code: 'TD01', description: 'DOCUMENT NOT RECEIVED' },
                    { group: 'TECHDOC', code: 'TD02', description: 'DOCUMENT NOT COMPLETE' },
                    { group: 'TECHDOC', code: 'TD03', description: 'DOCUMENT NOT APPLICABLE' },
                    { group: 'TECHDOC', code: 'TD04', description: 'DOCUMENT ILLEGIBLE OR MUTILATED' }
                ]
            },
            {
                mstr_char: '50000012',
                description: 'Packaging Type',
                options: [
                    { group: 'PACKTYPE', code: 'PT01', description: 'REUSABLE CONTAINER USED' },
                    { group: 'PACKTYPE', code: 'PT02', description: 'WOODEN BOX USED' },
                    { group: 'PACKTYPE', code: 'PT03', description: 'CARTON BOX USED' },
                    { group: 'PACKTYPE', code: 'PT04', description: 'UNPACKAGE' }
                ]
            },
            {
                mstr_char: '50000013',
                description: 'Packaging Condition',
                options: [
                    { group: 'MIC', code: '0001', description: 'ACCEPTABLE' },
                    { group: 'MIC', code: '9900', description: 'OTHER EXPLANATION FOR REJECTION' },
                    { group: 'PACKCON', code: 'PA01', description: 'CONTAINER BROKEN' },
                    { group: 'PACKCON', code: 'PA02', description: 'IMPROPER TYPE OF CONTAINER' },
                    { group: 'PACKCON', code: 'PA03', description: 'CONTAINER CAME OPEN' }
                ]
            },
            {
                mstr_char: '50000014',
                description: 'Physical Condition',
                options: [
                    { group: 'MIC', code: '0001', description: 'ACCEPTABLE' },
                    { group: 'MIC', code: '9900', description: 'OTHER EXPLANATION FOR REJECTION' },
                    { group: 'PHYSCON', code: 'PY01', description: 'INCORRECT ITEM RECEIPT' },
                    { group: 'PHYSCON', code: 'PY02', description: 'ITEM NOT COMPLETE' },
                    { group: 'PHYSCON', code: 'PY03', description: 'SUSPECTED UNAPPROVED' },
                    { group: 'PHYSCON', code: 'PY04', description: 'PART DAMAGE' }
                ]
            },
            {
                mstr_char: '50000015',
                description: 'Quantity',
                options: [
                    { group: 'MIC', code: '0001', description: 'ACCEPTABLE' },
                    { group: 'MIC', code: '9900', description: 'OTHER EXPLANATION FOR REJECTION' },
                    { group: 'QTY', code: 'QT01', description: 'QTY RECEIVED > QTY ORDERED' },
                    { group: 'QTY', code: 'QT02', description: 'QTY RECEIVED < QTY ORDERED' }
                ]
            },
            {
                mstr_char: '50000016',
                description: 'Material Status',
                options: [
                    { group: 'MATLSTAT', code: 'MS01', description: 'NEW ITEM' },
                    { group: 'MATLSTAT', code: 'MS02', description: 'REPAIR/INSPECT' },
                    { group: 'MATLSTAT', code: 'MS03', description: 'TEST/CALIBRATION' },
                    { group: 'MATLSTAT', code: 'MS04', description: 'OVERHAUL' },
                    { group: 'MATLSTAT', code: 'MS05', description: 'MODIFICATION' }
                ]
            },
            {
                mstr_char: '50000017',
                description: 'Preservation Check',
                options: [
                    { group: 'MIC', code: '0001', description: 'ACCEPTABLE' },
                    { group: 'MIC', code: '9900', description: 'OTHER EXPLANATION FOR REJECTION' },
                    { group: 'PRSVCHCK', code: 'PR01', description: 'NO PRESERVATION' },
                    { group: 'PRSVCHCK', code: 'PR02', description: 'PRESERVATION IMPROPER APPLIED' },
                    { group: 'PRSVCHCK', code: 'PR03', description: 'CORROSION' },
                    { group: 'PRSVCHCK', code: 'PR04', description: 'CONTAMINATION' },
                    { group: 'PRSVCHCK', code: 'PR05', description: 'PACKAGE IMPROPER SEALED' }
                ]
            },
            {
                mstr_char: '50000018',
                description: 'Best Before Date',
                options: [
                    { group: '', code: '', description: 'Best Before Date' }
                ]
            }
        ]
    },
    mutations: {
        refresh: function(state, po_number) {
            axios.get(process.env.ROOT_API + 'poDetail', {
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
                } else {
                    state.po = jsonData.Envelope.Body["ZFM_PO_OUTBOUND.Response"]
                }
            }).catch(function(e) {
                state.po = {}
            })
        }
    }
})
