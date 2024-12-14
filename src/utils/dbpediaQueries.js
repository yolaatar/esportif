import axios from "axios";

const isRelevantImage = (imageUrl) => {
  // Liste de mots-clés à rechercher pour identifier des images pertinentes
  const relevantKeywords = ["logo", "boxart", "cover", "artwork"];
  // Liste de mots-clés à éviter
  const irrelevantKeywords = ["commons"];
  // const irrelevantKeywords = ["iphone", "android", "screenshot", "device", "interface", "commons"];

  const lowerCaseUrl = imageUrl.toLowerCase();

  // Retourne vrai si l'image contient des mots-clés pertinents et aucun mot-clé indésirable
  return (
    relevantKeywords.some((keyword) => lowerCaseUrl.includes(keyword)) &&
    !irrelevantKeywords.some((keyword) => lowerCaseUrl.includes(keyword))
  );
};


async function fetchWikipediaImage(gameName) {
  const wikipediaEndpoint = `https://en.wikipedia.org/w/api.php`;
  const params = {
    action: "query",
    titles: gameName,
    prop: "pageimages|images",
    format: "json",
    origin: "*",
    pithumbsize: 500,
  };

	try {
		const response = await axios.get(wikipediaEndpoint, { params });
		const pages = response.data.query.pages;

    for (const pageId in pages) {
      const page = pages[pageId];

      // Vérifie si une miniature est disponible
      if (page.thumbnail && page.thumbnail.source) {
        const imageUrl = page.thumbnail.source;

        // Priorise les images avec "logo" dans le chemin
        if (imageUrl.toLowerCase().includes("logo")) {
          return imageUrl;
        }

        // Vérifie si l'image est pertinente
        if (isRelevantImage(imageUrl)) {
          return imageUrl;
        }
      }

      // Sinon, essaye de récupérer la première image de la page
      if (page.images) {
        for (const image of page.images) {
          const imageUrl = await fetchFullImageUrl(image.title);
          if (imageUrl && isRelevantImage(imageUrl)) {
            return imageUrl;
          }
        }
      }
    }

    console.warn(`No relevant image found for ${gameName}`);
    return null;
  } catch (error) {
    console.error(`Error fetching Wikipedia image for ${gameName}:`, error);
    return null;
  }
}


