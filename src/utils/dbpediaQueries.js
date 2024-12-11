import axios from "axios";


  
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
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?tournament ?name ?logo ?abstract
        WHERE {
        ?tournament dct:subject dbr:Category:Esports_tournaments .
        ?tournament rdfs:label ?name .
        ?tournament dbo:abstract ?abstract .
        OPTIONAL { ?tournament dbo:thumbnail ?logo . }
        FILTER (lang(?name) = "en" && lang(?abstract) = "en")
        }
        ORDER BY DESC(strlen(?abstract))
        LIMIT 15
    `;
  
    const params = { query: sparqlQuery, format: "json" };
  
    try {
      const response = await axios.get(sparqlEndpoint, { params });
      const results = response.data.results.bindings;
  
      return results.map((tournament) => ({
        name: tournament.name.value,
        logo: tournament.logo?.value || "https://via.placeholder.com/150",
      }));
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      return [];
    }
  }
