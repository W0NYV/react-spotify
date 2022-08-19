import React, { useEffect, useState } from "react";
import { accessUrl } from "./Spotify";
import Canvas from "./Canvas";

const Login = () => {
  return (
    <div className="Login">
      <h2>ログイン前です</h2>
      <a href={accessUrl}>Spotifyへログイン</a>
    </div>
  )
}

export default Login