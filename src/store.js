import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import fastXmlParser from 'fast-xml-parser'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // po: {
        //     PO_NUMBER: '0450001099',
        //     VENDOR: 'PT ABC',
        //     CREATED_BY: 'BAGAS',
        //     CREAT_DATE: '2018-10-10',
        //     PO_REL_IND: '2'
        // },
        po: {},
        poConfirmation: [],
        poHistoryTotal: [],
        itemList: []
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
                    po_number: _this.po_number,
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
