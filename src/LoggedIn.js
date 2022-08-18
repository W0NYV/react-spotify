import React, { useEffect, useState } from "react";

const LoggedIn = (props) => {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + props.accessToken
        }
      }).then(res => res.json())
        .then(data => {
          setPosts(data);
          console.log(data);
        });
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Spotifyへログインしました</h1>
      <div>
        <ul>
            {/* {console.log("aaa")} */}
            <li>{posts.display_name}</li>
            {posts.images ? <li><img src={posts.images[0].url}/></li> : <li>画像取得失敗</li>}
        </ul>
      </div>
    </div>
  )
}

export default LoggedIn