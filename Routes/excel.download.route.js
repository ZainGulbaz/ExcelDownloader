import express from "express";
import downloadExcel from "../Controllers/DownloadExcel.js";

const downloadRoute= express.Router();

downloadRoute.get("/downloadexcel",downloadExcel);

export default downloadRoute;