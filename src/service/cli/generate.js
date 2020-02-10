const {getRandomInt, shuffle} = require(`../../utils`);
const {
  TITLES,
  SENTENCES,
  CATEGORIES,
  OfferType,
  SumRestrict,
  PictureRestrict,
} = require(`../../data`);
const {ExitCode} = require(`../../constants`);
const fs = require(`fs`);

const MAX_COUNT = 1000;
const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const offerTypes = Object.keys(OfferType);

const getPictureFileName = (number) => `time${String(number).padStart(2, 0)}.jpg`;

const getCategories = (count) => shuffle(CATEGORIES).slice(0, count);

const generateOffer = () => ({
  title: TITLES[getRandomInt(0, TITLES.length - 1)],
  picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
  description: shuffle(SENTENCES).slice(1, 5).join(` `),
  type: offerTypes[getRandomInt(0, 1)],
  sum: getRandomInt(SumRestrict.min, SumRestrict.max),
  category: getCategories(getRandomInt(1, CATEGORIES.length)),
});

const generateOffers = (count) => Array(count).fill({}).map(() => generateOffer());

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countOffer > MAX_COUNT) {
      throw new Error(`Не больше 1000 объявлений`);
    }

    const content = JSON.stringify(generateOffers(countOffer));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        throw new Error(`Can't write data to file...`);
      }

      return console.info(`Operation success. File created.`);
    });
  }
};
