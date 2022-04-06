const axios = require('axios')

async function main() {
  try {
    // Get args
    const args = process.argv.slice(2);
    // validation
    if (args.length == 0) {
      throw new Error("Planet not specified !")
    } else if (args.length > 1) {
      throw new Error("Too many arguments !")
    }
    const movieNumber = args[0]
    let isDigit = /^[1-6]{1}$/.test(movieNumber);
    if (!isDigit) {
      throw new Error("Please specify a valid Star Wars movie (Number between 1 and 6) !")
    }

    let planets = await getPlanets(movieNumber)
    let diameter = await process_planets(planets)
    console.log(diameter)
    process.exit(0)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }

}


function getPlanetData(planets) {
  return planets.map(planet => {
    return new Promise(resolve => {
      axios.get(planet)
        .then(function (result) {
          resolve(result.data);
        })
        .catch(function (error) {
          throw new Error(error)
        })

    })
  })
}

async function process_planets(planets) {
  return Promise.all(getPlanetData(planets))
    .then(function (results) {
      total_diameter = 0
      for (let planet of results) {
        if (parseInt(planet.surface_water) > 0 && planet.terrain.includes("mountains")) {
          total_diameter += parseInt(planet.diameter)
        }
      }
      return total_diameter
    })
}


async function getPlanets(movieNumber) {
  try {
    const response = await axios.get(`https://swapi.dev/api/films/${movieNumber}`);
    return response.data.planets
  } catch (error) {
    throw new Error(error)
  }
}

main()