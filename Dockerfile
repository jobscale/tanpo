FROM node:lts-bullseye-slim
SHELL ["bash", "-c"]
WORKDIR /home/node
USER node
COPY --chown=node:staff  package.json .
RUN npm i --omit=dev
COPY --chown=node:staff  . .
RUN mv db.example db
EXPOSE 3000
CMD ["npm", "start"]
