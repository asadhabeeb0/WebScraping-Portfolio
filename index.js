require('dotenv').config(); 
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = process.env.WEBSITE_URL;

const writeStream = fs.createWriteStream('output.csv');
writeStream.write('Title,Link\n');

axios.get(url)
  .then((response) => {
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      const projectsContainer = $('#projectsid ul li');

      const projectsData = [];

      projectsContainer.each((i, el) => {
        const title = $(el).find('strong').text().trim();
        const link = $(el).find('a').attr('href');

        projectsData.push(`${title},${link}`);
      });

      projectsData.forEach((project) => {
        writeStream.write(`${project}\n`);
      });

      console.log('Scraping Done...');
    }
  })
  .catch((error) => {
    console.error(error);
});