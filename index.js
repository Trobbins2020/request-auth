"use strict";

const searchURL =
  "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson, maxResults) {
  console.log(responseJson);
  $("#results-list").empty();
  for (let i = 0; (i < responseJson.length) & (i < maxResults); i++) {
    console.log(responseJson[i]);
    $("#results-list").append(
      `<li>
      <h3><a href="${responseJson[i].html_url}" target="_blank">${responseJson[i].name}</a></h3>
        </li>`
    );
  }
  $("#results").removeClass("hidden");
}

function getRepo(handle, maxResults = 100) {
  const params = {
    type: "all",
    sort: "created",
    direction: "asc",
    per_page: maxResults,
    page: 1,
  };
  const queryString = formatQueryParams(params);
  let url = `https://api.github.com/users/${handle}/repos`;
  url += "?" + queryString;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson, maxResults))
    .catch((err) => {
      $("#error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const handle = $("#handle").val();
    const maxResults = $("#max-results").val();
    getRepo(handle, maxResults);
  });
}

$(watchForm);
