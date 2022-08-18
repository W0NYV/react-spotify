export const authEndPoint = "https://accounts.spotify.com/authorize";

// const redirectUrl = "http://localhost:3000/";
const redirectUrl = "https://react-spotify-one.vercel.app/";

//本当は見られてはいけない
const clientId = "05cec88ce01b4a4882cf567710c84d0e";

//対応する範囲を決める
const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state"
];

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((inital, item) => {
      let parts = item.split('=');
      inital[parts[0]] = decodeURIComponent(parts[1]);
      return inital;
    }, {});
}

//SpotifyのログインページのURL
export const accessUrl = `${authEndPoint}?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;