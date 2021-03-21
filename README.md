Built using https://github.com/nomiclabs/hardhat-hackathon-boilerplate <img src="/frontend/public/logo192.png" alt="HardHat log" width="50px"/>

- What3Words - https://what3words.com/
- Fleek - https://fleek.co/ (To storage files)
- GoogleMaps - https://www.google.com/maps 
- jsonbox - https://jsonbox.io/  (To simulate a database service)
- axios - https://github.com/axios/axios (To get data from jsonbox)
- i18n - https://github.com/i18next/react-i18next (For internalization)
- React - front end

# decentreelized
NFT Ethglobal Hackathon

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/fosgate29/decentreelized.git
cd decentreelized
npm install
```

Once installed, let's run Hardhat's testing network:

```sh
npx hardhat node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```
