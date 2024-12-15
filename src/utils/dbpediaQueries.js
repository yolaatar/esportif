import axios from "axios";

const isRelevantImage = (imageUrl) => {
  // Liste de mots-clés à rechercher
  const relevantKeywords = ["logo", "cover", "boxart", "artwork"];
  // Liste de mots-clés à exclure
  const irrelevantKeywords = [
    "iphone", "android", "device", "interface", "commons",
    "flag", "screenshot", "icon", "poster", "map"
  ];

  const lowerCaseUrl = imageUrl.toLowerCase();

  // Retourne vrai si l'image contient des mots-clés pertinents et aucun mot-clé indésirable
  return (
    relevantKeywords.some((keyword) => lowerCaseUrl.includes(keyword)) &&
    !irrelevantKeywords.some((keyword) => lowerCaseUrl.includes(keyword))
  );
};



const manualImageOverrides = {
  "World of Warcraft": "https://upload.wikimedia.org/wikipedia/fr/thumb/e/e3/World_of_Warcraft_Logo.png/220px-World_of_Warcraft_Logo.png",
  "League of Legends": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/League_of_Legends_2019_vector.svg/langfr-220px-League_of_Legends_2019_vector.svg.png",
  "Overwatch": "https://upload.wikimedia.org/wikipedia/fr/thumb/d/d9/Overwatch_Logo.png/220px-Overwatch_Logo.png",
  "Super Smash Bros. Ultimate": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Super_Smash_Bros._Ultimate_logo.svg/langfr-220px-Super_Smash_Bros._Ultimate_logo.svg.png",
  "Super Smash Bros. for Nintendo 3DS and Wii U": "https://upload.wikimedia.org/wikipedia/fr/8/89/Super_Smash_Bros._for_Nintendo_3DS_-_Wii_U_Logo.png",
  "Super Smash Bros. Melee": "https://upload.wikimedia.org/wikipedia/fr/7/70/Super_Smash_Bros._Melee_Logo.png",
  "Pacific Championship Series": "https://upload.wikimedia.org/wikipedia/en/5/5f/Pacific_Championship_Series_logo.png",
  "Rocket League Championship Series": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/RLCS_logo.svg/250px-RLCS_logo.svg.png",
  "Overwatch League": "https://upload.wikimedia.org/wikipedia/fr/7/77/Overwatch_League_Logo.png",
  "T1" : "https://upload.wikimedia.org/wikipedia/fr/thumb/f/f9/T1_logo.svg/langfr-1280px-T1_logo.svg.png",
  "Samsung Galaxy": "https://upload.wikimedia.org/wikipedia/en/c/c4/Samsung_Galaxy_Pro-Game_Team.png",
  "Rogue" : "https://upload.wikimedia.org/wikipedia/fr/thumb/7/7c/Rogue_Primary_Logo_v1.png/1280px-Rogue_Primary_Logo_v1.png",
  "Final Boss" : "https://upload.wikimedia.org/wikipedia/en/a/a9/Final_Boss_logo.png",
  "Team 3D" : "https://upload.wikimedia.org/wikipedia/commons/3/38/Team_3D_logo.png"

};