// Récupère l'URL complète d'une image à partir de son titre
async function fetchFullImageUrl(imageTitle) {
  const wikipediaEndpoint = `https://en.wikipedia.org/w/api.php`;
  const params = {
    action: "query",
    titles: imageTitle,
    prop: "imageinfo",
    iiprop: "url", // Récupère l'URL complète
    format: "json",
    origin: "*",
  };

  try {
    const response = await axios.get(wikipediaEndpoint, { params });
    const pages = response.data.query.pages;

    for (const pageId in pages) {
      const imageInfo = pages[pageId]?.imageinfo;
      if (imageInfo && imageInfo[0]?.url) {
        return imageInfo[0].url; // Retourne l'URL complète de l'image
      }
    }

    return null; // Pas d'image trouvée
  } catch (error) {
    console.error(`Error fetching full image URL for ${imageTitle}:`, error);
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
    LIMIT 12
  `;

  const cleanGameName = (name) => name.replace(/\s*\(.*?\)$/, "").trim();

  try {
    const response = await axios.get(sparqlEndpoint, {
      params: { query: sparqlQuery, format: "json" },
    });

    const results = response.data.results.bindings;

    // Récupère les jeux et gère les logos manquants
    return Promise.all(
      results.map(async (game) => {
        if (!game.name || !game.name.value) {
          return { name: "Unknown Game", logo: "https://via.placeholder.com/150" };
        }

        const name = cleanGameName(game.name.value);
    
        const logo =
          (await fetchWikipediaImage(name)) || game.logo?.value || "https://via.placeholder.com/150";

        return { name, logo};
      })
    );
  } catch (error) {
    console.error("Error fetching esports games:", error);
    return [];
  }
}


export async function queryTournaments() {
    const sparqlEndpoint = "https://dbpedia.org/sparql";
  
    const sparqlQuery = `
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dbr: <http://dbpedia.org/resource/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT ?tournament ?name ?logo ?abstract
      WHERE {
        dbr:List_of_esports_leagues_and_tournaments dbo:wikiPageWikiLink ?tournament .
        ?tournament rdfs:label ?name .
        ?tournament dbo:abstract ?abstract .
        OPTIONAL { ?tournament dbo:thumbnail ?logo . }
        FILTER (lang(?name) = "en" && lang(?abstract) = "en" && (
          CONTAINS(LCASE(?name), "world cup") ||
          CONTAINS(LCASE(?name), "championship") ||
          CONTAINS(LCASE(?name), "cup") ||
          CONTAINS(LCASE(?name), "champions") ||
          CONTAINS(LCASE(?name), "tournament") ||
          CONTAINS(LCASE(?name), "invitational")||
          CONTAINS(LCASE(?name), "series") 
        ))
      }
      ORDER BY DESC(strlen(?abstract))
      LIMIT 12

    `;
  
    const params = { query: sparqlQuery, format: "json" };
  
    try {
      const response = await axios.get(sparqlEndpoint, { params });
      const results = response.data.results.bindings;
  
      return results.map((tournament) => ({
        name: tournament.name.value,
        logo: tournament.logo?.value ||  "https://via.placeholder.com/150",
      }));
    } catch (error) {
      console.error("Error fetching popular tournaments:", error);
      return [];
    }
  }


  export async function queryPopularTeams() {
    const sparqlEndpoint = "https://dbpedia.org/sparql";
  
    const sparqlQuery = `
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT ?name ?team ?logo ?abstract
      WHERE {
        {
          SELECT ?name (SAMPLE(?team) AS ?team) (SAMPLE(?logo) AS ?logo) (SAMPLE(?abstract) AS ?abstract)
                (CASE 
                    WHEN STR(?name) = "T1 (esports)" THEN 1
                    WHEN STR(?name) = "100 Thieves" THEN 2
                    WHEN STR(?name) = "FaZe Clan" THEN 3
                    WHEN STR(?name) = "Samsung Galaxy (esports)" THEN 4
                    WHEN STR(?name) = "Shanghai Dragons" THEN 5
                    ELSE 6
                END AS ?priority)
          WHERE {
            {
              ?team dct:subject <http://dbpedia.org/resource/Category:Esports_teams_based_in_China> .
            }
            UNION
            {
              ?team dct:subject <http://dbpedia.org/resource/Category:Esports_teams_based_in_the_United_States> .
            }
            UNION
            {
              ?team dct:subject <http://dbpedia.org/resource/Category:Esports_teams_based_in_South_Korea> .
            }
            ?team rdfs:label ?name .
            OPTIONAL { ?team dbo:abstract ?abstract . }
            OPTIONAL { ?team dbo:thumbnail ?logo . }
            FILTER (
              lang(?name) = "en" &&
              (
                CONTAINS(LCASE(?name), "esports") ||
                CONTAINS(LCASE(?name), "team") ||
                CONTAINS(LCASE(?name), "gaming") ||
                CONTAINS(LCASE(?name), "clan") ||
                CONTAINS(LCASE(?name), "thieves") ||
                CONTAINS(LCASE(?name), "dragons")
              )
            )
          }
          GROUP BY ?name
        }
      }
      ORDER BY ?priority DESC(strlen(STR(?abstract)))
      LIMIT 12

    `;
  
    const params = { query: sparqlQuery, format: "json" };
  
    try {
      const response = await axios.get(sparqlEndpoint, { params });
      const results = response.data.results.bindings;
  
      return results.map((team) => ({
        name: team.name.value,
        logo: team.logo?.value || "https://via.placeholder.com/150", // Fallback logo
        abstract: team.abstract?.value || "No abstract available", // Handle missing abstracts
      }));
    } catch (error) {
      console.error("Error fetching popular teams:", error);
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

  export async function queryGameDetailsByName(gameName) {
    const sparqlEndpoint = "https://dbpedia.org/sparql";
    const escapedGameName = gameName.replace(/[\(\)]/g, '\\$&'); // Escape parentheses
  
    const sparqlQuery = `
      PREFIX dbp: <http://dbpedia.org/property/>
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
      SELECT ?name
             (COALESCE(MIN(?dboReleaseDate), MIN(?dbpReleaseDate)) AS ?releaseDate)
             (GROUP_CONCAT(DISTINCT ?publisherName; SEPARATOR=", ") AS ?publishers)
             (GROUP_CONCAT(DISTINCT ?developerName; SEPARATOR=", ") AS ?developers)
             (GROUP_CONCAT(DISTINCT ?dboGenreName; SEPARATOR=", ") AS ?dboGenres)
             (GROUP_CONCAT(DISTINCT ?dbpGenreName; SEPARATOR=", ") AS ?dbpGenres)
             (GROUP_CONCAT(DISTINCT ?dboPlatformName; SEPARATOR=", ") AS ?dboPlatforms)
             (GROUP_CONCAT(DISTINCT ?dbpPlatformName; SEPARATOR=", ") AS ?dbpPlatforms)
             ?abstract
      WHERE {
        ?game rdfs:label ?name ;
              dct:subject dbr:Category:Esports_games .
  
        FILTER (
          (str(?name) = "${gameName}"@en || regex(str(?name), "^${escapedGameName}( \\\\(video game series\\\\))?$", "i"))
          && lang(?name) = "en"
        )
  
        OPTIONAL { ?game dbo:releaseDate ?dboReleaseDate . }
        OPTIONAL { ?game dbp:firstReleaseDate ?dbpReleaseDate . }
  
        OPTIONAL {
          ?game dbo:publisher ?publisher .
          ?publisher rdfs:label ?publisherName .
          FILTER(lang(?publisherName) = "en")
        }
        OPTIONAL {
          ?game dbp:publisher ?dbpPublisher .
          ?dbpPublisher rdfs:label ?publisherName .
          FILTER(lang(?publisherName) = "en")
        }
  
        OPTIONAL {
          ?game dbo:developer ?developer .
          ?developer rdfs:label ?developerName .
          FILTER(lang(?developerName) = "en")
        }
        OPTIONAL {
          ?game dbp:developer ?dbpDeveloper .
          ?dbpDeveloper rdfs:label ?developerName .
          FILTER(lang(?developerName) = "en")
        }
  
        OPTIONAL {
          ?game dbo:genre ?dboGenre .
          ?dboGenre rdfs:label ?dboGenreName .
          FILTER(lang(?dboGenreName) = "en")
        }
        OPTIONAL {
          ?game dbp:genre ?dbpGenre .
          ?dbpGenre rdfs:label ?dbpGenreName .
          FILTER(lang(?dbpGenreName) = "en")
        }
  
        OPTIONAL {
          ?game dbo:computingPlatform ?dboPlatform .
          ?dboPlatform rdfs:label ?dboPlatformName .
          FILTER(lang(?dboPlatformName) = "en")
        }
        OPTIONAL {
          ?game dbp:platforms ?dbpPlatform .
          ?dbpPlatform rdfs:label ?dbpPlatformName .
          FILTER(lang(?dbpPlatformName) = "en")
        }
  
        OPTIONAL { ?game dbo:abstract ?abstract . FILTER(lang(?abstract) = "en") }
      }
      GROUP BY ?name ?abstract
    `;
  
    try {
      console.log("Generated SPARQL Query:", sparqlQuery); // Log raw query
  
      // Encode only the query parameter for safe transmission
      const response = await axios.get(sparqlEndpoint, {
        params: { query: sparqlQuery, format: "json" },
      });
  
      console.log("SPARQL Response:", response.data); // Log response data
  
      // Extract the result
      const result = response.data.results.bindings[0];
      if (!result) {
        throw new Error(`No data found for game: ${gameName}`);
      }
  
      // Handle optional fields with defaults
      const genres = [
        ...(result.dboGenres?.value?.split(", ") || []),
        ...(result.dbpGenres?.value?.split(", ") || []),
      ];
      const uniqueGenres = [...new Set(genres)];
  
      const platforms = [
        ...(result.dboPlatforms?.value?.split(", ") || []),
        ...(result.dbpPlatforms?.value?.split(", ") || []),
      ];
      const uniquePlatforms = [...new Set(platforms)];
  
      return {
        name: result.name?.value || "Unknown",
        releaseDate: result.releaseDate?.value || "Unknown",
        publishers: result.publishers?.value?.split(", ") || [],
        developers: result.developers?.value?.split(", ") || [],
        genres: uniqueGenres,
        platforms: uniquePlatforms,
        abstract: result.abstract?.value || "No abstract available.",
      };
    } catch (error) {
      console.error(`Error fetching game details for "${gameName}":`, error);
      return null;
    }
  }
  


  