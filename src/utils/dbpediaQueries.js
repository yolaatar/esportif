import axios from "axios";

async function fetchWikipediaImage(gameName) {
  const wikipediaEndpoint = `https://en.wikipedia.org/w/api.php`;
  const params = {
    action: "query",
    titles: gameName,
    prop: "pageimages",
    format: "json",
    origin: "*",
    pithumbsize: 100,
  };

  try {
    const response = await axios.get(wikipediaEndpoint, { params });
    const pages = response.data.query.pages;

    for (const pageId in pages) {
      if (pages[pageId].thumbnail) {
        return pages[pageId].thumbnail.source;
      }
    }
    return null;
  } catch (error) {
    console.error(`Error fetching Wikipedia image for ${gameName}:`, error);
    return null;
  }
}

  
export async function queryGames() {
const sparqlEndpoint = "https://dbpedia.org/sparql";
const sparqlQuery = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dct: <http://purl.org/dc/terms/>

    SELECT ?game ?name ?logo
    WHERE {
    ?game dct:subject dbr:Category:Esports_games ;
            rdfs:label ?name ;
            dbo:abstract ?abstract .
    OPTIONAL { ?game dbo:thumbnail ?logo . }
    FILTER (lang(?name) = "en" && lang(?abstract) = "en")
    }
    ORDER BY DESC(strlen(?abstract))
    LIMIT 10
`;

const params = { query: sparqlQuery, format: "json" };

try {
    const response = await axios.get(sparqlEndpoint, { params });
    const results = response.data.results.bindings;

    // Map and fetch missing logos
    return Promise.all(
    results.map(async (game) => {
        const name = game.name.value;
        const logo = game.logo?.value || (await fetchWikipediaImage(name)) || "https://via.placeholder.com/100";
        return { name, logo };
    })
    );
} catch (error) {
    console.error("Error fetching esports games:", error);
    return [];
}
}
