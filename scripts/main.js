const form = document.querySelector('.input-form');

form.addEventListener('submit', handleSubmit);


async function handleSubmit(event) {
    event.preventDefault();

    const inputValue = document.querySelector('.input').value;
    // remove whitespace from the input
    const searchQuery = inputValue.trim();

    try {
    const result = await searchWikipedia(searchQuery);
    console.log(result);
    printResults(result);
    } catch(err) {
        console.log(err);
        alert("Failed query to wikipedia");
    }
    

}

function printResults(results) {
    const searchResults = document.querySelector(".result-container");
    results.query.search.forEach(result => {
        const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

        searchResults.insertAdjacentHTML(
            'beforeend',
            `<div class="result-item">
                <h3 class="result-title">
                <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
                </h3>
                <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
                <span class="result-snippet">${result.snippet}</span><br>
            </div>`
        );   
    });

}

async function searchWikipedia(searchQuery) {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    const json = await response.json()
    return json;
}