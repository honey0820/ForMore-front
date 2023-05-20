import Axios from 'axios'
import { Urls } from './Urls'

var Helper = {
    POST: async function (url, body) {
        return Axios({
            url: Urls.baseUrl + url,
            method: 'POST',
            data: body,
        }).then(res => { return res.data }).catch((e) => {
            console.log('POST Method Error => ', e)
            return e
        })
    },
    GET: async function (url) {
        return Axios({
            url: Urls.baseUrl + url,
            method: 'GET'
        }).then(res => { return res.data }).catch((e) => {
            console.log('GET Method Error => ', e)
            return e
        })
    },
    POSTFILE: async function (url, body) {
        return Axios({
            url: Urls.baseUrl + url,
            method: 'POST',
            data: body,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        }).then(res => { return res.data }).catch((e) => {
            console.log('POST Method Error => ', e)
            return e
        })
    },
    POSTXWW: async function (url, body) {
        return Axios({
            url: Urls.baseUrl + url,
            method: 'POST',
            data: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => { return res.data }).catch((e) => {
            return e
        })
    },
}

export { Helper }