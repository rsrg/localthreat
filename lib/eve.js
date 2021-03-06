function esi(path, extra) {
  const url = `https://esi.tech.ccp.is/latest/${path}`;
  const options = Object.assign({
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }, extra);
  return fetch(url, options)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

export default {
  queryIDs(query, categories, strict) {
    const params = [`search=${encodeURIComponent(query)}`];
    if (categories) params.push(`categories=${categories}`);
    if (strict) params.push(`strict=true`);
    const path = `search/?${params.join('&')}`;
    return esi(path);
  },

  getCharacterAffiliation(id) {
    const path = `characters/affiliation/`;
    const method = 'POST';
    const body = `[${id}]`;
    return esi(path, { method, body }).then((json) => {
      const ids = [json[0].corporation_id];
      if (json[0].alliance_id) ids.push(json[0].alliance_id);
      return ids;
    });
  },

  getCharacterKillboard(id) {
    const url = `https://zkillboard.com/api/stats/characterID/${id}/`
    const options = {
      // headers: {
      //   'Accept': 'application/json',
      //   'Content-Type': 'application/json'
      // }
    };
    return fetch(url, options)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },

  getCorporation(id) {
    const path = `corporations/${id}/`;
    return esi(path).then((json) => {
      return { id, name: json.corporation_name };
    });
  },

  getAlliance(id) {
    const path = `alliances/${id}/`;
    return esi(path).then((json) => {
      return { id, name: json.alliance_name };
    });
  },

  getNames(ids) {
    const path = 'universe/names/';
    const method = 'POST';
    const body = `[${ids.join(',')}]`;
    return esi(path, { method, body }).then((json) => {
      return ids.map((id) => {
        const result = json.find((result) => {
          return result.id === id;
        });
        return result ? result.name : '';
      });
    });
  }
}
