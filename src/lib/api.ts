import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

export const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});
