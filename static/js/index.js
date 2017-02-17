if (typeof module !== 'undefined' && module.exports != null) {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
}

const addSmoke = (a, b) => a + b


const getData = (url) => {
  const promise = new Promise((resolve,reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = () => {
      xhr.readyState === 4 && xhr.status === 200
        ? resolve(JSON.parse(xhr.responseText))
        : reject(Error(xhr.statusText))
    }
    xhr.onerror = () => reject(Error('Network Error'))
    xhr.send()
  })
  return promise
}


  const testUrl = 'https://raw.githubusercontent.com/zmtdummy/' +
    'GeoJsonData/master/singlepoint.json'

getData(testUrl).then(data => console.log(data), error => console.log(error))






if (typeof module !== 'undefined' && module.exports != null) {
    exports.addSmoke = addSmoke;
    exports.getData = getData;
}
