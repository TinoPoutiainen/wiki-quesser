const button = document.querySelector(".query-button");

button.addEventListener('click', getRandom);


async function getRandom(event){
    event.preventDefault();

    try {
        const randomPage = await searchWikipedia();
        console.log(randomPage); 
        displayResult(randomPage);
        
        } 
    catch(err) {
        console.log(err);
        alert("Failed query to wikipedia");
    }
    
}


async function searchWikipedia(){
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=random&prop=info&inprop=url&utf8=&format=json&origin=*&rnnamespace=0&rnlimit=1`;
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    const json = await response.json();
    return json;
}


function displayResult(randomPage){
    const pageContainer = document.querySelector(".page-container");

    randomPage.query.random.forEach(result => {
        const url = `https://en.wikipedia.org/?curid=${result.id}`;

        pageContainer.insertAdjacentHTML(
            'beforeend',
            `<div class="result-item">
                <h3 class="result-title">
                <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
                </h3>
                <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
                
            </div>`
        );   
    });
}
