const {getRandomInt, shuffle, pad} = require(`../../utils`);
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

const getPictureFileName = (number) => `time${pad(number)}.jpg`;

const getCategories = (count) => Array(count).fill(``).map(() => CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]);

const generateOffer = () => ({
  title: TITLES[getRandomInt(0, TITLES.length - 1)],
  picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
  description: shuffle(SENTENCES).slice(1, 5).join(` `),
  type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
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
      console.error(`Не больше 1000 объявлений`);
      process.exit(ExitCode.failure);
      return;
    }

    const content = JSON.stringify(generateOffers(countOffer));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        console.error(`Can't write data to file...`);
        process.exit(ExitCode.failure);
        return;
      }

      process.exit(ExitCode.success);
      return console.info(`Operation success. File created.`);
    });
  }
};
