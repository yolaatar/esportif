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
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?game ?name ?logo (COUNT(?link) AS ?linkCount)
    WHERE {
    ?game dct:subject dbr:Category:Esports_games .
    ?link dbo:wikiPageWikiLink ?game .
    ?game rdfs:label ?name .
    OPTIONAL { ?game dbo:thumbnail ?logo . }
    FILTER (lang(?name) = "en")
    }
    GROUP BY ?game ?name ?logo
    ORDER BY DESC(?linkCount)
    LIMIT 10
`;

const params = { query: sparqlQuery, format: "json" };

try {
    const response = await axios.get(sparqlEndpoint, { params });
    const results = response.data.results.bindings;

    return results.map((game) => ({
    name: game.name.value,
    gameURI: game.game?.value,
    logo: game.logo?.value || "https://via.placeholder.com/150", // Fallback logo
    }));
} catch (error) {
    console.error("Error fetching esports games:", error);
    return [];
}
}

export async function queryTournaments() {
    const sparqlEndpoint = "https://dbpedia.org/sparql";
  
    const sparqlQuery = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?tournament ?name ?logo (COUNT(?link) AS ?crosslinkCount)
WHERE {
  ?tournament dct:subject dbr:Category:Esports_tournaments .
  ?link dbo:wikiPageWikiLink ?tournament .
  ?tournament rdfs:label ?name .
  OPTIONAL { ?tournament dbo:thumbnail ?logo . }
  FILTER (lang(?name) = "en")
}
GROUP BY ?tournament ?name ?logo
ORDER BY DESC(?crosslinkCount)
LIMIT 15

    `;
  
    const params = { query: sparqlQuery, format: "json" };
  
    try {
      const response = await axios.get(sparqlEndpoint, { params });
      const results = response.data.results.bindings;
  
      return results.map((tournament) => ({
        name: tournament.name.value,
        logo: tournament.logo?.value || "https://via.placeholder.com/150", // Fallback logo
      }));
    } catch (error) {
      console.error("Error fetching popular tournaments:", error);
      return [];
    }
  }

  export async function queryGameDetails(gameURI) {
    const sparqlEndpoint = "https://dbpedia.org/sparql";
    const sparqlQuery = `
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dbr: <http://dbpedia.org/resource/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX dct: <http://purl.org/dc/terms/>
  
      SELECT ?name 
             (MIN(?releaseDate) AS ?oldestReleaseDate) 
             (GROUP_CONCAT(DISTINCT ?publisherName; SEPARATOR=", ") AS ?publishers) 
             (GROUP_CONCAT(DISTINCT ?developerName; SEPARATOR=", ") AS ?developers) 
             (GROUP_CONCAT(DISTINCT ?genreName; SEPARATOR=", ") AS ?genres) 
             (GROUP_CONCAT(DISTINCT ?platformName; SEPARATOR=", ") AS ?platforms) 
             ?abstract
      WHERE {
        <${gameURI}> rdfs:label ?name ;
                     dbo:releaseDate ?releaseDate ;
                     dbo:publisher ?publisher ;
                     dbo:developer ?developer ;
                     dbo:genre ?genre ;
                     dbo:abstract ?abstract .
        
        OPTIONAL { ?publisher rdfs:label ?publisherName . FILTER(lang(?publisherName) = "en") }
        OPTIONAL { ?developer rdfs:label ?developerName . FILTER(lang(?developerName) = "en") }
        OPTIONAL { ?genre rdfs:label ?genreName . FILTER(lang(?genreName) = "en") }
        OPTIONAL { <${gameURI}> dbo:computingPlatform ?platform . 
                   ?platform rdfs:label ?platformName . FILTER(lang(?platformName) = "en") }
        
        FILTER (lang(?name) = "en" && lang(?abstract) = "en")
      }
      GROUP BY ?name ?abstract
    `;
  
    const params = { query: sparqlQuery, format: "json" };
  
    try {
      const response = await axios.get(sparqlEndpoint, { params });
      const result = response.data.results.bindings[0]; // Expecting one result
  
      // Return formatted game details
      return {
        name: result.name?.value,
        releaseDate: result.oldestReleaseDate?.value,
        publishers: result.publishers?.value.split(", "),
        developers: result.developers?.value.split(", "),
        genres: result.genres?.value.split(", "),
        platforms: result.platforms?.value.split(", "),
        abstract: result.abstract?.value,
      };
    } catch (error) {
      console.error("Error fetching game details:", error);
      return null;
    }
  }