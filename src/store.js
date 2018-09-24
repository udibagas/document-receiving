import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import fastXmlParser from 'fast-xml-parser'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        nomer: 0,
        po: {},
        poConfirmation: [],
        poHistoryTotal: [],
        itemList: []
    },
    mutations: {
        increment: function(state, step) {
            state.nomer += step
        },
        decrement: function(state, step) {
            state.nomer -= step
        },
        update: function(state, po_number) {
            if (typeof po_number === 'object') {
                state.po = po_number.po
                state.poConfirmation = po_number.poConfirmation
                state.poHistoryTotal = po_number.poHistoryTotal
                state.itemList = po_number.itemList
                return
            }

            let apiUrl = 'http://sapgmfdpi.gmf-aeroasia.co.id:52500/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_POGetDetail&receiverParty=&receiverService=&interface=POGetDetail_OB_SI&interfaceNamespace=urn:gmf-aeroasia.co.id:POGetDetail'

            let xmls = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\
                <soapenv:Header/>\
                <soapenv:Body>\
                    <urn:BAPI_PO_GETDETAIL1>\
                        <PURCHASEORDER>' + po_number + '</PURCHASEORDER>\
                    </urn:BAPI_PO_GETDETAIL1>\
                </soapenv:Body>\
            </soapenv:Envelope>'

            axios.post(apiUrl, xmls, {
                headers: {'Content-Type': 'text/xml'},
                auth: {
                    username: process.env.SAP_API_USERNAME,
                    password: process.env.SAP_API_PASSWORD
                }
            }).then(function(r) {
                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                if (jsonData.Envelope.Body["BAPI_PO_GETDETAIL1.Response"].POHEADER.PO_NUMBER === '') {
                    state.po = {}
                    state.poConfirmation = []
                    state.poHistoryTotal = []
                    state.poItem = []
                    return
                }

                state.po = jsonData.Envelope.Body["BAPI_PO_GETDETAIL1.Response"]
                state.itemList = Array.isArray(state.po.POITEM.item)
                    ? state.po.POITEM.item
                    : [state.po.POITEM.item];
                state.poConfirmation = Array.isArray(state.po.POCONFIRMATION.item)
                    ? state.po.POCONFIRMATION.item
                    : [state.po.POCONFIRMATION.item];

                if (po.POHISTORY_TOTALS !== '') {
                    state.poHistoryTotal = Array.isArray(state.po.POHISTORY_TOTALS.item)
                        ? state.po.POHISTORY_TOTALS.item
                        : [state.po.POHISTORY_TOTALS.item];
                }
            }).catch(function(e) {
                state.po = {}
                state.poConfirmation = []
                state.poHistoryTotal = []
                state.poItem = []
            })
        }
    }
})
