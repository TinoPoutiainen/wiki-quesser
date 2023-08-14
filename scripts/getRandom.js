

const button = document.querySelector(".query-button");
button.addEventListener('click', getRandom);

async function getRandom(event){
    event.preventDefault();

    try {
        const randomPage = await searchWikipedia();
        //includes extract
        const parsedExtract = randomPage[0];
        //includes title, id, etc.
        const randomJson = randomPage[1];
      
        displayResult(randomJson, parsedExtract);
        } 
    catch(err) {
        console.log(err);
        alert("Failed query to wikipedia");
    }
}
async function searchWikipedia(){
    //get a random page
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=random&prop=info&inprop=url&utf8=&format=json&origin=*&rnnamespace=0&rnlimit=1`;
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    const json = await response.json();
    const title = json.query.random[0].title;
    const id = json.query.random[0].id;
  
    //use the title of the random page to get a parsed version of the page
   
    const url = `http://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exlimit=max&explaintext&exintro&titles=${title}`;
    const req = await fetch(url);
    const randomJson = await req.json();

    const extract = Object.values(randomJson.query.pages)[0].extract
  
    console.log(extract);
 
    return [extract, json];
    }

function displayResult(randomPage, content){

    const pageContainer = document.querySelector(".page-container");

    

    randomPage.query.random.forEach(result => {
        const url = `https://en.wikipedia.org/?curid=${result.id}`;
        const titleParts = result.title.split(" ")
        var hint = content

        for (let i = 0; i < titleParts.length; i++){
            hint = hint.replaceAll(titleParts[i], "[???]".fontcolor("red"));
        }
        

        pageContainer.insertAdjacentHTML(
            'beforeend',
            `<div class="result-item">
                <h3 class="result-title">
                <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
                </h3>
                <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
                <p class="extract"> ${hint} </p>
            </div>`
        );   
    });
}



 // function createUrl(title) { 
    //     return "https://en.wikipedia.org/w/api.php?" +
    //     new URLSearchParams({
    //         origin: "*",
    //         action: "parse",
    //         page: `${title}`,
    //         format: "json",
            
    //     }) + "&explaintext";
    // }
    // const url = createUrl(title)
     // const parsed = randomJson.parse.text["*"];
    //return results from action: parse and action: query