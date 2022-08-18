import React, { useEffect, useState } from "react";

const LoggedIn = (props) => {

  const [me, setMe] = useState([]);
  const [artists, setAritists] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);

  useEffect(() => {

    async function fetchData() {

      await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + props.accessToken
        }
      }).then(res => res.json())
        .then(data => {
          setMe(data);
          // console.log(data);
        });

      await fetch('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10&offset=0', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + props.accessToken
        }

      }).then(res => res.json())
        .then(data => {
          
          setAritists(data);

          let resultList = [];
          let processes = [];
          data.items.forEach(item => {
            processes.push(
              fetch('https://api.spotify.com/v1/artists/' + item.id + '/related-artists', 
                { 
                  method: 'GET', 
                  headers: {Authorization: 'Bearer ' + props.accessToken}
                }
              )
            );
          });

          // console.log(processes);

          Promise.all(processes)
            .then((res2 => Promise.all(res2.map(r => r.json()))))
            .then((data2) => {
              setRelatedArtists(data2);
              // console.log(data);
              // resultList = data;
            })
            // .catch(alert);

        });
    }

    // console.log(relatedArtists);

    fetchData();
  }, []);

  return (
    <div>
      <h1>Spotifyへログインしました</h1>
      <div>
        <ul>
            <li>{me.display_name}</li>
            {me.images ? <li><img src={me.images[0].url}/></li> : <li>画像取得失敗</li>}
            {
              artists.items 
                ? artists.items.map((item, index) => {
                  return (
                    <>
                      <br />
                      <br />
                      <li key={item.id}>{item.name}</li>
                      <li><img src={item.images[0].url}/></li>

                      {
                        relatedArtists.length != 0
                          ? relatedArtists[index].artists.map((artist) => {
                            return (
                              <li>{artist.name}</li>
                            )
                          }) 
                          : <li>関連アーティスト取得失敗</li>
                      }

                    </>
                  );
                })
                : <li>取得失敗</li>
            }
        </ul>
      </div>
    </div>
  )
}

export default LoggedIn