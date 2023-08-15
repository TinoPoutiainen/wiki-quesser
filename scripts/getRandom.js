

const button = document.querySelector(".query-button");
const form = document.querySelector('.guess-form');
const pageContainer = document.querySelector(".page-container");


button.addEventListener('click', getRandom);
form.addEventListener('submit', (event) => {processAnswer(event, globalTitle);});
var globalTitle;

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
    globalTitle = title;

  
    //use the title of the random page to get a parsed version of the page
    const url = `http://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exlimit=max&explaintext&exintro&titles=${title}`;
    const req = await fetch(url);
    if (!req.ok) {
        throw Error(response.statusText);
    }

    const randomJson = await req.json();
    const extract = Object.values(randomJson.query.pages)[0].extract
    console.log(extract);
 
    return [extract, json];
    }



function displayResult(randomPage, content){
        const props = randomPage.query.random[0];   
        const url = `https://en.wikipedia.org/?curid=${props.id}`;
        const titleParts = props.title.split(" ")

        var hint = content

        for (let i = 0; i < titleParts.length; i++){
            hint = hint.replaceAll(titleParts[i], "[???]".fontcolor("red"));
        }

        form.reset();
        const oldResult = document.querySelector('.result-item');
        const resMessage = document.querySelector('.result-message');
        if (oldResult) {oldResult.remove()};
        if (resMessage) {resMessage.remove()};
      
        pageContainer.insertAdjacentHTML(
            'beforeend',
            `<div class="result-item">
                    <div class="answer-container">
                    <h3 class="result-title">
                    <a href="${url}" target="_blank" rel="noopener">${props.title}</a>
                    </h3>
                    <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
                    </div>
                <p class="extract"> ${hint} </p>
            </div>`
        );
        button.disabled = true;
        
    
}



function processAnswer(event, globalTitle){
   
    event.preventDefault();
    console.log(globalTitle);
    const inputValue = document.querySelector('.guess-input').value;
    if (!globalTitle) {
        console.log("get a random article first")
    }
    else if (inputValue == globalTitle){
        updateResultMessage("Correct"); 
    }
    else{
        updateResultMessage("Wrong");  
    }

}
function updateResultMessage(resMessage) {
    const oldMessage = document.querySelector('.result-message');
        if (oldMessage) {oldMessage.remove()};
        pageContainer.insertAdjacentHTML(
            'beforebegin',
            `<p class="result-message" >${resMessage}</p>`
        ) 
        document.querySelector('.answer-container').style.display = "block";
        button.disabled = false;
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

