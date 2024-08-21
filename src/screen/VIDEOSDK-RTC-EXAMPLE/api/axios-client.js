import axios from 'axios'

const axiosClient = () => {
    return axios.create({
        baseURL: 'https://api.videosdk.live/v2'
    })
}

export default axiosClient