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
    LIMIT 10
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

        return { name, logo };
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
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX dbr: <http://dbpedia.org/resource/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
      SELECT ?team ?name ?logo (COUNT(?link) AS ?crosslinkCount)
      WHERE {
        ?team dct:subject dbr:Category:Esports_teams .
        ?link dbo:wikiPageWikiLink ?team .
        ?team rdfs:label ?name .
        OPTIONAL { ?team dbo:thumbnail ?logo . }
        FILTER (lang(?name) = "en")
      }
      GROUP BY ?team ?name ?logo
      ORDER BY DESC(?crosslinkCount)
      LIMIT 15
    `;
  
    const params = { query: sparqlQuery, format: "json" };
  
    try {
      const response = await axios.get(sparqlEndpoint, { params });
      const results = response.data.results.bindings;
  
      return results.map((team) => ({
        name: team.name.value,
        logo: team.logo?.value || "https://via.placeholder.com/150", // Fallback logo
        crosslinkCount: parseInt(team.crosslinkCount.value, 10),
      }));
    } catch (error) {
      console.error("Error fetching popular teams:", error);
      return [];
    }
  }