import axiosClient from '../api/axios-client';

const client = axiosClient()

export const request = ({ url, method, data, headers }) => {
    method = method.toUpperCase()
    return new Promise((resolve, reject) => {
      const payload = {
        method, url,
        headers: {
          ...headers
        },
        data
      }
      client(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })
  };