async function fetchWikipediaImage(gameName) {
  // Vérifie si le jeu a une image manuelle
  if (manualImageOverrides[gameName]) {
    return manualImageOverrides[gameName];
  }

  // Logique habituelle
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

        if (isRelevantImage(imageUrl)) {
          return imageUrl;
        }
      }

      // Vérifie les autres images de la page
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
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?tournament ?name ?logo ?abstract
WHERE {
  dbr:List_of_esports_leagues_and_tournaments dbo:wikiPageWikiLink ?tournament .
  ?tournament rdfs:label ?name .
  ?tournament dbo:abstract ?abstract .
  OPTIONAL { ?tournament dbo:thumbnail ?logo . }
  FILTER (
    lang(?name) = "en" && 
    lang(?abstract) = "en" 
  )
  FILTER (
    CONTAINS(LCASE(?name), "world cup") ||
    CONTAINS(LCASE(?name), "championship") ||
    CONTAINS(LCASE(?name), "cup") ||
    CONTAINS(LCASE(?name), "champions") ||
    CONTAINS(LCASE(?name), "tournament") ||
    CONTAINS(LCASE(?name), "invitational") ||
    CONTAINS(LCASE(?name), "league") 
  )
  
}
ORDER BY DESC(strlen(?abstract))
LIMIT 20


    `;

  const params = { query: sparqlQuery, format: "json" };

  try {
    const response = await axios.get(sparqlEndpoint, { params });
    const results = response.data.results.bindings;

    const excludedTournaments = [
      "mobile legends: bang bang southeast asia cup",
      "major league gaming",
      "league of legends", 
      "rocket league",
      "league of legends rift rivals",
      "cyberathlete professional league",
      "professional gamers league",
      "2016 league of legends world championship",
      "rocket league championship series"

    ];
    
    const filteredResults = results.filter(
      (tournament) => !excludedTournaments.includes(tournament.name.value.toLowerCase())
    );
    const finalResults = filteredResults.slice(0, 9);

    return Promise.all(
      finalResults.map(async (tournament) => {
        if (!tournament.name || !tournament.name.value) {
          return { name: "Unknown Tournament", logo: "https://via.placeholder.com/150" };
        }
        const name = tournament.name.value;
        const logo = (await fetchWikipediaImage(name)) || tournament.logo?.value || "https://via.placeholder.com/150";

        return { name, logo };
      })
    );
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
                    WHEN STR(?name) = "Bilibili Gaming" THEN 2
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
                CONTAINS(LCASE(?name), "dragons")
              )
            )
          }
          GROUP BY ?name
        }
      }
      ORDER BY ?priority DESC(strlen(STR(?abstract)))
      LIMIT 9
    `;

  const params = { query: sparqlQuery, format: "json" };

  const cleanTeamName = (name) => name.replace(/\s*\(.*?\)$/, "").trim();

  try {
    const response = await axios.get(sparqlEndpoint, { params });
    const results = response.data.results.bindings;

    return Promise.all(
      results.map(async (team) => {
        if (!team.name || !team.name.value) {
          return { name: "Unknown Team", logo: "https://via.placeholder.com/150" };
        }
        const name = cleanTeamName(team.name.value);
        const logo = (await fetchWikipediaImage(name)) || team.logo?.value || "https://via.placeholder.com/150";

        return { name, logo };
      })
    );
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
  const escapedGameName = gameName.replace(/[()]/g, '\\$&'); // Escape parentheses

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

export async function queryTournamentDetailsByName(tournamentName) {
  const sparqlEndpoint = "https://dbpedia.org/sparql";
  const escapedTournamentName = tournamentName.replace(/"/g, '\\"'); // Escape quotes for SPARQL

  const sparqlQuery = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbp: <http://dbpedia.org/property/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbr: <http://dbpedia.org/resource/>

    SELECT ?name 
           ?game 
           (GROUP_CONCAT(DISTINCT COALESCE(?mostChampLabel, STR(?mostChamp)); SEPARATOR=", ") AS ?mostChamps)
           (GROUP_CONCAT(DISTINCT COALESCE(?mostSuccessfulClubLabel, STR(?mostSuccessfulClub)); SEPARATOR=", ") AS ?mostSuccessfulClubs)
           (MIN(?foundingYear) AS ?oldestFoundingYear)
           (GROUP_CONCAT(DISTINCT COALESCE(?venueLabel, STR(?venue)); SEPARATOR=", ") AS ?venues)
           (GROUP_CONCAT(DISTINCT ?validMotto; SEPARATOR=", ") AS ?mottos)
           (GROUP_CONCAT(DISTINCT COALESCE(?domesticCupLabel, STR(?domesticCup)); SEPARATOR=", ") AS ?domesticCups)
           (GROUP_CONCAT(DISTINCT COALESCE(?relatedCompLabel, STR(?relatedComp)); SEPARATOR=", ") AS ?relatedComps)
           (GROUP_CONCAT(DISTINCT COALESCE(?reverseRelatedCompLabel, STR(?reverseRelatedComp)); SEPARATOR=", ") AS ?reverseRelatedComps)
           (GROUP_CONCAT(DISTINCT COALESCE(?countryLabel, STR(?country)); SEPARATOR=", ") AS ?countries)
           ?website ?abstract
    WHERE {
      dbr:List_of_esports_leagues_and_tournaments dbo:wikiPageWikiLink ?tournament .
      ?tournament rdfs:label ?name .

      # Retrieve the associated game
      OPTIONAL { ?tournament dbp:game ?game . }

      # Handle most champions with labels
      OPTIONAL { 
        ?tournament dbp:mostChamps ?mostChamp .
        OPTIONAL { 
          ?mostChamp rdfs:label ?mostChampLabel .
          FILTER(lang(?mostChampLabel) = "en")
        }
      }

      # Handle most successful clubs with labels
      OPTIONAL { 
        ?tournament dbp:mostSuccessfulClub ?mostSuccessfulClub .
        OPTIONAL { 
          ?mostSuccessfulClub rdfs:label ?mostSuccessfulClubLabel .
          FILTER(lang(?mostSuccessfulClubLabel) = "en")
        }
      }

      # Retrieve founding year
      OPTIONAL { ?tournament dbo:foundingYear ?foundingYear . }

      # Retrieve venues
      OPTIONAL { 
        ?tournament dbp:venue ?venue .
        OPTIONAL { 
          ?venue rdfs:label ?venueLabel .
          FILTER(lang(?venueLabel) = "en")
        }
      }

      # Retrieve mottos ensuring non-empty values
      OPTIONAL { 
        ?tournament dbp:motto ?motto .
        FILTER(BOUND(?motto) && STRLEN(?motto) > 0)
        BIND(?motto AS ?validMotto)
      }

      # Handle domestic cups
      OPTIONAL { 
        ?tournament dbp:domesticCup ?domesticCup .
        OPTIONAL { 
          ?domesticCup rdfs:label ?domesticCupLabel .
          FILTER(lang(?domesticCupLabel) = "en")
        }
      }

      # Retrieve related competitions
      OPTIONAL { 
        ?tournament dbp:relatedComps ?relatedComp .
        OPTIONAL { 
          ?relatedComp rdfs:label ?relatedCompLabel .
          FILTER(lang(?relatedCompLabel) = "en")
        }
      }

      # Retrieve reverse related competitions
      OPTIONAL { 
        ?reverseRelatedComp dbp:relatedComps ?tournament .
        OPTIONAL { 
          ?reverseRelatedComp rdfs:label ?reverseRelatedCompLabel .
          FILTER(lang(?reverseRelatedCompLabel) = "en")
        }
      }

      # Retrieve countries
      OPTIONAL { 
        ?tournament dbp:country ?country .
        OPTIONAL { 
          ?country rdfs:label ?countryLabel .
          FILTER(lang(?countryLabel) = "en")
        }
      }

      # Retrieve website
      OPTIONAL { ?tournament dbp:website ?website . }

      # Retrieve abstract
      OPTIONAL { ?tournament dbo:abstract ?abstract . FILTER(lang(?abstract) = "en") }

      FILTER (
        lang(?name) = "en" &&
        (regex(LCASE(str(?name)), "^${escapedTournamentName.toLowerCase()}$", "i"))
      )
    }
    GROUP BY ?name ?game ?website ?abstract
  `;

  const params = { query: sparqlQuery, format: "json" };

  try {
    const response = await axios.get(sparqlEndpoint, { params });
    const result = response.data.results.bindings[0];

    if (!result) {
      throw new Error(`No data found for tournament: ${tournamentName}`);
    }

    return {
      name: result.name?.value || "Unknown Tournament",
      game: result.game?.value || "Unknown Game",
      mostChamps: result.mostChamps?.value.split(", ") || [],
      mostSuccessfulClubs: result.mostSuccessfulClubs?.value.split(", ") || [],
      oldestFoundingYear: result.oldestFoundingYear?.value || "Unknown",
      venues: result.venues?.value.split(", ") || [],
      mottos: result.mottos?.value.split(", ") || [], // Handle multiple mottos
      domesticCups: result.domesticCups?.value.split(", ") || [],
      relatedComps: result.relatedComps?.value.split(", ") || [],
      reverseRelatedComps: result.reverseRelatedComps?.value.split(", ") || [],
      countries: result.countries?.value.split(", ") || [],
      website: result.website?.value || "No website available.",
      abstract: result.abstract?.value || "No description available.",
    };
  } catch (error) {
    console.error(`Error fetching tournament details for "${tournamentName}":`, error);
    return null;
  }
}

export async function queryTeamDetailsByName(teamName) {
  const sparqlEndpoint = "https://dbpedia.org/sparql";
  const escapedTeamName = teamName.replace(/"/g, '\\"').toLowerCase(); // Escape quotes and convert to lowercase for matching

  const sparqlQuery = `
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbp: <http://dbpedia.org/property/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?name 
           (SAMPLE(?abstract) AS ?abstractValue)
           (COALESCE(MIN(?founded), MIN(?foundingDate), MIN(?foundingYear)) AS ?foundingYear)
           (GROUP_CONCAT(DISTINCT COALESCE(?locationLabel, STR(?location)); SEPARATOR=", ") AS ?locations)
           (GROUP_CONCAT(DISTINCT COALESCE(?dbpGamesLabel, COALESCE(?dbpGameLabel, COALESCE(?dboSportLabel, ?dbpSportLabel))); SEPARATOR=", ") AS ?games)
           (GROUP_CONCAT(DISTINCT ?ceo; SEPARATOR=", ") AS ?ceos)
           (GROUP_CONCAT(DISTINCT COALESCE(?playerLabel, STR(?player)); SEPARATOR=", ") AS ?players)
           (GROUP_CONCAT(DISTINCT COALESCE(?teamOfLabel, STR(?teamOf)); SEPARATOR=", ") AS ?teamOfs)
    WHERE {
      ?team rdfs:label ?name ;
            dct:subject ?category .

      # Restrict to specific categories
      VALUES ?category {
        <http://dbpedia.org/resource/Category:Esports_teams_based_in_South_Korea>
        <http://dbpedia.org/resource/Category:Esports_teams_based_in_the_United_States>
        <http://dbpedia.org/resource/Category:Esports_teams_based_in_China>
      }

      # Match names starting with 'teamName'
      FILTER (lang(?name) = "en" && STRSTARTS(LCASE(?name), "${escapedTeamName}"))

      # Retrieve abstract
      OPTIONAL { ?team dbo:abstract ?abstract . FILTER(lang(?abstract) = "en") }

      # Retrieve founding year: dbp:founded > dbo:foundingDate > dbo:foundingYear
      OPTIONAL { ?team dbp:founded ?founded . }
      OPTIONAL { ?team dbo:foundingDate ?foundingDate . }
      OPTIONAL { ?team dbo:foundingYear ?foundingYear . }

      # Retrieve locations and labels
      OPTIONAL { 
        ?team dbp:location ?location .
        OPTIONAL { ?location rdfs:label ?locationLabel . FILTER(lang(?locationLabel) = "en") }
      }

      # Retrieve games: priority dbp:games > dbp:game > dbo:sport > dbp:sport
      OPTIONAL { 
        ?team dbp:games ?dbpGames .
        FILTER(STRLEN(STR(?dbpGames)) > 0)
        OPTIONAL { ?dbpGames rdfs:label ?dbpGamesLabel . FILTER(lang(?dbpGamesLabel) = "en") }
      }
      OPTIONAL { 
        ?team dbp:game ?dbpGame .
        FILTER(STRLEN(STR(?dbpGame)) > 0)
        OPTIONAL { ?dbpGame rdfs:label ?dbpGameLabel . FILTER(lang(?dbpGameLabel) = "en") }
      }
      OPTIONAL { 
        ?team dbo:sport ?dboSport .
        FILTER(STRLEN(STR(?dboSport)) > 0)
        OPTIONAL { ?dboSport rdfs:label ?dboSportLabel . FILTER(lang(?dboSportLabel) = "en") }
      }
      OPTIONAL { 
        ?team dbp:sport ?dbpSport .
        FILTER(STRLEN(STR(?dbpSport)) > 0)
        OPTIONAL { ?dbpSport rdfs:label ?dbpSportLabel . FILTER(lang(?dbpSportLabel) = "en") }
      }

      # Retrieve CEO
      OPTIONAL { ?team dbp:ceo ?ceo . }

      # Retrieve players from dbp:handle: restrict to strings
      OPTIONAL {
        ?team dbp:handle ?player .
        FILTER(DATATYPE(?player) = xsd:string || ISLITERAL(?player))
        OPTIONAL { ?player rdfs:label ?playerLabel . FILTER(lang(?playerLabel) = "en") }
      }

      # Retrieve "is dbp:team of"
      OPTIONAL {
        ?teamOf dbp:team ?team .
        OPTIONAL { ?teamOf rdfs:label ?teamOfLabel . FILTER(lang(?teamOfLabel) = "en") }
      }
    }
    GROUP BY ?name
  `;

  const params = { query: sparqlQuery, format: "json" };

  try {
    const response = await axios.get(sparqlEndpoint, { params });
    const result = response.data.results.bindings[0];

    if (!result) {
      throw new Error(`No data found for team: ${teamName}`);
    }

    // Merge players and teamOfs into notablePlayers and deduplicate
    const notablePlayers = [
      ...(result.players?.value.split(", ") || []),
      ...(result.teamOfs?.value.split(", ") || []),
    ];
    const uniqueNotablePlayers = [...new Set(notablePlayers)];

    return {
      name: result.name?.value || "Unknown Team",
      abstract: result.abstractValue?.value || "No description available.",
      foundingYear: result.foundingYear?.value || "Unknown",
      locations: result.locations?.value.split(", ") || [],
      games: result.games?.value.split(", ") || [],
      ceos: result.ceos?.value.split(", ") || [],
      notablePlayers: uniqueNotablePlayers,
    };
  } catch (error) {
    console.error(`Error fetching team details for "${teamName}":`, error);
    return null;
  }
}
