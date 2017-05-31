/*
This javascript is really ugly, but it works. For a first iteration this is ok, It will be
refactored. It can bring back a list of keywords, and search the datasets by those keywords,
using ajax calls
*/

/*
The Goal: from a searchable list that does not reload the entire html document (via ajax)
pull in and display a list of keywords. Then make each of those keywords pull in and
display a list of associated datasets via ajax. This requires three separate views, the
first to act as the base view, where the search bar, container divs, and the
javascript will be loaded from. The next to be the list of keywords, and the next to be
the list of datasets. The datasets displayed will be dependent on the selected keyword.
If no keywords are selected then all datasets (actually the first 20 or something) will
be displayed.

Ideally as the keywords are whittled down by the search, the datasets will be
refined. However, instead of that I think that I will have to make the the datasets view
take only a single arguement to start with.

1) define container divs and search bar
  keyword list div
  dataset list div
  keyword search bar

2) define function that makes calls to the separate views (ajax)

3) set up the views correctly
  
*/

const keywordListDiv = document.getElementById('keyword_list_div')
const datasetListDiv = document.getElementById('dataset_list_div')
const keywordListUrl = '/keywords/list'
const datasetListUrl = '/keywords/datasets'
const keywordQueryInput = document.getElementById('keyword_query_input')


/*
// function to make datasets search call by going through
// the keyword links' ids and making the url to call
const makeDatasetQueryString = () => {
  // this needs to be fixed, .map won't work on the links
  // object. It doesn't seem to be an array...
  const keywordIdList = []
  let idString = '?'
  links = document.getElementsByName('keyword_link')

  // here I need to make the string to add to the dataset url
  links.forEach(link => {
    idString += `q=${link.id}&`
  })

  return datasetListUrl + idString
}

const dataToDivAndQueryString = () => {
 // dataToDiv(data, div)
//  makeReq(makeDatasetQueryString(), dataToDiv, datasetListDiv)
  makeReq(makeDatasetQueryString(), dataToDiv, datasetListDiv)
}

// add event listener to input
keywordQueryInput.addEventListener('input', () => {
  const val = keywordQueryInput.value
  const queryUrl = keywordListUrl + '?q=' + val
  makeReq(queryUrl, dataToDiv, keywordListDiv)
  dataToDivAndQueryString()
//  makeReq(queryUrl, dataToDivAndQueryString, keywordListDiv)

})
*/



//makeReq(keywordListUrl, dataToDiv, keywordListDiv)
makeReq(keywordListUrl,console.log, keywordListDiv)

//makeReq(datasetListUrl, dataToDiv, datasetListDiv)


// go through the list of keywords returned by the
// keyword query input function thing and get the
// keyword ids. Then make a call to the datasets
// url with the ids as the query items. They should
// be appended to the url as such: '?'+'q=${pk1}'+'&'+'q=${pk2}'



