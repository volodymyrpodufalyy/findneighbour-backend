const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for findneighbour",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves data from findneighbour.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "findneighbour",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
};

export default swaggerDefinition;
