import axios from 'axios';

// Create a wrapper around axios so we don't have to type
// {params: <parameter object>}
// for every api call
const AxiosAPI = {
    api: axios.create({
        baseURL: `http://localhost:5000/api/`
    }),

    get: function(url, params){
        return this.api.get(url, {params: params})
    },

    post: function(url, params){
        return this.api.post(url, {params: params})
    }
}

export default AxiosAPI