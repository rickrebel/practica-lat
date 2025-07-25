import axios from "axios";

export default axios.create({
  baseURL: process.env.NUXT_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Remove-Item -Path .\node_modules\ -Recurse -Force