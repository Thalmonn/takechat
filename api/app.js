const fetch = require('node-fetch');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Return the URL to access the repositories from Take on GitHub.
function generateURL() {
  const url = new URL('orgs/takenet/repos', 'https://api.github.com/');
  url.searchParams.set('type', 'public');
  url.searchParams.set('sort', 'created'); // Desc for default.
  url.searchParams.set('per_page', 100); // The number of repositories from Take is 97.
  
  return url;
}

// Return an array with 5 C# repositories from Take in asceding order by creation date.
async function getRepositories() {
  const url = generateURL();

  try {
    const response = await fetch(url);
    const repos = await response.json();
    const reposCSharp = repos
      .filter(obj => obj.language === 'C#')
      .slice(0, 5)
      .reverse();
    return reposCSharp;
  } catch (err) {
    console.error(err);
  }
}

app.get('/takenet/repos', async (req, res) => {
    const repos = await getRepositories();
    
    res.send(repos);
});

app.listen(port, () => {
    console.log(`App listening at ${port}`);
});