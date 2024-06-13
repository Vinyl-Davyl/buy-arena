import express from "express";
import { getPayloadClient } from "./get-payload";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms: any) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });
};

start();
